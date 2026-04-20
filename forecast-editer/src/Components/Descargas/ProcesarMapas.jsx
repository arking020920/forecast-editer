import { useState } from "react";
export function ProcesarMapas() {
  const [mensaje, setMensaje] = useState("");
  const [showModal, setShowModal] = useState(false);

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
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crear Mapas
      </button>

      {mensaje && (
        <div className="p-2 bg-green-100 text-green-800 rounded">
          {mensaje}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg">
            <h2 className="text-lg font-bold mb-4">Advertencia</h2>
            <p className="text-gray-700 mb-4">
              Generar nuevos mapas eliminará mapas que hayan sido creados anteriormente, 
              esto se hace para evitar la acumulación excesiva de archivos. 
              Si desea continuar con el proceso haga click en <strong>Continuar</strong>. 
              En caso de no estar seguro de la fecha de creación e información en los mapas ya existentes, 
              utilice la Herramienta visualizadora de mapas para poder obtener dicha información. 
              Recuerde que generar los Mapas lleva algún tiempo, así que solo genere nuevos mapas 
              si estos corresponden a corridas diferentes de los modelos en comparación con los que ya se encuentran en la base de datos.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  ejecutar();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcesarMapas;

