// src/utils/buildPath.js
import { replaceFunction } from "../hooks/useAAAListener";

// Devuelve el mes con la primera letra en mayúscula (Ej: "Enero")
export function monthCapitalized(date) {
  const m = date.toLocaleString("es-ES", { month: "long" });
  return m.charAt(0).toUpperCase() + m.slice(1);
}

// Construye la ruta base para tareas type: save
export function buildFullPathForSave(task, fechaInicio, fechaFin, fechaFin1, fechaFin2, yearOverride) {
  const year = yearOverride || fechaInicio.getFullYear();
  const month = monthCapitalized(fechaInicio);
  // task.route debe contener la carpeta (ej. "CARIBE" o "Marady FQCU40.12")
  const base = `\\\\10.0.22.182\\ftp\\Marítima\\${year}\\${task.route}\\${month}`;
  return base;
}

// Construye nombre dinámico usando replaceFunction y la plantilla (si la tienes)
export function buildDynamicFileName(template, fechaInicio, fechaFin, fechaFin1, fechaFin2, isDayAndNight = true, isDay = true, isMariel = false) {
  if (!template) return "";
  return replaceFunction(template, fechaInicio, fechaFin, fechaFin1, fechaFin2, isDayAndNight, isDay, isMariel);
}
