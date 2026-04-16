import { useState, useEffect, use } from "react";
import LoadingSpinner from "./LoadingIcon";
import ProcesarMapas from "./ProcesarMapas";

export default function GestorDescargas({ arrayDeUrls }) {
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [temporalAdvertencia, setTemporalAdvertencia] = useState(false)
  const [ultimaInfo, setUltimaInfo] = useState('')

  const handleDownload = async (ruta) => {
    setStatus("Descargando datos...");
    setProgress(0);

    // Lanza la descarga
    try {
      const response = await fetch(ruta);
      const result = await response.json();
      setStatus(result.message);
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error en la descarga.");
    }
  };

  // Polling cada 5 segundos
useEffect(() => {
  setTemporalAdvertencia(true);

  const interval = setInterval(async () => {
    try {
      // Iterar sobre todas las URLs
      for (const v of arrayDeUrls) {
        const resp = await fetch(`http://localhost:5000/progress?folder=${v[2]}`);
        const data = await resp.json();
        // Aquí puedes decidir si acumulas resultados o solo tomas el último
        setProgress(data.progress);
        setStatus(data.message);
        
        
      }
          // Consultar la info legible del último dataset
      const respInfo = await fetch("http://localhost:5000/info-gfswave");
      const infoData = await respInfo.json();
      setUltimaInfo(JSON.stringify(infoData.message))

      // Aquí guardas el mensaje en un estado adicional
      setTemporalAdvertencia(false);
    } catch (err) {
      console.error("Error al consultar progreso:", err);
      setStatus("Demora al recibir respuesta del servidor, algo pudo haber salido mal, revise los datos.");
      setTemporalAdvertencia(false);
        
    }
     
  }, 5000);

  return () => clearInterval(interval);
}, []);

  return (
    <section className="bg-white shadow-lg rounded-lg p-4 border border-blue-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Gestor de Descargas</h2>
        {temporalAdvertencia && (<LoadingSpinner></LoadingSpinner>)}
      {arrayDeUrls.map((v, index)=>(
        <div className="flex justify-between" key={index}>
        <span>{v[1]}</span>
        {ultimaInfo && (<span>{ultimaInfo}</span>)}
         <ProcesarMapas></ProcesarMapas>
      <button 
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 ml-[10px]"
        onClick={() => handleDownload(v[0])}
      >
       
        Descargar
      </button></div>))}

      <div className="w-full bg-gray-200 rounded mt-4">
        <div
          className="bg-blue-600 text-xs leading-none py-1 text-center text-white rounded transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-700">{status}</p>
    </section>
  );
}
