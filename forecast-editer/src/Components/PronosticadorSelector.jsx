import { useState } from "react";
import { createPortal } from "react-dom";
import { useForecast } from "../context/ForecastContext";

export default function PronosticadorSelector({ pronosticoActual }) {
  const { tempSeleccion, elaboratedBy, setElaboratedBy } = useForecast();
  const [openModal, setOpenModal] = useState(false);
  const [seleccionTemporal, setSeleccionTemporal] = useState([tempSeleccion[0]]);
  //console.log('Este es el temp', tempSeleccion)
  // Toggle selección
  const toggleSeleccion = (nombre) => {
    setSeleccionTemporal((prev) => {
      const copia = [...prev];
      if (copia.includes(nombre)) {
        return copia.filter((n) => n !== nombre);
      } else {
        return [...copia, nombre];
      }
    });
  };

  // Confirmar selección
  const confirmarSeleccion = () => {
    if (seleccionTemporal.length > 0) {
      setElaboratedBy(seleccionTemporal.join(", "));
    }
    setOpenModal(false);
  };

  return (
    <>
      {/* Párrafo con icono */}
      <p className="mt-6 text-sm text-gray-600 italic flex items-center space-x-2">
        <span>
          {pronosticoActual.cierre.replace("{username}", elaboratedBy)}
        </span>
        <button
          onClick={() => {
            //console.log('Tipo y valor', typeof(elaboratedBy), elaboratedBy)
            setSeleccionTemporal(elaboratedBy ? elaboratedBy.split(", ") : []);
            setOpenModal(true);
          }}
          className="text-gray-400 hover:text-gray-600 transition"
          title="Seleccionar pronosticadores"
        >
          ✎
        </button>
      </p>

      {/* Modal de selección */}
      {openModal &&
        createPortal(
          <div className="fixed inset-0 w-screen h-screen bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white w-96 rounded shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-center">
                Seleccionar Pronosticadores
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tempSeleccion.map((nombre, i) => (
                  <label key={i} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={seleccionTemporal.includes(nombre)}
                      onChange={() => toggleSeleccion(nombre)}
                    />
                    <span>{nombre}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setOpenModal(false)}
                  className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarSeleccion}
                  className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
