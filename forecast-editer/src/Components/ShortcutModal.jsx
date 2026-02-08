import { useState } from "react";
import { useForecast } from "../context/ForecastContext";

export default function ShortcutModal({ shortcuts, currentZone, onClose,zonas }) {
  const [input, setInput] = useState("");
  const { contenido, setContenido } = useForecast();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
        console.log('aKJNHlkjakS')
        console.log(shortcuts)
      const shortcut = shortcuts.find(
        (s) => String(s.id) === String(input) // comparación segura
      );
      console.log(shortcut) 
      if (shortcut) {
        console.log('ka asjdhaskd', currentZone)
        const key = zonas[currentZone].contenidoKey;
        const actual = contenido[key] || "";
        const nuevo = actual ? actual.slice(0,-2) + shortcut.phrase : shortcut.phrase;
        console.log("key usado en modal:", key);
        console.log("contenido antes:", contenido);
        console.log("nuevo valor:", nuevo);

        setContenido({
          ...contenido,
          [key]: nuevo,
        });

        setInput("");
        onClose(); // cerrar modal
      }
      else alert('Ingresa un atajo valido')
      setInput("")
      onClose()
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => {if(Number(e.target.value)) {setInput(e.target.value)}}}
          onKeyDown={handleKeyDown} // 👈 ahora escuchamos Enter aquí
          placeholder="Número del atajo"
          className="border p-2 rounded w-full"
        />
      </div>
    </div>
  );
}
