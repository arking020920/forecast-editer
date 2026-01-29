import { useState, useRef } from "react";
import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";
import GuardarPronosticoButton from "./GuardarPronosticoButton";
import ShortcutModal from "./ShortCutModal";

export default function Writer() {
  const {
    fechaInicio,
    fechaFin,
    username,
    contenido,
    setContenido,
    currentZone, 
    setCurrentZone,
    shortcuts
  } = useForecast();

  const [openShortcut, setOpenShortcut] = useState(false);
  const pronosticoActual = pronosticos.marino; 
  const zonas = pronosticoActual.zonas;

  // buffer local para detectar "aaa"
  const bufferRef = useRef("");

  const handleKeyDown = (e) => {
    bufferRef.current += e.key;
    if (bufferRef.current.length > 3) {
      bufferRef.current = bufferRef.current.slice(-3);
    }

    if (bufferRef.current === "aaa") {
      const key = zonas[currentZone].contenidoKey;
      const actual = contenido[key] || "";

      // borrar las tres letras "aaa"
      const nuevo = actual.endsWith("aaa") ? actual.slice(0, -3) : actual;
      setContenido({ ...contenido, [key]: nuevo });

      setOpenShortcut(true);
      bufferRef.current = "";
    }
  };

  return (
    <div className="flex flex-col flex-grow p-6">
      {/* Encabezado */}
      <h1 className="text-2xl font-bold mb-2">{pronosticoActual.titulo}</h1>
      <p className="text-sm-3 mb-4 font-bold">
        {pronosticoActual.encabezado
          .replace("{fechaInicio}", fechaInicio.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }))
          .replace("{fechaFin}", fechaFin.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }))
          .slice(0, -105)
          .toLocaleUpperCase()}
      </p>

      {/* Barra de navegación de zonas */}
      <div className="flex items-center justify-center bg-white/40 backdrop-blur-md rounded-md p-2 mb-4">
        {currentZone > 0 && (
          <button onClick={() => setCurrentZone(currentZone - 1)} className="px-2 text-lg">◀</button>
        )}
        <span className="mx-4 font-semibold">{zonas[currentZone].nombre}</span>
        {currentZone < zonas.length - 1 && (
          <button onClick={() => setCurrentZone(currentZone + 1)} className="px-2 text-lg">▶</button>
        )}
      </div>

      {/* Bloque */}
      {zonas[currentZone].nameBloqueInclude && (
        <h2 className="text-lg font-bold uppercase mb-2">{zonas[currentZone].bloque}</h2>
      )}

      {/* Área de escritura */}
      <textarea
        className="flex-grow rounded-lg shadow-inner p-4 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={`Escribe el pronóstico para ${zonas[currentZone].nombre}...`}
        value={contenido[zonas[currentZone].contenidoKey] || ""}
        onChange={(e) =>
          setContenido({
            ...contenido,
            [zonas[currentZone].contenidoKey]: e.target.value,
          })
        }
        onKeyDown={handleKeyDown} // 👈 aquí escuchamos las teclas
      />

      {/* Botón guardar */}
      <div className="mt-4 flex justify-end">
        <div className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
          <GuardarPronosticoButton />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-gray-600 italic">
        {pronosticoActual.cierre.replace("{username}", username)}
      </p>

      {/* Modal de atajos */}
   {openShortcut && (
  <ShortcutModal
    shortcuts={shortcuts} // 👈 aquí pasas los atajos reales
    currentZone={currentZone}
    zonas={zonas}
    onClose={() => setOpenShortcut(false)}
  />
)}

    </div>
  );
}

