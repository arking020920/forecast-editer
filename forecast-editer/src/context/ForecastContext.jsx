import { createContext, useContext, useEffect, useState } from "react";
import { pronosticos } from "../data/pronosticos";
import {arrayDeVariables, arrayDeZonasMapas, cOrM, objetoDeEscalas} from '../data/mapaUtils'
// Creamos el contexto
const ForecastContext = createContext();

// Hook para usar el contexto

export const useForecast = () => useContext(ForecastContext);

// Proveedor global
export const ForecastProvider = ({ children }) => {
  const [tipoDePronostico, setTipoDePronostico] = useState('marino');
  const [fechaInicio, setFechaInicio] = useState(new Date()); // fecha de hoy
  const [fechaFin, setFechaFin] = useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)); // mañana
  const [fechaFin1, setFechaFin1] = useState(new Date(new Date().getTime() + 48 * 60 * 60 * 1000)); // pasado mañana
  const [fechaFin2, setFechaFin2] = useState(new Date(new Date().getTime() + 72 * 60 * 60 * 1000)); // traspasado mañana
  const [zonas, setZonas] = useState(["Costa Norte", "Costa Sur"]); // se define según pronóstico
  const [username, setUsername] = useState("");
  const [contenido, setContenido] = useState({zona1:'',zona2:'', zona3:'', zona4:'', zona5:''});
  const [currentZone, setCurrentZone] = useState(0);
  const [shortcuts, setShortcuts] = useState([]);
  const [selected, setSelected] = useState(0);
  const [isLogin, setIsLogin] =  useState(false)
  const [userWelcomeName, setUserWelcomeName] = useState('')
  const [userFirma, setUserFirma] = useState("")
  const [userOriginalFirma, setUserOriginalFirma] = useState("")
  const [tempSeleccion, setTempSeleccion] = useState([userFirma]);
  const [elaboratedBy, setElaboratedBy] = useState(userFirma);
  const [cubaOrMarady, setCubaOrMarady] = useState(0)
  const [mapasZonas, setMapasZonas]=useState(0)
  const [variables, setVariables]=useState(0)
  const [fechaPrimerArchivoCorrida, setFechaPrimerArchivoCorrida] = useState('')
  const [fechasMapas, setFechasMapas] =useState('')
  const [imagePath, setImagePath] = useState(`/Mapas/${cOrM[cubaOrMarady]}/${arrayDeZonasMapas[cubaOrMarady][mapasZonas]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechasMapas}.jpeg`) 
  const [isGFSState, setIsGFSState] = useState(false)
  
  //const [pronosticoDatabase, setPronosticoDatabase] = useState({})
  const structure = []
  useEffect(()=>{
    pronosticos[tipoDePronostico].map((value)=>{
    const objectZone = {}
    value.zonas.map((v)=>{
      
      objectZone[v.contenidoKey] = ''
    })
    if(structure.length<pronosticos[tipoDePronostico].length) structure.push(objectZone)
  })
  },[])
  
  const [pronosticoDatabase, setPronosticoDatabase] = useState(structure)
    const newPronosticoDatabase = structuredClone(pronosticoDatabase)

    // Guardar pronóstico
const guardarPronostico = async () => {
  Object.keys(contenido).map((value) => {
    newPronosticoDatabase[selected][value] = contenido[value];
  });

  console.log("el new", newPronosticoDatabase);
  setPronosticoDatabase(newPronosticoDatabase);

  // Guardar en localStorage
  const almacen = JSON.parse(localStorage.getItem("pronosticos")) || {};
  almacen[username] = newPronosticoDatabase;
  localStorage.setItem("pronosticos", JSON.stringify(almacen));
  console.log("Guardado en localStorage:", almacen);

  // Guardar en archivo JSON en el servidor Flask
  try {
    await fetch("http://localhost:5000/pronosticos/guardar", {   // <-- nueva ruta
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, data: newPronosticoDatabase }),
    });
    console.log("Guardado en archivo JSON en servidor");
  } catch (error) {
    console.error("Error guardando en servidor:", error);
  }
};

// Cargar pronóstico
const handleLoad = async () => {
  try {
    const response = await fetch(`http://localhost:5000/pronosticos/cargar/${username}`); // <-- nueva ruta
    if (response.ok) {
      const data = await response.json();
      setPronosticoDatabase(data);
      setContenido(data[selected]);
      console.log("Cargado desde archivo JSON:", data);
      return;
    }
  } catch (error) {
    console.error("Error cargando desde archivo JSON:", error);
  }

  // Si falla, cargar desde localStorage
  const almacen = JSON.parse(localStorage.getItem("pronosticos")) || {};
  if (almacen[username]) {
    setPronosticoDatabase(almacen[username]);
    setContenido(almacen[username][selected]);
    console.log("Cargado desde localStorage:", almacen[username]);
  } else {
    console.log("No hay datos guardados para", username);
  }
};

