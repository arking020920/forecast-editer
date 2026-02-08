import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";

export default function ForecastModal({ onClose }) {
  const { setTipoDePronostico, tipoDePronostico, selected, setSelected, pronosticoDatabase, setContenido, contenido, setCurrentZone } = useForecast();
  const [visible, setVisible] = useState(false);

  // Animación de entrada
  useEffect(() => {
    setVisible(true);
  }, []);

  // Si no hay modal abierto, no renderizamos nada
  if (!onClose) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`bg-white rounded-xl shadow-2xl w-11/12 max-w-4xl h-5/6 flex flex-col p-8 transform transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Encabezado */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Selecciona un tipo de pronóstico
        </h2>

        {/* Lista de pronósticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-y-auto mb-6">
          {pronosticos[tipoDePronostico].map((key, index) => (
            <button
              key={index}
              onClick={() => setSelected(key.id)}
              className={`p-4 rounded-lg shadow-md text-left font-medium transition ${
                selected === key.id
                  ? "bg-blue-500 text-white"
                  : "bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-gray-700"
              }`}
            >
              {pronosticos[tipoDePronostico][index].titulo}
            </button>
          ))}
        </div>

        {/* Botón continuar */}
        <button
          onClick={() => {
            if (Number(selected+1) ) {
              setContenido(pronosticoDatabase[selected])
              setCurrentZone(0)
              console.log('el contenido',contenido)
              onClose(); // cerramos el modal
            }
          }}
          disabled={!Number(selected+1)}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            Number(selected+1)
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continuar
        </button>
      </div>
    </div>,
    document.body
  );
}
