import { useState } from "react";
import ForecastModal from "./ForecastModal";
import { useForecast } from "../context/ForecastContext";
import RenderPronostico from "./RenderPronostico";
import { SaverPronostico } from "./SaverPronostico";
import ConfigModal from "./ConfigModal";

// 🔹 hook para cargar/guardar atajos
import useShortcuts from "../hooks/useShortcuts";
import ShortcutModal from "./ShortCutModal";
import { LoaderPronostico } from "./LoaderPronostico";

export default function EditorNavbar() {
  const { tipoDePronostico, username, currentZone, contenido, setContenido, zonas, guardarPronostico, selected } = useForecast();
  const [openModal, setOpenModal] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [openShortcut, setOpenShortcut] = useState(false);

  // hook para cargar/guardar atajos
  const { shortcuts, saveShortcuts } = useShortcuts(username);

  // insertar frase en la zona actual
  const insertarFraseEnZona = (phrase) => {
    const key = zonas[currentZone];
    const actual = contenido[key] || "";
    const nuevo = actual ? actual + " " + phrase : phrase;
    setContenido({ ...contenido, [key]: nuevo });
  };

  return (
    <div className="bg-white/40 backdrop-blur-md shadow-md p-4 flex justify-between items-center">
      {/* Botón para abrir modal de pronóstico */}
      <button
        onClick={() => {setOpenModal(true); guardarPronostico()}}
        className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        Tipo de Pronóstico
      </button>

      {/* Mostrar pronóstico actual */}

      {/* Icono de Vista Previa del Documento */}
      <RenderPronostico />
      <SaverPronostico/>
      {selected==3 &&(<LoaderPronostico></LoaderPronostico>)}

      {/* Botón Configuración */}
      <button
        onClick={() => setOpenConfig(true)}
        className="flex items-center px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
      >
        <span className="ml-1">Configuración</span>
      </button>

      {/* Modales */}
      {openModal && <ForecastModal onClose={() => setOpenModal(false)} />}
      {openConfig && (
        <ConfigModal
          username={username}
          shortcuts={shortcuts}
          onSave={saveShortcuts}
          onClose={() => setOpenConfig(false)}
        />
      )}
   
    </div>
  );
}
