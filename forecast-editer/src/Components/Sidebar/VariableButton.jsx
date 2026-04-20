  import { useForecast } from "../../context/ForecastContext"
import { arrayDeVariables, arrayDeZonasMapas, cOrM, objetoDeEscalas, } from "../../data/mapaUtils";
  export function VariableButton({ruta, tipo, setImagePath, setShowVariables}){
    const textArray=['Altura significativa de la ola redoneada a la escala del costa de Cuba', 'Altura significativa de la ola con vástagos de viento', 'Altura de la ola asociada al mar de leva', 'Periodo de la ola']
    const {cubaOrMarady,
        mapasZonas,
        fechasMapas,setVariables
        } =useForecast()
    const changeVariable=(tipo)=>{
    if(tipo !== 3){
      setVariables(tipo)
      setImagePath(`/Mapas/${cOrM[cubaOrMarady]}/${arrayDeZonasMapas[cubaOrMarady][mapasZonas]}/${arrayDeVariables[tipo]}/${objetoDeEscalas[arrayDeVariables[tipo]][0]}/${fechasMapas}.jpeg`)
    }
    else if(tipo ===3){
      setImagePath(`/Mapas/${arrayDeVariables[tipo]}/${fechasMapas}.jpeg`)
    }
    setShowVariables(false)
  }

    return(
    <button
    onClick={()=> changeVariable(tipo)}
  className="
    w-22 h-14 rounded-lg shadow-lg bg-white
    bg-center bg-cover bg-no-repeat
    hover:scale-150 transition-transform duration-300 mb-1
  "
  style={{
    backgroundImage: `url(${ruta})`,
  }}
  title={textArray[tipo]}
></button>
)}