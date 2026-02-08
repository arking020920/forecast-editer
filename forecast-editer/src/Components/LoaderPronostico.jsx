import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";
export function LoaderPronostico({type='CARIBE'}){
  const { tipoDePronostico, selected, pronosticoDatabase, guardarPronostico, setContenido } = useForecast();  
  const pronosticoActual = pronosticos[tipoDePronostico][selected] || pronosticos.marino[selected];
  const name = type === 'CARIBE' ? 'Cargar Texto desde el Costa de Cuba' : 'null'  

  const cargarPronosticoDelCosta = () =>{
    if(type==='CARIBE'){
        setContenido(pronosticoDatabase[2])
        guardarPronostico()
    }
  }
    return(
   <div className="relative inline-block group">
        <button
          onClick={() => cargarPronosticoDelCosta()}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow"
        >
          📄
        </button>
        <span className="absolute top-8 left-1/2 transform -translate-x-1/2 
                         bg-black text-white text-xs rounded px-2 py-1 opacity-0 
                         group-hover:opacity-100 transition">
          {name}
        </span>
      </div> )
}