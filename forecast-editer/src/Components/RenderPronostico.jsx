import { useState } from "react";
import { createPortal } from "react-dom";
import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";

export default function RenderPronostico() {
  const { tipoDePronostico, fechaInicio, fechaFin, username, contenido } = useForecast();
  const [open, setOpen] = useState(false);

  const pronosticoActual = pronosticos[tipoDePronostico] || pronosticos.marino;

  // Encabezado
  const encabezado = pronosticoActual.encabezado
    .replace("{fechaInicio}", fechaInicio.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }))
    .replace("{fechaFin}", fechaFin.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }))
    .toUpperCase();

  // Zonas: nombre en negrita, texto normal
  const zonasTexto = pronosticoActual.zonas.map((z) => {
    const bloque = z.nameBloqueInclude ? (
      <p key={`${z.contenidoKey}-bloque`} className="text-[12px] font-bold uppercase mt-4 mb-2">
        {z.bloque}:
      </p>
    ) : null;

    const nombre = (
      <p key={`${z.contenidoKey}-nombre`} className="text-[12px] font-bold uppercase mb-1">
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
            <div className="bg-white w-[21cm] h-[29.7cm] overflow-y-auto rounded-lg shadow-2xl p-[2.5cm] font-[Arial] text-justify">
              
              {/* Logo centrado */}
                    <div className="flex justify-center mb-2">
            <img src="maritimaLogo.png" alt="Logo de CMM" className="h-full" />
            </div>

              {/* Encabezado */}
              <p className="text-[14px] font-bold uppercase mb-4">
                {encabezado.slice(0,-105)}
                <br />
                {`${encabezado.slice(-104).trim()}------------------------------`}
              </p>

              {/* Zonas */}
              <div className="leading-relaxed whitespace-pre-wrap">
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
