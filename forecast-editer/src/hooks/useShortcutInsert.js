import { useEffect } from "react";

/**
 * Hook para insertar frases de atajos en la zona actual del Writer
 * @param {Array} shortcuts - lista de atajos [{id, phrase}]
 * @param {number} currentZone - índice de la zona actual
 * @param {Object} contenido - objeto con el contenido por zona
 * @param {Function} setContenido - setter del contenido
 * @param {Array} zonas - lista de zonas del pronóstico
 * @param {Function} closeModal - función para cerrar el modal de atajos
 * @param {string} input - número escrito en el modal
 */
export default function useShortcutInsert({
  shortcuts,
  currentZone,
  contenido,
  setContenido,
  zonas,
  closeModal,
  input,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        const shortcut = shortcuts.find(
          (s) => s.id === parseInt(input)
        );
        if (shortcut) {
          const key = zonas[currentZone].contenidoKey;
          const actual = contenido[key] || "";
          const nuevo = actual ? actual + " " + shortcut.phrase : shortcut.phrase;
          setContenido({
            ...contenido,
            [key]: nuevo,
          });
          closeModal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, shortcuts, currentZone, contenido, setContenido, zonas, closeModal]);
}
