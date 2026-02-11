import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";
export function LoaderPronostico({type='CARIBE'}){
  const { tipoDePronostico, selected, pronosticoDatabase, guardarPronostico, setContenido, contenido } = useForecast();  
  const pronosticoActual = pronosticos[tipoDePronostico][selected] || pronosticos.marino[selected];
  let name = [3,4].includes(pronosticoActual.id) ? 'Cargar Texto desde el Costa de Cuba' : 'null'  
  name = pronosticoActual.id == 5 ? 'Copiar pronóstico de viento para todas las zonas' : name

  const cargarPronosticoDelCosta = () =>{
    if(pronosticoActual.id ==3 ){
        setContenido(pronosticoDatabase[2])
        guardarPronostico()
    }
    else if (pronosticoActual.id == 4){
        const newContenido = structuredClone(contenido)
        pronosticoActual.zonas.map((value, index)=>{
          if(index < 6){
          newContenido[value.contenidoKey] = pronosticoDatabase[2][value.contenidoKey] }
          return newContenido
        })
        setContenido(newContenido)
        guardarPronostico()
    } 
    else if (pronosticoActual.id == 5){
      const st = contenido.zona2;
      const firstNewlineIndex = st.indexOf('\n');
      const result = firstNewlineIndex !== -1 
        ? st.slice(0, firstNewlineIndex) 
        : st; // si no hay \n, devuelve toda la cadena
      const newContenido = structuredClone(contenido)
      newContenido.zona3 = result
      newContenido.zona4 = result
      setContenido(newContenido)
      guardarPronostico()

    }
  }
    return(
   <div className="relative inline-block group">
        <button
          onClick={() => cargarPronosticoDelCosta()}
          className="p-2 mx-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow"
        >
          📄
        </button>
        <span className="absolute top-8 left-1/2 transform -translate-x-1/2 
                         bg-black text-white text-xs rounded px-2 py-1 opacity-0 
                         group-hover:opacity-100 transition z-[9999]" >
          {name}
        </span>
      </div> )
}