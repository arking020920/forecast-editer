import { useState, useRef } from "react";
import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";
import GuardarPronosticoButton from "./GuardarPronosticoButton";
import ShortcutModal from "./ShortCutModal";
import { replaceFunction } from "../hooks/useAAAListener";
import { useTheme } from "../context/ToggleContext";
import PronosticadorSelector from "./PronosticadorSelector";

export default function Writer() {
  const {
    fechaInicio,
    fechaFin,
    fechaFin1,
    fechaFin2,
    userFirma,
    contenido,
    setContenido,
    currentZone, 
    setCurrentZone,
    shortcuts,
    tipoDePronostico,
    selected
  } = useForecast();
  const {isDay} = useTheme()
  const [openShortcut, setOpenShortcut] = useState(false);
  const pronosticoActual = pronosticos[tipoDePronostico][selected]; 
  const isMariel = pronosticoActual.id ==5 ? true : false
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

  // posición del cursor (caret) en el input/textarea
  const cursorPos = (e.target && typeof e.target.selectionStart === "number") ? e.target.selectionStart : actual.length;

  bufferRef.current += e.key;
  if (bufferRef.current.length > 3) {
    bufferRef.current = bufferRef.current.slice(-3);
  }

  if (bufferRef.current === "aaa") {

    // borrar las tres letras "aaa" justo antes del cursor
    const triggerLen = 3;
    const before = actual.slice(0, Math.max(0, cursorPos - triggerLen));
    const after = actual.slice(cursorPos);
    nuevo = before + after;

   
  try {
    const payload = {
      zoneKey: key, // e.g. "zona1"
      cursorPos: Math.max(0, cursorPos - triggerLen),
      selectionEnd: Math.max(0, cursorPos - triggerLen) // opcional si quieres rango
    };
    sessionStorage.setItem('lastShortcutState', JSON.stringify(payload));
  } catch (err) {
    console.warn('No se pudo guardar la posición del cursor para el atajo', err);
  }

    setContenido({ ...contenido, [key]: nuevo });

    setOpenShortcut(true);
    bufferRef.current = "";
  }

  else if (bufferRef.current.slice(1,2) === 'v' && [0,2,3,4].includes(pronosticos[tipoDePronostico][selected].id)){

    vCosta.map((value, index) => {
      if (bufferRef.current.slice(1) === `v${index}` &&
        index != 0 ) {
        texto = ' ' + `${vCosta[index-1]} - ${vCosta[index]} km/h (fza ${index})`
        // eliminar el trigger (ej. "v4") justo antes del cursor e insertar texto en la posición del cursor
        const trigger = bufferRef.current.slice(1); // "vX"
        const triggerLen = trigger.length;
        const before = actual.slice(0, Math.max(0, cursorPos - triggerLen) + 1);
        const after = actual.slice(cursorPos);
        nuevo = before.slice(-1) !== '\n' ? before + texto + after : before + texto.slice(1) + after;
      
        check = true

      }
    })
  }
  else if (bufferRef.current.slice(1,2) === 'o' && [0,2,3,4].includes(pronosticos[tipoDePronostico][selected].id)){
    oCosta.map((value, index) => {
      if (bufferRef.current.slice(1) === `o${index}` &&
        index != 0) {
        texto =' ' +  `${value.nombre} con olas ${value.valor}`
        const trigger = bufferRef.current.slice(1);
        const triggerLen = trigger.length;
        const before = actual.slice(0, Math.max(0, cursorPos - triggerLen) + 1);
        const after = actual.slice(cursorPos);
        nuevo = before.slice(-1) !== '\n' ? before + texto + after : before + texto.slice(1) + after;
        check = true

      }
    })
  }
  else if (bufferRef.current.slice(1,2) === 'v' && pronosticos[tipoDePronostico][selected].id == 1){
    vMarady.map((value, index) => {
      if (bufferRef.current.slice(1) === `v${index}` &&
        index != 0) {
        texto =' ' +  `${value[0]} - ${value[1]} kts (fza ${index})`
        const trigger = bufferRef.current.slice(1);
        const triggerLen = trigger.length;
        const before = actual.slice(0, Math.max(0, cursorPos - triggerLen) + 1);
        const after = actual.slice(cursorPos);
        nuevo = before.slice(-1) !== '\n' ? before.slice + texto + after : before + texto.slice(1) + after;;
        check = true

      }
    })
  }
  else if (bufferRef.current.slice(1,2) === 'o' && [1,5].includes(pronosticos[tipoDePronostico][selected].id)){
    oMarady.map((value, index) => {
      if (bufferRef.current.slice(1) === `o${index}` &&
        index != 0) {
        texto =' ' +  `olas entre ${value[0]} - ${value[1]} metros (fza ${index})`
        const trigger = bufferRef.current.slice(1);
        const triggerLen = trigger.length;
        const before = actual.slice(0, Math.max(0, cursorPos - triggerLen) + 1);
        const after = actual.slice(cursorPos);
        nuevo = before.slice(-1) !== '\n' ? before + texto + after : before + texto.slice(1) + after;
        check = true

      }
    })
  }
  else if (bufferRef.current.slice(1,2) === 'v' && pronosticos[tipoDePronostico][selected].id == 5){
    vMarady.map((value, index) => {
      if (bufferRef.current.slice(1) === `v${index}` &&
        index != 0) {
        texto =' ' +  `${value[0]} - ${value[1]} kts (${vMariel[index][0]} - ${vMariel[index][1]} km/h fza ${index})`
        const trigger = bufferRef.current.slice(1);
        const triggerLen = trigger.length;
        const before = actual.slice(0, Math.max(0, cursorPos - triggerLen) + 1);
        const after = actual.slice(cursorPos);
        nuevo = before.slice(-1) !== '\n' ? before + texto + after : before + texto.slice(1) + after;
        check = true

      }
    })
  }
  if (check) {
    const newContenido = structuredClone(contenido)
    newContenido[key] = nuevo
    setContenido(newContenido)
    setTimeout(()=>{
        // comportamiento original: remover posible carácter sobrante al final (evita el "4" extra)
        newContenido[key] = newContenido[key].slice(0)
        setContenido(newContenido)

        // mantener caret justo después del texto insertado si el elemento está disponible
        const el = document.activeElement;
        if (el && typeof el.selectionStart === "number") {
          const newCursorPos = (cursorPos - (bufferRef.current ? bufferRef.current.slice(1).length : 0)) + texto.length;
          el.selectionStart = newCursorPos;
          el.selectionEnd = newCursorPos;
        }
      },10)
    }
       
};

  const info = replaceFunction (pronosticoActual.info, fechaInicio, fechaFin, fechaFin1, fechaFin2, pronosticoActual.isDayAndNight, isDay, isMariel)
  return (
    <div className="flex flex-col flex-grow p-6">
      {/* Encabezado */}
      <h1 className="text-2xl font-bold mb-2">{pronosticoActual.titulo}</h1>
      <p className="text-sm-3 mb-4 font-bold whitespace-pre-wrap leading-none">
        {info.toLocaleUpperCase()}
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
      <PronosticadorSelector 
      pronosticoActual={pronosticoActual}
      ></PronosticadorSelector>

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

