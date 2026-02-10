import { useEffect } from "react";
import { useForecast } from "../context/ForecastContext";

export default function SaveToLocalStorage() {
  const {
    pronosticoDatabase,
    setPronosticoDatabase,
    selected,
    contenido,
  } = useForecast();

  // Solo para debug: mostrar cambios en consola
  useEffect(() => {
    console.log("Contenido cambió:", contenido);
    console.log("Pronóstico actual:", pronosticoDatabase);
  }, [selected, contenido, pronosticoDatabase]);

  // Guardar manualmente en localStorage
  const handleSave = () => {
    const almacen = JSON.parse(localStorage.getItem("pronosticos")) || {};
    almacen.admin = pronosticoDatabase;
    localStorage.setItem("pronosticos", JSON.stringify(almacen));
    console.log("Guardado en localStorage:", almacen);
  };

  // Cargar manualmente desde localStorage
  const handleLoad = () => {
    const almacen = JSON.parse(localStorage.getItem("pronosticos")) || {};
    if (almacen.admin) {
      setPronosticoDatabase(almacen.admin);
      console.log("Cargado desde localStorage:", almacen.admin);
    } else {
      console.log("No hay datos guardados para admin");
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleSave}
        className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
      >
        Guardar Datos
      </button>
      <button
        onClick={handleLoad}
        className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        Cargar Datos Guardados
      </button>
    </div>
  );
}
