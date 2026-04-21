import { useState, useRef, useEffect } from "react";
import FloatingBar from "./InfoBar";
import ControlBar from "./ButtonBar";
import { useForecast } from "../../context/ForecastContext";
import { arrayDeVariables, arrayDeZonasMapas, cOrM, objetoDeEscalas } from "../../data/mapaUtils";
export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [ampliar, setAmpliar] = useState(false)
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const {cubaOrMarady,
        setCubaOrMarady,
        mapasZonas,
        setMapasZonas,
        fechasMapas,
        setFechasMapas, variables, fechaPrimerArchivoCorrida, setFechaPrimerArchivoCorrida, imagePath, setImagePath} =useForecast()
  //const [imagePath, setImagePath] = useState(`/Mapas/${cOrM[cubaOrMarady]}/${arrayDeZonasMapas[cubaOrMarady][mapasZonas]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${fechasMapas}.jpeg`) 
  
  // Inicialización de dinamicFecha
  const dinamicFecha = fechaPrimerArchivoCorrida && (fechaPrimerArchivoCorrida.trim() !== "" && !fechaPrimerArchivoCorrida.includes('NaN')) ? fechaPrimerArchivoCorrida : ''
  const arrayParaMostrarNombresVariables = ['Altura significativa de la ola', 'Altura significativa de la ola + viento', 'Leva', 'Periodo de la ola']
  let valor=''
  useEffect(() => {
  valor = localStorage.getItem("dinamicFecha");
  // Convertir siempre a string seguro
  const fechaStr = (dinamicFecha || "").toString().replace(/\//g, ".").trim();
  // Expresión regular: dd.mm.yyyy.hhutc
  const regex = /^\d{2}\.\d{2}\.\d{4}\.\d{2}utc$/;

  if (fechaStr !== "" && !fechaStr.includes("NaN")) {
    if (regex.test(fechaStr)) {
      // Guardar si es válido
      localStorage.setItem("dinamicFecha", fechaStr);
      console.log("Valor válido:", fechaStr);
    } else {
      // Si no cumple el formato, eliminar
      localStorage.removeItem("dinamicFecha");
    }
  } else {
    console.log("No hay valor guardado o es vacío");
  }
}, [dinamicFecha]);

useEffect(() => {
  if (!fechasMapas && (dinamicFecha || valor)) {
    // Convertir y limpiar el formato
    const newfecha = ((dinamicFecha || valor) || "").toString().replace(/\//g, ".").trim();
    console.log(newfecha,'aaa')
    // Validar antes de usar
    const regex = /^\d{2}\.\d{2}\.\d{4}\.\d{2}utc$/;
    if (regex.test(newfecha)) {
      setFechasMapas(newfecha);
      setFechaPrimerArchivoCorrida(newfecha)
      setImagePath(
        `/Mapas/${cOrM[cubaOrMarady]}/${arrayDeZonasMapas[cubaOrMarady][mapasZonas]}/${arrayDeVariables[variables]}/${objetoDeEscalas[arrayDeVariables[variables]][0]}/${newfecha}.jpeg`
      );
    } else {
      console.log("Formato inválido en newfecha, no se actualiza rutas");
    }
  }
}, []);


  //Funcion que cambia el tipo de variable
  
  // Función para arrastrar
  const onMouseDownDrag = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...position };

    const onMouseMove = (e) => {
      setPosition({
        x: startPos.x + (e.clientX - startX),
        y: startPos.y + (e.clientY - startY),
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Función para redimensionar
  const onMouseDownResize = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startSize = { ...size };

    const onMouseMove = (e) => {
      setSize({
        width: Math.max(200, startSize.width + (e.clientX - startX)),
        height: Math.max(150, startSize.height + (e.clientY - startY)),
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="p-6 text-center text-gray-700">
      

      {/* Visualizador básico */}
      {!showModal && (
      <div className="mt-4 relative">
        <FloatingBar tipoDato={arrayParaMostrarNombresVariables[variables]} fechaHora={fechasMapas ? fechasMapas : dinamicFecha}></FloatingBar>
        <img
          src={imagePath}
          alt="Mapa"
          className="mx-auto rounded shadow-lg max-w-full h-auto"
        />
        <ControlBar showModal={showModal} setShowModal={setShowModal} imagePath={imagePath} setImagePath={setImagePath}></ControlBar>
      </div>)}
      {/* Modal flotante */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
            width: size.width,
            height: size.height,
            zIndex: 50,
          }}
          className="bg-white shadow-2xl border rounded overflow-hidden"
        >
          <div
            ref={dragRef}
            onMouseDown={onMouseDownDrag}
            className="cursor-move bg-gray-800 text-white p-2 flex justify-between"
          >
           <FloatingBar tipoDato={arrayParaMostrarNombresVariables[variables]} fechaHora={fechasMapas ? fechasMapas : dinamicFecha}></FloatingBar>
           <ControlBar showModal={showModal} setShowModal={setShowModal} imagePath={imagePath} setImagePath={setImagePath}></ControlBar>



            <button
              onClick={() => setShowModal(false)}
              className="float-right bg-red-600 rounded hover:bg-red-700 w-5 h-7" 
            >
              X
            </button>
          </div>
          <div className="w-full h-full flex items-center justify-center bg-white">
            <img
              src={imagePath}
              alt="Mapa ampliado"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {/* Resizer en esquina inferior derecha */}
          <div
            ref={resizeRef}
            onMouseDown={onMouseDownResize}
            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
          >
          </div>
        </div>
      )}
    </div>
  );
}
