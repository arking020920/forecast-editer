import { useState } from "react";

export function ProcesarMapas() {
  const [mensaje, setMensaje] = useState("");

  const ejecutar = async () => {
    setMensaje("Iniciando proceso...");
    await fetch("http://localhost:5000/run", { method: "POST" });

    // Polling cada 5 segundos para consultar estado
    const interval = setInterval(async () => {
      const res = await fetch("http://localhost:5000/status");
      const data = await res.json();
      if (data.done) {
        clearInterval(interval);
        setMensaje("¡Proceso terminado!");
      }
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={ejecutar}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crear Mapas
      </button>
      {mensaje && (
        <div className="p-2 bg-green-100 text-green-800 rounded">
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default ProcesarMapas;

