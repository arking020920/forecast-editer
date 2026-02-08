import { useState, useRef } from "react";
import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";
import GuardarPronosticoButton from "./GuardarPronosticoButton";
import ShortcutModal from "./ShortCutModal";

export default function Writer() {
  const {
    fechaInicio,
    fechaFin,
    username,
    contenido,
    setContenido,
    currentZone, 
    setCurrentZone,
    shortcuts,
    tipoDePronostico,
    selected
  } = useForecast();
  const [openShortcut, setOpenShortcut] = useState(false);
  const pronosticoActual = pronosticos[tipoDePronostico][selected]; 
  const zonas = pronosticoActual.zonas;
  const vCosta = [0, 7, 10, 19, 28, 37, 46, 57]
  const oCosta = [{},{nombre:'Mar tranquila', valor:'inferiores a 0.5 metros (fzas 1 y 2)'},
    {nombre:'Mar tranquila', valor:'inferiores a 0.5 metros (fzas 1 y 2)'},
  {nombre:'Poco oleaje', valor:'entre 0.5 - 1.0 metro (fza 3)'}, {nombre:'Oleaje', valor:'entre 1.0 - 1.5 metros (fza 4)'},
  {nombre:'Marejadas', valor:'entre 1.5 - 2.5 metros (fza 5)'}, {nombre:'Fuertes Marejadas', valor:'entre 2.5 - 4.0 metros (fza 6)'}      
  ]
  const vMarady = [[],[0,3], [4,6], [7,10], [11,16], [17,21], [22, 26], [27,31], [32, 37]]
  const oMarady = [[], [0,0.2], [0.2,0.5], [0.5, 1.25], [1.25, 2.5], [2.5, 4.0], [4.0,6.0]]
  const vMariel = [[],[0,5],[6,11],[12,19],[19,28],[28,37],[37,46], [46, 57], [57, 80]]

  // buffer local para detectar "aaa"
  const bufferRef = useRef("");

  const handleKeyDown = (e) => {
    let texto = ''
    let nuevo = ''
    let check = false
    const key = zonas[currentZone].contenidoKey;
    const actual = contenido[key] || "";

    bufferRef.current += e.key;
    if (bufferRef.current.length > 3) {
      bufferRef.current = bufferRef.current.slice(-3);
    }

    if (bufferRef.current === "aaa") {

      // borrar las tres letras "aaa"
      const nuevo = actual.endsWith("aaa") ? actual.slice(0, -3) : actual;
      setContenido({ ...contenido, [key]: nuevo });

      setOpenShortcut(true);
      bufferRef.current = "";
    }
    
    else if(bufferRef.current.slice(1,2) === 'v' && [0,2,3,4].includes(pronosticos[tipoDePronostico][selected].id)){
 
      vCosta.map((value, index) => {
        if (bufferRef.current.slice(1) === `v${index}` && 
          index != 0 ) {
          texto = `${vCosta[index-1]} - ${vCosta[index]} km/h (fza ${index})`
          nuevo = actual.slice(0, -1) + texto 
          check = true
           
        }
        })
    }
    else if(bufferRef.current.slice(1,2) === 'o' && [0,2,3,4].includes(pronosticos[tipoDePronostico][selected].id)){
        oCosta.map((value, index) => {
        if (bufferRef.current.slice(1) === `o${index}` && 
          index != 0) {
          texto = `${value.nombre} con olas ${value.valor}`
          nuevo = actual.slice(0, -1) + texto 
          check = true
           
        }
        })
    }
    else if(bufferRef.current.slice(1,2) === 'v' && pronosticos[tipoDePronostico][selected].id == 1){
      vMarady.map((value, index) => {
        if (bufferRef.current.slice(1) === `v${index}` && 
          index != 0) {
          texto = `${value[0]} - ${value[1]} kts (fza ${index})`
          nuevo = actual.slice(0, -1) + texto 
          check = true
           
        }
        })
    }
    else if(bufferRef.current.slice(1,2) === 'o' && [1,5].includes(pronosticos[tipoDePronostico][selected].id)){
      oMarady.map((value, index) => {
        if (bufferRef.current.slice(1) === `o${index}` && 
          index != 0) {
          texto = `olas entre ${value[0]} - ${value[1]} metros (fza ${index})`
          nuevo = actual.slice(0, -1) + texto 
          check = true
           
        }
        })
    }
    else if(bufferRef.current.slice(1,2) === 'v' && pronosticos[tipoDePronostico][selected].id == 5){
      vMarady.map((value, index) => {
        if (bufferRef.current.slice(1) === `v${index}` && 
          index != 0) {
          texto = `${value[0]} - ${value[1]} kts (${vMariel[index][0]} - ${vMariel[index][1]} km/h fza ${index})`
          nuevo = actual.slice(0, -1) + texto 
          check = true
           
        }
        })
    }
  if (check) {
    const newContenido =structuredClone(contenido)
    newContenido[key] = nuevo
    setContenido(newContenido)
    setTimeout(()=>{
        newContenido[key] = newContenido[key].slice(0)
        setContenido(newContenido)
      },10)
    }
       
  };

  return (
    <div className="flex flex-col flex-grow p-6">
      {/* Encabezado */}
      <h1 className="text-2xl font-bold mb-2">{pronosticoActual.titulo}</h1>
      <p className="text-sm-3 mb-4 font-bold whitespace-pre-wrap leading-none">
        {pronosticoActual.info
          .replace("{fechaInicio}", fechaInicio.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }))
          .replace("{fechaFin}", fechaFin.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }))
          .replace("{dayNumber}", String(fechaInicio.getDate()))
          .replace("{monthNumber}", String(fechaInicio.getMonth()))
          .replace("{yearNumber}", String(fechaInicio.getFullYear()))
          .toLocaleUpperCase()}
      </p>

      {/* Barra de navegación de zonas */}
      <div className="flex items-center justify-center bg-white/40 backdrop-blur-md rounded-md p-2 mb-4">
        {currentZone > 0 && (
          <button onClick={() => setCurrentZone(currentZone - 1)} className="px-2 text-lg">◀</button>
        )}
        <span className="mx-4 font-semibold">{zonas[currentZone].nombre}</span>
        {currentZone < zonas.length - 1 && (
          <button onClick={() => setCurrentZone(currentZone + 1)} className="px-2 text-lg">▶</button>
        )}
      </div>

      {/* Bloque */}
      {zonas[currentZone].nameBloqueInclude && (
        <h2 className="text-lg font-bold uppercase mb-2">{zonas[currentZone].bloque}</h2>
      )}

      {/* Área de escritura */}
      <textarea
        className="flex-grow rounded-lg shadow-inner p-4 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-justify"
        placeholder={`Escribe el pronóstico para ${zonas[currentZone].nombre}...`}
        value={contenido[zonas[currentZone].contenidoKey] || ""}
        onChange={(e) =>
          setContenido({
            ...contenido,
            [zonas[currentZone].contenidoKey]: e.target.value,
          })
        }
        onKeyDown={handleKeyDown} // 👈 aquí escuchamos las teclas
      />

      {/* Botón guardar */}
      <div className="mt-4 flex justify-end">
        <div className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
          <GuardarPronosticoButton />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-gray-600 italic">
        {pronosticoActual.cierre.replace("{username}", username)}
      </p>

      {/* Modal de atajos */}
   {openShortcut && (
  <ShortcutModal
    shortcuts={shortcuts} // 👈 aquí pasas los atajos reales
    currentZone={currentZone}
    zonas={zonas}
    onClose={() => setOpenShortcut(false)}
  />
)}

    </div>
  );
}