const cambioDeZona = (toForward) =>{
      const pronosticoActual = pronosticos[tipoDePronostico][selected]; 
      const zonas = pronosticoActual.zonas
      if(toForward){
        if (currentZone < zonas.length - 1) {
        setCurrentZone(currentZone + 1);}
        else return
      }
      else{
        if (currentZone > 0) {
        setCurrentZone(currentZone-1)
        }
        else return
      }

      const signo = toForward ? 1 : -1
      const alternativeCorM = selected != 1 ? 0 : 1  
      let newFecha = ''
      if(variables !=3){
      const cZone=currentZone-1
      if([1,2,3].includes(selected) && currentZone+1*signo != 0 ){
        setImagePath(`/Mapas/${cOrM[alternativeCorM]}/${arrayDeZonasMapas[alternativeCorM][cZone+1*signo]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechasMapas}.jpeg`)
      setMapasZonas(cZone+1*signo)
      } 
      else if([1,2,3].includes(selected) && currentZone+1*signo == 0){
        setImagePath('https://www.nhc.noaa.gov/tafb_latest/atlsfc48_latestBW.gif')
        setMapasZonas(0)
      }
      else if(selected ==0){
        setImagePath(`/Mapas/${cOrM[alternativeCorM]}/${arrayDeZonasMapas[alternativeCorM][currentZone+1*signo]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechasMapas}.jpeg`)
        setMapasZonas(currentZone+1*signo)

      }
      else if(selected==4 && [0,6,12].includes(currentZone+1*signo)){
        const hour = 24 + (Math.floor((currentZone+1*signo)/6))*24
        setImagePath(`https://www.nhc.noaa.gov/tafb_latest/atlsfc${hour}_latestBW.gif`)
        setMapasZonas(0)
        console.log(currentZone+1*signo)
      }
      else if(selected==4){
        const TgfZone = (currentZone+1*signo)<6 ? currentZone+1*signo : (currentZone+1*signo) % 6
        console.log(TgfZone,'tgf')
        setMapasZonas(TgfZone-1)
        if(currentZone==6){
          newFecha = adelantarMes(fechaPrimerArchivoCorrida,1)
          setFechasMapas(newFecha)
          setImagePath(`/Mapas/${cOrM[alternativeCorM]}/${arrayDeZonasMapas[alternativeCorM][TgfZone-1]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${newFecha}.jpeg`)

        }
        else if (currentZone==12){
          newFecha = adelantarMes(fechaPrimerArchivoCorrida,2)
          setFechasMapas(newFecha)
          setImagePath(`/Mapas/${cOrM[alternativeCorM]}/${arrayDeZonasMapas[alternativeCorM][TgfZone-1]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${newFecha}.jpeg`)
        }
        else if(currentZone+1*signo==5){
          setImagePath(`/Mapas/${cOrM[alternativeCorM]}/${arrayDeZonasMapas[alternativeCorM][TgfZone-1]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechaPrimerArchivoCorrida}.jpeg`)
        }
        else{
        
        setImagePath(`/Mapas/${cOrM[alternativeCorM]}/${arrayDeZonasMapas[alternativeCorM][TgfZone-1]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechasMapas}.jpeg`)
        }
      }
      }
      setCubaOrMarady(alternativeCorM)
   } 

   function pasoTemporal(haciaAdelante) {
     // fechaStr ejemplo: "20.04.2026.03utc"
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
    <ForecastContext.Provider
      value={{
        tipoDePronostico,
        setTipoDePronostico,
        fechaInicio,
        setFechaInicio,
        fechaFin,
        setFechaFin,
        fechaFin1,
        setFechaFin1,
        fechaFin2,
        setFechaFin2,
        zonas,
        setZonas,
        username,
        setUsername,
        contenido,
        setContenido, 
        currentZone,
        setCurrentZone,
        shortcuts,
        setShortcuts,
        selected,
        setSelected,
        pronosticoDatabase,
        setPronosticoDatabase,
        guardarPronostico,
        handleLoad,
        isLogin,
        setIsLogin,
        userWelcomeName,
        setUserWelcomeName,
        userFirma,
        setUserFirma,
        userOriginalFirma,
        setUserOriginalFirma,
        tempSeleccion,
        setTempSeleccion,
        elaboratedBy,
        setElaboratedBy,
        cubaOrMarady,
        setCubaOrMarady,
        mapasZonas,
        setMapasZonas,
        variables,
        setVariables,
        fechasMapas,
        setFechasMapas,
        fechaPrimerArchivoCorrida,
        setFechaPrimerArchivoCorrida,
        imagePath,
        setImagePath, cambioDeZona, pasoTemporal, isGFSState, setIsGFSState
      }}
    >
      {children}
    </ForecastContext.Provider>
  );
};
