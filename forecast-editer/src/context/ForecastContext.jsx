import { createContext, useContext, useState } from "react";

// Creamos el contexto
const ForecastContext = createContext();

// Hook para usar el contexto
export const useForecast = () => useContext(ForecastContext);

// Proveedor global
export const ForecastProvider = ({ children }) => {
  const [tipoDePronostico, setTipoDePronostico] = useState("PRONÓSTICO MARINO PARA LOS HOMBRES DEL MAR");
  const [fechaInicio, setFechaInicio] = useState(new Date()); // fecha de hoy
  const [fechaFin, setFechaFin] = useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)); // mañana
  const [zonas, setZonas] = useState(["Costa Norte", "Costa Sur"]); // se define según pronóstico
  const [username, setUsername] = useState("A. Quintana");
  const [contenido, setContenido] = useState({});
  const [currentZone, setCurrentZone] = useState(0);
  const [shortcuts, setShortcuts] = useState([]);
  
  

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
        setShortcuts
      }}
    >
      {children}
    </ForecastContext.Provider>
  );
};
