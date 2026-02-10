import { AlignmentType, TextRun } from "docx";
export const replaceFunction = (texto, fechaInicio, fechaFin, fechaFin1, fechaFin2)=>{
      const newTexto = texto.replace("{fechaInicio}", fechaInicio.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
      .replace("{fechaInicioNoMonth}", fechaInicio.toLocaleDateString("es-ES",{ day: "numeric", month: "long",}))
      .replace("{fechaFin}", fechaFin.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
      .replace("{fechaFin1}", fechaFin1.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
      .replace("{fechaFin2}", fechaFin2.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
      .replace("{dayNumber}", `${fechaInicio.getDate()}`)
      .replace("{day0Number}", fechaInicio.getDate()<10 ? `0${fechaInicio.getDate()}` : `${fechaInicio.getDate()}`)
      .replace("{month0Number}", fechaInicio.getMonth() + 1 <10 ? `0${fechaInicio.getMonth() +1}` : `${fechaInicio.getMonth() + 1}`)
      .replace("{monthNumber}", `${fechaInicio.getMonth() + 1}`)
      .replace("{yearNumber}", `${fechaInicio.getFullYear()}`);
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