import { useEffect, useState } from "react";
import { VariableButton } from "./VariableButton";
import { useForecast } from "../../context/ForecastContext";
import { arrayDeVariables, arrayDeZonasMapas, cOrM, objetoDeEscalas, } from "../../data/mapaUtils";
import { usePreloadImages } from "../../hooks/usePreloadImages";
import { desplazarFecha, compararFechas, diferenciaHoras } from "../../utils/calcularFecha";

export default function ControlBar({setShowModal, ampliar=true, setImagePath}) {
  const [showVariables, setShowVariables] = useState(false);
  const {cubaOrMarady,
        mapasZonas,variables,
        fechasMapas, setCubaOrMarady, setMapasZonas, ultimaInfo, setUltimaInfo, fechaPrimerArchivoCorrida, setFechaPrimerArchivoCorrida, setFechasMapas, 
        selected, currentZone,  setCurrentZone, cambioDeZona, zonas,pasoTemporal, isGFSState, setIsGFSState
        } =useForecast()
  const opacityZoneForward = arrayDeZonasMapas[cubaOrMarady].length-1 == mapasZonas ? 0.2 : 1
  const opacityZoneBackward = 0 == currentZone ? 0.2 : 1
  const [opacityFechaForward, setOpacityFechaForward] = useState(1);
  const [opacityFechaBackward, setOpacityFechaBackward] = useState(1);
  
useEffect(() => {
  const forward = compararFechas(
    desplazarFecha(fechasMapas, fechaPrimerArchivoCorrida),
    desplazarFecha(fechaPrimerArchivoCorrida, fechaPrimerArchivoCorrida, true, 4, 'd')
  ) === 1 ? 0.2 : 1;

  const backward = compararFechas(
    desplazarFecha(fechasMapas, fechaPrimerArchivoCorrida, false),
    fechaPrimerArchivoCorrida
  ) === -1 ? 0.2 : 1;

  setOpacityFechaForward(forward);
  setOpacityFechaBackward(backward);

  console.log('Valores recalculados:', forward, backward);
}, [fechaPrimerArchivoCorrida, fechasMapas]);
  const showGFSOficialMap=()=>{
    if(!isGFSState){
      const diferenciaH = diferenciaHoras(fechaPrimerArchivoCorrida, fechasMapas)
      const fin3h = Math.trunc(diferenciaH/3)*3
      if(diferenciaH<=72){
        let timestep = ''
        if(fin3h < 10){
          timestep=`00${fin3h}`
          console.log(`http://mag.ncep.noaa.gov/data/gfs-wave/06/gfs-wave_west-atl_${timestep}_sig_wv_ht.gif`,'jjjjj')

        }
        else timestep=`0${fin3h}`
        setImagePath(`http://mag.ncep.noaa.gov/data/gfs-wave/06/gfs-wave_west-atl_${timestep}_sig_wv_ht.gif`)
      }}
    else {
      setImagePath(`/Mapas/${cOrM[cubaOrMarady]}/${arrayDeZonasMapas[cubaOrMarady][mapasZonas]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechasMapas}.jpeg`)
    }
    setIsGFSState(!isGFSState)
    }

  usePreloadImages(true)
  return (
    <>
    
    <div
      className="
        bg-gray-900 bg-opacity-80 text-white
        px-6 py-3 rounded-lg shadow-lg
        flex items-center space-x-6
        backdrop-blur-sm
        transition-all duration-300
      "
    >
      {(!(([1,2,3].includes(selected) && currentZone == 0) || (selected==4 && [0,6,12].includes(currentZone))) && !isGFSState) && (
      <>
      <button className="p-2 rounded hover:bg-gray-700 transition" style={{opacity:opacityFechaBackward}} onClick={()=> pasoTemporal(false)} title="Corrida anterior">

        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="p-2 rounded hover:bg-gray-700 transition" style={{opacity:opacityFechaForward}}  onClick={()=> pasoTemporal(true)} title="Corrida siguiente">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      </>)}
        {(!(([1,2,3].includes(selected) && currentZone == 0) || (selected==4 && [0,6,12].includes(currentZone))) && !isGFSState) && (
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

        {showVariables  && (
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
      </div>)}
        {ampliar &&(
          <div className="flex items-center">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer h-full"
          title="Amplía el visualizador de mapas"
        >
          Ampliar
        </button></div>)}
        
     {/* Flechas temporales */}
     
      {(variables !=3 && !isGFSState) && (
     <div className="flex">
      <button className="p-2 rounded hover:bg-gray-700 transition" style={{opacity:opacityZoneBackward}} onClick={()=>cambioDeZona(false)} title="Zona anterior">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="p-2 rounded hover:bg-gray-700 transition" style={{opacity:opacityZoneForward}} onClick={()=>cambioDeZona(true)} title="Zona siguiente">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
          </div>)}
      {/* Botón Cuba/Mares */}
      {!(([1,2,3].includes(selected) && currentZone == 0) || (selected==4 && [0,6,12].includes(currentZone))) && (
        <>
      {variables !=3 && (
      <button className="px-3 py-2 bg-purple-600 rounded hover:bg-purple-700 transition cursor-pointer" onClick={()=> showGFSOficialMap()} title={isGFSState ? 'Mapa Oficial' : 'Mapa con los datos procesados'}>
        {isGFSState ? 'Oficial': 'Edit'}
      </button>)}</>)}  
    </div></>
  );
}
