import { useState } from "react";
import { VariableButton } from "./VariableButton";
import { useForecast } from "../../context/ForecastContext";
import { arrayDeVariables, arrayDeZonasMapas, cOrM, objetoDeEscalas, } from "../../data/mapaUtils";

export default function ControlBar({showModal, setShowModal, ampliar=true, imagePath, setImagePath}) {
  const [showVariables, setShowVariables] = useState(false);

  const {cubaOrMarady,
        mapasZonas,variables,
        fechasMapas, setCubaOrMarady, setMapasZonas
        } =useForecast()
  const changeCubaOrMarady=()=>{
        const value =  cubaOrMarady ===0 ? 1 : 0
        console.log(value)
        if(mapasZonas>5 && cubaOrMarady===1){
          setMapasZonas(0)
        setImagePath(`/Mapas/${cOrM[value]}/${arrayDeZonasMapas[value][0]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechasMapas}.jpeg`)
        setCubaOrMarady(value)
        }
        else{
        setCubaOrMarady(value)
        setImagePath(`/Mapas/${cOrM[value]}/${arrayDeZonasMapas[value][mapasZonas]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechasMapas}.jpeg`)
        }}
  const changeZone = (toForward) =>{
    let actualZone = mapasZonas
    if((toForward && mapasZonas+1>arrayDeZonasMapas[cubaOrMarady].length-1) || (!toForward && mapasZonas-1 <0)) return
  
    if(toForward){
      setMapasZonas(mapasZonas+1)
      actualZone=actualZone+1
    }
    else {setMapasZonas(mapasZonas-1)
    actualZone=actualZone-1}
    setImagePath(`/Mapas/${cOrM[cubaOrMarady]}/${arrayDeZonasMapas[cubaOrMarady][actualZone]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechasMapas}.jpeg`)
    }
  return (
    <div
      className="
        bg-gray-900 bg-opacity-80 text-white
        px-6 py-3 rounded-lg shadow-lg
        flex items-center space-x-6
        backdrop-blur-sm
        transition-all duration-300
      "
    >
      {/* Flechas temporales */}
      <button className="p-2 rounded hover:bg-gray-700 transition" onClick={()=> changeZone(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="p-2 rounded hover:bg-gray-700 transition"  onClick={()=> changeZone(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Botón Variables */}
      <div className="relative">
      <button
  onClick={() => setShowVariables(!showVariables)}
  className="
    w-22 h-14 rounded-lg shadow-lg bg-white
    bg-center bg-cover bg-no-repeat
    hover:scale-105 transition-transform duration-300
  "
  style={{
    backgroundImage: "url('/variables.png')",
  }}
  title="Variables meteorológicas"
></button>

        {showVariables && (
          <div
            className="
              absolute top-full mt-2 left-0
              flex flex-col bg-transparent rounded shadow-lg
              animate-fadeIn
            "
          >
            <VariableButton ruta={'/redondeada.png'} tipo={0} setImagePath={setImagePath} setShowVariables={setShowVariables}></VariableButton>
            <VariableButton ruta={'/mardeviento.png'} tipo={1} setImagePath={setImagePath} setShowVariables={setShowVariables}></VariableButton>
            <VariableButton ruta={'/leva.png'} tipo={2} setImagePath={setImagePath} setShowVariables={setShowVariables}></VariableButton>
            <VariableButton ruta={'periodo.png'} tipo={3} setImagePath={setImagePath} setShowVariables={setShowVariables}></VariableButton>
          
          </div>
        )}
      </div>
        {ampliar &&(
        <button
          onClick={() => setShowModal(true)}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          Ampliar
        </button>)}
      {/* Botón cambio de zona */}
      <button className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 transition cursor-pointer">
        Cambiar Zona
      </button>

      {/* Botón Cuba/Mares */}
      <button className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 transition cursor-pointer" onClick={()=> changeCubaOrMarady()}>
        {cubaOrMarady === 0 ? 'Cuba' : 'Marady'}
      </button>
    </div>
  );
}
