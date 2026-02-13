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
        setElaboratedBy
      }}
    >
      {children}
    </ForecastContext.Provider>
  );
};
