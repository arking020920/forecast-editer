export function desplazarFecha(fechaStr,fechaPrimeraCorrida, toForward=true, cantidad=1, unidad = 'h' ) {
  // Normalizar cantidad
  const step = Math.abs(Math.round(cantidad));

  // Parsear fechaStr
  const [dia, mes, anio, horaUtc] = fechaStr.replace("utc", "").split(".");
  let fecha = new Date(Date.UTC(parseInt(anio), parseInt(mes) - 1, parseInt(dia), parseInt(horaUtc)));

  // Parsear fechaPrimeraCorrida
  const [d0, m0, y0, h0] = fechaPrimeraCorrida.replace("utc", "").split(".");
  const fechaBase = new Date(Date.UTC(parseInt(y0), parseInt(m0) - 1, parseInt(d0), parseInt(h0)));

  // Calcular desplazamiento
  let desplazamientoMs = 0;
  if (unidad === "h") {
    desplazamientoMs = step * 3600 * 1000;
  } else if (unidad === "d") {
    desplazamientoMs = step * 24 * 3600 * 1000;
  }

  // Aplicar desplazamiento
  if (toForward) {
    fecha = new Date(fecha.getTime() + desplazamientoMs);
  } else {
    fecha = new Date(fecha.getTime() - desplazamientoMs);
  }

  // Formatear salida
  const dd = String(fecha.getUTCDate()).padStart(2, "0");
  const mm = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = fecha.getUTCFullYear();
  const hh = String(fecha.getUTCHours()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy}.${hh}utc`;
}
 export function compararFechas(fechaA, fechaB) {
  // Función auxiliar para parsear
  const parseFecha = (fechaStr) => {
    const [dia, mes, anio, horaUtc] = fechaStr.replace("utc", "").split(".");
    return new Date(Date.UTC(
      parseInt(anio, 10),
      parseInt(mes, 10) - 1,
      parseInt(dia, 10),
      parseInt(horaUtc, 10)
    ));
  };

  const dateA = parseFecha(fechaA);
  const dateB = parseFecha(fechaB);

  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  return 0;
}
export function diferenciaHoras(fechaA, fechaB) {
  // Función auxiliar para parsear el formato dd.mm.yyyy.hhutc
  const parseFecha = (fechaStr) => {
    const [dia, mes, anio, horaUtc] = fechaStr.replace("utc", "").split(".");
    return new Date(Date.UTC(
      parseInt(anio, 10),
      parseInt(mes, 10) - 1,
      parseInt(dia, 10),
      parseInt(horaUtc, 10)
    ));
  };

  const dateA = parseFecha(fechaA);
  const dateB = parseFecha(fechaB);

  // Diferencia en milisegundos
  const diffMs = dateB - dateA;

  // Convertir a horas
  return diffMs / (1000 * 60 * 60);
}
