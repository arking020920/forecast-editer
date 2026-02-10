import { useForecast } from "../context/ForecastContext";
export function SaverPronostico({}){
  const { guardarPronostico, handleLoad } = useForecast();  

    return(
   <div className="relative inline-block">
  {/* Botón guardar */}
  <div className="relative inline-block group">
    <button
      onClick={() => guardarPronostico()}
      className="px-1 mx-2 py-2 rounded-md bg-gray-200 text-white rounded-full hover:bg-gray-300 transition"
    >
      <img src="saveicon.png" alt="Guardar pronóstico" className="w-[35px] h-[35px]" />
    </button>
    <span className="absolute top-8 left-1/2 transform -translate-x-1/2 
                     bg-black text-white text-xs rounded px-2 py-1 opacity-0 
                     group-hover:opacity-100 transition">
      Guarda una copia de Seguridad para evitar pérdidas
    </span>
  </div>

  {/* Botón cargar */}
  <div className="relative inline-block group">
    <button
      onClick={() => handleLoad()}
      className="px-1 py-2 rounded-md bg-gray-200 text-white hover:bg-gray-300 transition"
    >
      <img src="loadicon.png" alt="Cargar pronóstico" className="w-[35px] h-[35px]" />
    </button>
    <span className="absolute top-8 left-1/2 transform -translate-x-1/2 
                     bg-black text-white text-xs rounded px-2 py-1 opacity-0 
                     group-hover:opacity-100 transition">
      Carga los datos de la copia de seguridad guardada
    </span>
  </div>
</div>
    )
}