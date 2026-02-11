import { useState } from "react";
import { useForecast } from "../context/ForecastContext";

export default function ShortcutModal({ shortcuts, currentZone, onClose,zonas }) {
  const [input, setInput] = useState("");
  const { contenido, setContenido } = useForecast();

  const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    const shortcut = shortcuts.find(
      (s) => String(s.id) === String(input)
    );

    if (shortcut) {
      const key = zonas[currentZone].contenidoKey;
      const actual = contenido[key] || "";

      // Intentar recuperar la posición guardada por el trigger "aaa"
      let stored = null;
      try {
        const raw = sessionStorage.getItem('lastShortcutState');
        stored = raw ? JSON.parse(raw) : null;
      } catch (err) {
        stored = null;
      }

      // Si la posición guardada corresponde a la misma zona, usarla
      if (stored && stored.zoneKey === key && Number.isFinite(stored.cursorPos)) {
        const pos = Math.max(0, Math.min(Number(stored.cursorPos), actual.length));
        const nuevo = actual.slice(0, pos) + ' ' + shortcut.phrase + actual.slice(pos);

        setContenido({
          ...contenido,
          [key]: nuevo,
        });
        // reenfocar el input original y colocar el caret justo después del atajo insertado
        setTimeout(() => {
          const el = document.querySelector("textarea"); // o mejor: usa una ref al campo de edición
          if (el && typeof el.selectionStart === "number") {
            // pos es la posición guardada antes de insertar
            const newPos = pos + shortcut.phrase.length + 1; // +1 por el espacio añadido
            el.focus();
            el.selectionStart = newPos;
            el.selectionEnd = newPos;
          }
        }, 0);



        // limpiar la posición guardada para no reutilizarla
        try { sessionStorage.removeItem('lastShortcutState'); } catch (err) {}
      } else {
        // comportamiento original si no hay posición guardada o zona distinta
        const nuevo = actual ? actual.slice(0, -2) + shortcut.phrase : shortcut.phrase;
        setContenido({
          ...contenido,
          [key]: nuevo,
        });
      }

      setInput("");
      onClose();
    } else {
      alert('Ingresa un atajo valido');
      setInput("");
      onClose();
    }
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
