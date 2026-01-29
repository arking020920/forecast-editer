import { useEffect } from "react";

export default function useAAAListener({
  contenido,
  setContenido,
  zonas,
  currentZone,
  openModal,
}) {
  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (e) => {
      buffer += e.key;
      if (buffer.length > 3) buffer = buffer.slice(-3);

      if (buffer === "aaa") {
        const key = zonas[currentZone];
        const actual = contenido[key] || "";

        // 👇 borra las tres letras "aaa" al final del texto
        const nuevo = actual.endsWith("aaa")
          ? actual.slice(0, -3)
          : actual;

        setContenido({ ...contenido, [key]: nuevo });

        openModal(); // abre el modal
        buffer = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [contenido, setContenido, zonas, currentZone, openModal]);
}
