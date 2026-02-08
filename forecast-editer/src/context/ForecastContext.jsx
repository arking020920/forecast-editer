import { createContext, useContext, useEffect, useState } from "react";
import { pronosticos } from "../data/pronosticos";

// Creamos el contexto
const ForecastContext = createContext();

// Hook para usar el contexto
export const useForecast = () => useContext(ForecastContext);

// Proveedor global
export const ForecastProvider = ({ children }) => {
  const [tipoDePronostico, setTipoDePronostico] = useState('marino');
  const [fechaInicio, setFechaInicio] = useState(new Date()); // fecha de hoy
  const [fechaFin, setFechaFin] = useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)); // mañana
  const [fechaFin2, setFechaFin2] = useState(new Date(new Date().getTime() + 48 * 60 * 60 * 1000)); // mañana
  const [fechaFin3, setFechaFin3] = useState(new Date(new Date().getTime() + 72 * 60 * 60 * 1000)); // mañana
  const [zonas, setZonas] = useState(["Costa Norte", "Costa Sur"]); // se define según pronóstico
  const [username, setUsername] = useState("A. Quintana");
  const [contenido, setContenido] = useState({});
  const [currentZone, setCurrentZone] = useState(0);
  const [shortcuts, setShortcuts] = useState([]);
  const [selected, setSelected] = useState(0);
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
  const guardarPronostico = () =>{
    const newPronosticoDatabase = structuredClone(pronosticoDatabase)
    Object.keys(contenido).map((value)=>{
    newPronosticoDatabase[selected][value] = contenido[value]
    })
    console.log('el new',newPronosticoDatabase)
    setPronosticoDatabase(newPronosticoDatabase)
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
        guardarPronostico
      }}
    >
      {children}
    </ForecastContext.Provider>
  );
};
