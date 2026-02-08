import { useForecast } from "../context/ForecastContext";
export function SaverPronostico({}){
  const { guardarPronostico } = useForecast();  

    return(
   <div className="relative inline-block group">
        <button
          onClick={() => guardarPronostico()}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow"
        >
          Save
        </button>
        <span className="absolute top-8 left-1/2 transform -translate-x-1/2 
                         bg-black text-white text-xs rounded px-2 py-1 opacity-0 
                         group-hover:opacity-100 transition">
          Guardar Pronóstico
        </span>
      </div> )
}