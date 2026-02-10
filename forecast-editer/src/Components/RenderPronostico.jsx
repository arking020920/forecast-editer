import { useState } from "react";
import { createPortal } from "react-dom";
import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";
import { replaceFunction } from "../hooks/useAAAListener";

export default function RenderPronostico() {
  const { tipoDePronostico, fechaInicio, fechaFin, fechaFin1, fechaFin2, username, contenido, selected } = useForecast();
  const [open, setOpen] = useState(false);
  
  const pronosticoActual = pronosticos[tipoDePronostico][selected] || pronosticos.marino[selected];

  // Encabezado
  const encabezado = replaceFunction(pronosticoActual.encabezado, fechaInicio, fechaFin, fechaFin1, fechaFin2)

  // Zonas: nombre en negrita, texto normal
  const zonasTexto = pronosticoActual.zonas.map((z, index) => {
    let textOfTropa =''
    textOfTropa = pronosticoActual.id ==4 && [6,12].includes(index) ? replaceFunction(z.bloque, fechaInicio, fechaFin, fechaFin1, fechaFin2) : z.bloque
  
    const bloque = z.nameBloqueInclude && pronosticoActual.id != 4 ? (
      <p key={`${z.contenidoKey}-bloque`} className="text-[12px] font-bold mt-1">
        {z.bloque}:
      </p>
    ) : null;
    const bloqueTropa = z.nameBloqueInclude && pronosticoActual.id == 4 ? (
      <p key={`${z.contenidoKey}-bloqueT`} className="text-[14px] font-bold uppercase leading-tight">
        {textOfTropa}
      </p>
    ) : null;

    const nombre = (
      <p key={`${z.contenidoKey}-nombre`} className="text-[12px] font-bold  mb-1">
        {z.nombre}
      </p>
    );

    const texto = (
      <p key={`${z.contenidoKey}-texto`} className="text-[12px] mb-4">
        {contenido[z.contenidoKey] || ""}
      </p>
    );

    return (
      <div key={z.contenidoKey}>
        {bloque}
        {bloqueTropa}
        {nombre}
        {texto}
      </div>
      );
  });

  // Firma
  const cierre = pronosticoActual.cierre.replace("{username}", username);

  return (
    <>
      {/* Icono con tooltip */}
      <div className="relative inline-block group">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow"
        >
          📄
        </button>
        <span className="absolute top-8 left-1/2 transform -translate-x-1/2 
                         bg-black text-white text-xs rounded px-2 py-1 opacity-0 
                         group-hover:opacity-100 transition">
          Vista Previa del Documento
        </span>
      </div>

      {/* Modal */}
      {open &&
        createPortal(
          <div className="fixed top-0 left-0 w-[100vw] h-[100vh] z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            {/* Contenedor A4 */}
            <div className="bg-white w-[21cm] max-h-[100vh] overflow-auto rounded-lg shadow-2xl p-[2.5cm] font-[Arial] flex flex-col items-center justify-start text-justify">  
      
              {/* Logo centrado */}
                    <div className="flex justify-center mb-2">
            <img src="maritimaLogo.png" alt="Logo de CMM" className="h-full" />
            </div>

              {/* Encabezado */}
              {pronosticoActual.insertGuion && (
              <p className="text-[14px] font-bold uppercase leading-tight">
                {encabezado.slice(0,-105)}
                <span className="leading-none block">
                {`${encabezado.slice(-104).trim()}---------------------------`}
                </span>
              </p>)}

              {!pronosticoActual.insertGuion &&(
                 <p className="text-[14px] font-bold uppercase leading-tight whitespace-pre-wrap">
                {encabezado}                
              </p>
              )}

              {/* Zonas */}
              <div className="leading-relaxed whitespace-pre-wrap w-[100%]">
                {zonasTexto}
              </div>

              {/* Firma */}
              <p className="text-[12px] font-bold mt-6">
                {cierre}
              </p>

              {/* Botón cerrar */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
