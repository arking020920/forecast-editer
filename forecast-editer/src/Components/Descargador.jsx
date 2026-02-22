// src/components/Descargador.jsx
import { useTasks } from "../hooks/useTasks";
import { useForecast } from "../context/ForecastContext"; // para obtener fechas si las tienes en el contexto
import { pronosticos } from "../data/pronosticos";
import { replaceFunction } from "../hooks/useAAAListener";
import { routesOfMaritima } from "../data/routesOfMaritima";
import { useTheme } from "../context/ToggleContext";
export default function Descargador() {
  // si manejas fechas en el contexto ForecastProvider, las tomamos de ahí
    const { fechaInicio, fechaFin, fechaFin1, fechaFin2, tipoDePronostico,selected } = useForecast();
    const pronosticoActual = pronosticos[tipoDePronostico][selected] || pronosticos.marino[selected];
    const {isDay} = useTheme()
    const isMariel = pronosticoActual.id ==5 ? true : false
    const { taskList, actualizarTareas, loading, toggleManual } = useTasks({ fechaInicio, fechaFin, fechaFin1, fechaFin2, pronosticoActual, isDay, isMariel });
    const now = new Date();
    const yearNumber = now.getFullYear(); // e.g. 2026
    const monthCapitalized = now.toLocaleString("es-ES", { month: "long" }).replace(/^./, s => s.toUpperCase()); // e.g. "Febrero"


  return (
    <div className="grid grid-cols-2 gap-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      {/* Columna izquierda: gestor de descargas */}
      <section className="bg-white shadow-lg rounded-lg p-4 border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Gestor de Descargas</h2>
        <ul className="space-y-3">
          <li className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
            <span>Archivo GRIB2 - Viento</span>
            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Descargar</button>
          </li>
          <li className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
            <span>Archivo GRIB2 - Olas</span>
            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Descargar</button>
          </li>
        </ul>
      </section>

      {/* Columna derecha: lista de tareas */}
      <section className="bg-white shadow-lg rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Lista de Tareas</h2>
          <button
            onClick={actualizarTareas}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar tareas"}
          </button>
        </div>

        <ul className="space-y-3">
          {taskList.map(task => {
            let nameOfsaveTask=''
            let routesName=''
            if(task.name || task.name===0){
                nameOfsaveTask = replaceFunction(pronosticos.marino[task.name].archivoName,fechaInicio, fechaFin, fechaFin1, fechaFin2, pronosticoActual.isDayAndNight, isDay, isMariel)
                routesName = routesOfMaritima[task.name]}
            if(task.id==='marady-noche'){
                routesName = routesOfMaritima[6]
            }
            if(task.id==='costas-cuba-noche'){
                routesName = routesOfMaritima[7]
            }
            if(task.id==='mariel-manana'){
                routesName = routesOfMaritima[8]
            }
            return(
            <li key={task.id} className="flex items-start justify-between bg-blue-50 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                {/* checkbox visual, no editable por el usuario */}
                <input
                  type="checkbox"
                  checked={task.status === "done"}
                  readOnly
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-blue-700">{task.text}</strong>
                    <span className="text-sm text-blue-500">({task.deadline})</span>
                  </div>
                  {task.type !== "correo" && task.filePattern && (
                    <div className="text-xs text-gray-500 mt-1">Verificación por contenido</div>
                  )}
                  {task.type === "saveInRed" && (
                    <div className="text-xs text-gray-500 mt-1">Archivos: {task.fileName} en Pron-Nac / telex</div>
                  )}
                  {task.type === "save" && (
                    <div className="text-xs text-gray-500 mt-1">Archivo: {nameOfsaveTask} en \\10.0.22.182\ftp\Marítima\{routesName}\{yearNumber}\{monthCapitalized}</div>
                  )}
                 
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {task.type === "correo" ? (
                  <button
                    onClick={() => toggleManual(task.id)}
                    className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded"
                  >
                    {task.status === "done" ? "Cancelar":"Completar"}
                  </button>
                ) : (
                  <span className="text-xs text-gray-500">Se verifica al actualizar</span>
                )}
              </div>
            </li>)
          })}
        </ul>
      </section>
    </div>
  );
}
