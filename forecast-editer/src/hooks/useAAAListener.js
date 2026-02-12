import { AlignmentType, TextRun } from "docx";
export const replaceFunction = (texto, fechaInicio, fechaFin, fechaFin1, fechaFin2,isDayAndNight=true, isDay = true, isMariel=false)=>{
  let newTexto = ''  
  const dayOrNight = isDay ? '12' : '00'
  const tardeOrMorning = isDay ? 'TARDE' : 'MAÑANA'
  const amOrPm = isDay ? 'pm' : 'am'
    function isNowBetweenMidnightAnd0730() {
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const start = 0;           // 00:00 en minutos
  const end = 7 * 60 + 30;   // 07:30 en minutos
  return minutesNow >= start && minutesNow <= end;}
    if(!isDayAndNight || isDay){
      newTexto = texto.replace("{fechaInicio}", fechaInicio.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
      .replace("{fechaInicioNoMonth}", !isMariel ? fechaInicio.toLocaleDateString("es-ES",{ day: "numeric", month: "long",}) : fechaInicio.toLocaleDateString("es-ES",{ day: "numeric", month: "long",}).toUpperCase())
      .replace("{fechaFin}",!isMariel ? fechaFin.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }) : fechaFin.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }).toUpperCase())
      .replace("{fechaFin1}", fechaFin1.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
      .replace("{fechaFin2}", fechaFin2.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
      .replace("{dayNumber}", `${fechaInicio.getDate()}`)
      .replace("{day0Number}", fechaInicio.getDate()<10 ? `0${fechaInicio.getDate()}` : `${fechaInicio.getDate()}`)
      .replace("{month0Number}", fechaInicio.getMonth() + 1 <10 ? `0${fechaInicio.getMonth() +1}` : `${fechaInicio.getMonth() + 1}`)
      .replace("{monthNumber}", `${fechaInicio.getMonth() + 1}`)
      .replace("{yearNumber}", `${fechaInicio.getFullYear()}`)
      .replace("{dayOrNight}", dayOrNight)
      .replace("{tardeOrMorning}", tardeOrMorning)
      .replace("{tardeOrMorning}", tardeOrMorning)
      .replace("{amOrPm}", amOrPm)}
      else {        
        const horario = isNowBetweenMidnightAnd0730()
        newTexto = texto.replace("{fechaFin}", !isMariel ? (horario 
        ? fechaInicio.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }) 
        : fechaFin.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
        : (horario ? fechaFin.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }).toUpperCase()
        : fechaFin1.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }).toUpperCase()))
      .replace("{dayNumber}", horario ? `${fechaInicio.getDate()}` : `${fechaFin.getDate()}`)
      .replace("{day0Number}",horario ? (fechaInicio.getDate()<10 ? `0${fechaInicio.getDate()}` : `${fechaInicio.getDate()}`) 
      : (fechaFin.getDate()<10 ? `0${fechaFin.getDate()}` : `${fechaFin.getDate()}`))
      .replace("{month0Number}", horario ? (fechaInicio.getMonth() + 1 <10 ? `0${fechaInicio.getMonth() +1}` : `${fechaInicio.getMonth() + 1}`)
    : (fechaFin.getMonth() + 1 <10 ? `0${fechaFin.getMonth() +1}` : `${fechaFin.getMonth() + 1}`))
      .replace("{monthNumber}", horario ? (`${fechaInicio.getMonth() + 1}`):
    (`${fechaFin.getMonth() + 1}`))
      .replace("{yearNumber}", horario ? (`${fechaInicio.getFullYear()}`)
    :(`${fechaFin.getFullYear()}`))
      .replace("{dayOrNight}", dayOrNight)
      .replace("{tardeOrMorning}", tardeOrMorning)
      .replace("{tardeOrMorning}", tardeOrMorning)
      .replace("{amOrPm}", amOrPm)
      .replace("{fechaInicioNoMonth}", !isMariel ? fechaInicio.toLocaleDateString("es-ES",{ day: "numeric", month: "long",}) 
    : (horario ? (fechaInicio.toLocaleDateString("es-ES",{ day: "numeric", month: "long",}).toUpperCase())
    :(fechaFin.toLocaleDateString("es-ES",{ day: "numeric", month: "long",}).toUpperCase())))
      }
      return newTexto
      }
export const separadorSaltoDeLinea =(encabezado, objectInfo,type, negrita=true, justified=false, alignmentText=AlignmentType.START, isMariel = false)=>{
  
  const fuente = type + 'FontSize'
  let textValue = encabezado.split("\n").map((linea, i) =>{
  if(!justified) return new TextRun({
    text:isMariel ? (linea + ':').trim() : linea.trim(),
    bold: negrita,
    font: "Arial",
    size: objectInfo[fuente] * 2,
    break: i > 0, // 👈 añade salto de línea a partir de la segunda línea
  })
  else {
    return new TextRun({
    alignment: alignmentText,
    text: linea.trim(),
    bold: negrita,
    font: "Arial",
    size: objectInfo[fuente] * 2,
    break: i > 0, 
  })
  }
}
)
  return textValue
}