import { useEffect } from "react";
import { useForecast } from "../context/ForecastContext";

// util simple: fuerza al navegador a descargar la imagen y guardarla en caché
export const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

// función que avanza una fecha en formato "dd.mm.yyyy.hhutc" por i horas
export function avanzarFecha(fechaStr, i, toForward = true) {
  const [dia, mes, anio, horaUtc] = fechaStr.replace("utc", "").split(".");
  const fecha = new Date(Date.UTC(+anio, +mes - 1, +dia, +horaUtc));

  // sumar o restar horas según toForward
  fecha.setUTCHours(fecha.getUTCHours() + (toForward ? i : -i));

  const dd = String(fecha.getUTCDate()).padStart(2, "0");
  const mm = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = fecha.getUTCFullYear();
  const hh = String(fecha.getUTCHours()).padStart(2, "0");

  return `${dd}.${mm}.${yyyy}.${hh}utc`;
}

// hook que precarga 10 imágenes futuras para variables 0,1,2
export function usePreloadImages(toForward, number, custom=false) {
  const { fechaActual, fechaPrimerArchivoCorrida, cubaOrMarady, mapasZonas } = useForecast();
  if(!fechaActual) return

  useEffect(() => {
    const N = 10; // cuántas imágenes quieres precargar
    const [d0, m0, y0, h0] = fechaPrimerArchivoCorrida.replace("utc", "").split(".");
    const fechaBase = new Date(Date.UTC(+y0, +m0 - 1, +d0, +h0));

    // tope máximo hacia adelante: fecha base + 4 días
    const maxForward = new Date(fechaBase.getTime() + 4 * 24 * 60 * 60 * 1000);

    for (let i = 1; i <= N; i++) {
      const futureDate = avanzarFecha(fechaActual, i, toForward);
      const [fd, fm, fy, fh] = futureDate.replace("utc", "").split(".");
      const fechaFuture = new Date(Date.UTC(+fy, +fm - 1, +fd, +fh));

      // validación de topes
      if (toForward) {
        if (fechaFuture > maxForward) break; // no pasar de fechaBase + 4 días
      } else {
        if (fechaFuture < fechaBase) break; // no retroceder antes de fechaBase
      }

      // recorrer variables 0,1,2
      for (let v = 0; v <= 2; v++) {
        if(!custom){
        const futurePath = `/Mapas/${cOrM[cubaOrMarady]}/${arrayDeZonasMapas[cubaOrMarady][mapasZonas]}/${arrayDeVariables[v]}/${objetoDeEscalas[arrayDeVariables[v]][0]}/${futureDate}.jpeg`;
        preloadImage(futurePath);
        }
        else{
            const customFuturePath = `/Mapas/${cOrM[number]}/${arrayDeZonasMapas[number][0]}/${arrayDeVariables[0]}/${objetoDeEscalas[arrayDeVariables[0]][0]}/${fechaPrimerArchivoCorrida}.jpeg`
            preloadImage(customFuturePath)
        }
        
      }
    }
  }, [fechaActual, fechaPrimerArchivoCorrida, cubaOrMarady, mapasZonas, toForward]);
}
