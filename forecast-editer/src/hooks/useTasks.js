// src/hooks/useTasks.js
import { useState } from "react";
import { tareas as initialTasks } from "../data/tasks";
import { buildFullPathForSave } from "../utils/buildPaths";
import { checkSave, checkSaveInRed } from "../services/api";
import { pronosticos } from "../data/pronosticos";
import { replaceFunction } from "./useAAAListener";
import { routesOfMaritima } from "../data/routesOfMaritima";

export function useTasks({ fechaInicio, fechaFin, fechaFin1, fechaFin2, pronosticoActual, isDay, isMariel }) {
  const [taskList, setTaskList] = useState(initialTasks.map(t => ({ ...t, status: "unknown", details: null })));
  const [loading, setLoading] = useState(false);

  function isDayTimeNow() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return minutes >= (8*60 + 30) && minutes <= (23*60);
  }

  // toggle manual only for correo tasks
  function toggleManual(id) {
    setTaskList(prev => prev.map(t => t.id === id && t.type === "correo"
      ? { ...t, status: t.status === "done" ? "manual" : "done" }
      : t));
  }

  async function actualizarTareas() {
    setLoading(true);

    const results = await Promise.all(taskList.map(async (task) => {
      try {
        if (task.type === "correo") {
          // preserve manual state
          return { id: task.id, status: task.status || "manual", details: task.details || null };
        }

        if (task.type === "save") {
           
            // Carpeta base
            const base = buildFullPathForSave(task, fechaInicio, fechaFin, fechaFin1, fechaFin2);
          
            // Plantilla del nombre de archivo desde pronosticos.marino
            let nameOfsaveTask = "";
            let routesName = "";
          
            if (task.name || task.name === 0) {
             
              try {
                nameOfsaveTask = replaceFunction(
                  pronosticos.marino[task.name].archivoName,
                  fechaInicio, fechaFin, fechaFin1, fechaFin2,
                  pronosticoActual.isDayAndNight,
                  isDay,
                  isMariel
                );
                console.log("replaceFunction devolvió:", nameOfsaveTask);
              } catch (err) {
                console.error("Error en replaceFunction:", err);
              }
              
              routesName = routesOfMaritima[task.name];
            }
            
          
            // Casos especiales que sobreescriben routesName
            if (task.id === "marady-noche") {
              routesName = routesOfMaritima[6];
            }
            if (task.id === "costas-cuba-noche") {
              routesName = routesOfMaritima[7];
            }
            if (task.id === "mariel-manana") {
              routesName = routesOfMaritima[8];
            }
          
            // Ruta completa con nombre dinámico
            const fullPath = `${base}\\${nameOfsaveTask}.docx`;
            console.log(fullPath)
            // Llamada al backend
            const res = await checkSave({ fullPath });
            console.log("Entrando en bloque SAVE para:", task.id, "fullPath:", fullPath);
            return { id: task.id, status: res.exists ? "done" : "missing", details: { ...res, nameOfsaveTask, routesName } };
          }
          

        if (task.type === "saveInRed") {
          // expectedPattern: MUHV{day0}{dayOrNight}00 (frontend builds)
          const day0 = fechaInicio.getDate() < 10 ? `0${fechaInicio.getDate()}` : `${fechaInicio.getDate()}`;
          const dayOrNight = isDay ? "12" : "00";
          const expectedPattern = `MUHV\\s*${day0}${dayOrNight}00`;
          const res = await checkSaveInRed({ fileName: task.fileName, routes: task.routes, expectedPattern });
          const status = (res.found && res.matched) ? "done" : (res.found ? "exists-no-match" : "missing");
          return { id: task.id, status, details: res };
        }

        return { id: task.id, status: "unknown", details: null };
      } catch (err) {
        return { id: task.id, status: "error", details: { message: err.message } };
      }
    }));

    setTaskList(prev => prev.map(t => {
      const r = results.find(x => x.id === t.id);
      return r ? { ...t, status: r.status, details: r.details } : t;
    }));

    setLoading(false);
  }

  return { taskList, actualizarTareas, loading, toggleManual, setTaskList };
}
