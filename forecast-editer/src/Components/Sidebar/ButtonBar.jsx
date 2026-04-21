import { useState } from "react";
import { VariableButton } from "./VariableButton";
import { useForecast } from "../../context/ForecastContext";
import { arrayDeVariables, arrayDeZonasMapas, cOrM, objetoDeEscalas, } from "../../data/mapaUtils";

export default function ControlBar({setShowModal, ampliar=true, setImagePath}) {
  const [showVariables, setShowVariables] = useState(false);
  const {cubaOrMarady,
        mapasZonas,variables,
        fechasMapas, setCubaOrMarady, setMapasZonas, ultimaInfo, setUltimaInfo, fechaPrimerArchivoCorrida, setFechaPrimerArchivoCorrida, setFechasMapas, selected, currentZone
        } =useForecast()
  const opacityZoneForward = arrayDeZonasMapas[cubaOrMarady].length-1 == mapasZonas ? 0.2 : 1
  const opacityZoneBackward = 0 == mapasZonas ? 0.2 : 1
  const changeCubaOrMarady=()=>{
        const value =  cubaOrMarady ===0 ? 1 : 0
        console.log(ultimaInfo)
        if(mapasZonas>=5 && cubaOrMarady===1){
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
  function pasoTemporal(haciaAdelante) {
  // fechaStr ejemplo: "20.04.2026.03utc"
  console.log(fechasMapas,'aaas')
  const fechaStr = fechasMapas ? fechasMapas : fechaPrimerArchivoCorrida;
  const [dia, mes, anio, horaUtc] = fechaStr
    .replace(/\//g, ".")
    .replace("utc", "")
    .split(".");
  const diaNum = parseInt(dia, 10);
  const mesNum = parseInt(mes, 10) - 1; // JS usa meses 0-11
  const anioNum = parseInt(anio, 10);
  const horaNum = parseInt(horaUtc, 10);

  // 2. Crear objeto Date en UTC
  let fecha = new Date(Date.UTC(anioNum, mesNum, diaNum, horaNum));

  // Fecha base (inicio de la corrida)
  const [d0, m0, y0, h0] = fechaPrimerArchivoCorrida
    .replace(/\//g, ".")
    .replace("utc", "")
    .split(".");
  const fechaBase = new Date(Date.UTC(parseInt(y0), parseInt(m0) - 1, parseInt(d0), parseInt(h0)));

  // Diferencia en horas respecto a la base
  const diffHoras = (fecha.getTime() - fechaBase.getTime()) / (1000 * 60 * 60);

  // 3. Sumar o restar una hora con restricciones
  if (haciaAdelante) {
    if (diffHoras < 96) {
      fecha.setUTCHours(fecha.getUTCHours() + 1);
    } else {
      console.log("No se puede avanzar más de 97 horas desde la fecha base");
      return; // salir sin actualizar
    }
  } else {
    if (diffHoras > 0) {
      fecha.setUTCHours(fecha.getUTCHours() - 1);
    } else {
      console.log("No se puede retroceder antes de la fecha base");
      return; // salir sin actualizar
    }
  }

  // 4. Formatear de nuevo al estilo "dd.mm.yyyy.hhutc"
  const dd = String(fecha.getUTCDate()).padStart(2, "0");
  const mm = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = fecha.getUTCFullYear();
  const hh = String(fecha.getUTCHours()).padStart(2, "0");
  const newFecha = `${dd}.${mm}.${yyyy}.${hh}utc`;

  console.log(dd, mm, yyyy, hh, "asasas");
  setFechasMapas(newFecha);
  if(variables !=3){
  setImagePath(
    `/Mapas/${cOrM[cubaOrMarady]}/${arrayDeZonasMapas[cubaOrMarady][mapasZonas]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${newFecha}.jpeg`
  )}
  else{
    setImagePath(`/Mapas/${arrayDeVariables[3]}/${newFecha}.jpeg`)
  };
}

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
      {(currentZone != 0 && (!selected==3 || ![0,6,12].includes(currentZone))) && (
      <>
      <button className="p-2 rounded hover:bg-gray-700 transition" onClick={()=> pasoTemporal(false)} title="Corrida anterior">

        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="p-2 rounded hover:bg-gray-700 transition"  onClick={()=> pasoTemporal(true)} title="Corrida siguiente">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      </>)}

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
          <div className="flex items-center">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer h-full"
          title="Amplía el visualizador de mapas"
        >
          Ampliar
        </button></div>)}
     {/* Flechas temporales */}
      {variables !=3 && (
     <div className="flex">
      <button className="p-2 rounded hover:bg-gray-700 transition" style={{opacity:opacityZoneBackward}} onClick={()=> changeZone(false)} title="Zona anterior">

        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="p-2 rounded hover:bg-gray-700 transition" style={{opacity:opacityZoneForward}} onClick={()=> changeZone(true)} title="Zona siguiente">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
          </div>)}
      {/* Botón Cuba/Mares */}
      {variables !=3 && (
      <button className="px-3 py-2 bg-purple-600 rounded hover:bg-purple-700 transition cursor-pointer" onClick={()=> changeCubaOrMarady()} title="Intercambia entre los mapas de Cuba y los de Mares Adyacentes">
        {cubaOrMarady === 0 ? 'Cuba' : 'Marady'}
      </button>)}
    </div></>
  );
}
