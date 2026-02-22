// src/utils/checkTasks.js
import { checkFileExistsAndContent } from "../services/api";

export function isNowBetweenMidnightAnd0730() {
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const start = 0;
  const end = 7 * 60 + 30;
  return minutesNow >= start && minutesNow <= end;
}

// Decide si buscamos '00' (madrugada) o '12' (mañana)
// Hecho flexible: si estamos entre 00:00-07:30 o >=23:00 buscamos madrugada '00', en otro caso '12'
export function chooseDayOrNight() {
  const now = new Date();
  if (isNowBetweenMidnightAnd0730() || now.getHours() >= 23) return "00";
  return "12";
}

// Construye ruta completa a partir de la tarea y fechas (usa fechaInicio del contexto)
export function buildFullPath(task, fechaInicio) {
  const year = fechaInicio.getFullYear();
  const monthName = fechaInicio.toLocaleString("es-ES", { month: "long" });
  // capitalizar primera letra
  const monthCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const base = `\\\\10.0.22.182\\ftp\\Marítima\\${year}\\${task.folderName}\\${monthCapitalized}`;
  // si filenameTemplate usa placeholders, reemplazarlos (day0Number, month0Number, yearNumber)
  const day0Number = fechaInicio.getDate() < 10 ? `0${fechaInicio.getDate()}` : `${fechaInicio.getDate()}`;
  const month0Number = (fechaInicio.getMonth() + 1) < 10 ? `0${fechaInicio.getMonth() + 1}` : `${fechaInicio.getMonth() + 1}`;
  const yearNumber = `${fechaInicio.getFullYear()}`;
  const filename = task.fileInfo && task.fileInfo.filenameTemplate
    ? task.fileInfo.filenameTemplate
        .replace("{day0Number}", day0Number)
        .replace("{month0Number}", month0Number)
        .replace("{yearNumber}", yearNumber)
    : (task.fileInfo && task.fileInfo.filenameTemplate) || "";
  return { fullPath: `${base}\\${filename}`, filename, base };
}

// Verifica una tarea (llama al backend)
export async function verifyTask(task, fechaInicio) {
  // correos son manuales
  if (task.type === "correo") {
    return { id: task.id, exists: null, matches: null, manual: true };
  }

  const { fullPath } = buildFullPath(task, fechaInicio);
  // patterns se envían tal cual; backend debe interpretar regex con flags 'i' y tolerar espacios
  const res = await checkFileExistsAndContent({
    fullPath,
    format: task.format,
    patterns: task.patterns
  });
  return { id: task.id, ...res };
}
