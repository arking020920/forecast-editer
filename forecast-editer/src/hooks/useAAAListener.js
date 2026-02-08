import { TextRun } from "docx";
export const replaceFunction = (texto, fechaInicio, fechaFin)=>{
      const newTexto = texto.replace("{fechaInicio}", fechaInicio.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
      .replace("{fechaFin}", fechaFin.toLocaleDateString("es-ES",{ day: "numeric", month: "long", year: "numeric" }))
      .replace("{dayNumber}", `${fechaInicio.getDate()}`)
      .replace("{day0Number}", fechaInicio.getDate()<10 ? `0${fechaInicio.getDate()}` : `${fechaInicio.getDate()}`)
      .replace("{month0Number}", fechaInicio.getMonth() + 1 <10 ? `0${fechaInicio.getMonth()}` : `${fechaInicio.getMonth()}`)
      .replace("{monthNumber}", `${fechaInicio.getMonth() + 1}`)
      .replace("{yearNumber}", `${fechaInicio.getFullYear()}`);
      return newTexto
      }
export const separadorSaltoDeLinea =(encabezado, objectInfo,type, negrita=true)=>{
  const fuente = type + 'FontSize'
  let textValue = encabezado.split("\n").map((linea, i) =>
  new TextRun({
    text: linea.trim(),
    bold: negrita,
    font: "Arial",
    size: objectInfo[fuente] * 2,
    break: i > 0, // 👈 añade salto de línea a partir de la segunda línea
  })
)
  return textValue
}