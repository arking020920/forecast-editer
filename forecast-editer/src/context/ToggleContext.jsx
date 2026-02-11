import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    // Define variables globales en body para que otros componentes puedan usarlas
    if (isDay) {
      document.body.classList.add("light");
      document.body.style.setProperty("--app-accent", "#D43370"); // color día
      document.body.style.setProperty("--bg-toggle", "#FFBF71"); // fondo día
    } else {
      document.body.classList.remove("light");
      document.body.style.setProperty("--app-accent", "#FFD1F7"); // color noche
      document.body.style.setProperty("--bg-toggle", "#423966"); // fondo noche
    }
  }, [isDay]);

  const toggleTheme = () => setIsDay(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDay, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
