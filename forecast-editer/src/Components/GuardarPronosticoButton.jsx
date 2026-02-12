import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun, VerticalAlignSection } from "docx";
import { saveAs } from "file-saver";
import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";
import { replaceFunction, separadorSaltoDeLinea } from "../hooks/useAAAListener";
import { useTheme } from "../context/ToggleContext";
export default function GuardarPronosticoButton() {
  const { tipoDePronostico, fechaInicio, fechaFin,fechaFin1, fechaFin2, username, contenido, selected, guardarPronostico } = useForecast();
  const {isDay} = useTheme()
  const pronosticoActual = pronosticos[tipoDePronostico][selected] || pronosticos.marino[selected];
  const isMariel = pronosticoActual.id ==5 ? true : false
  

  const handleGuardar = async () => {
    // Cargar imagen desde public
    guardarPronostico()
    const response = await fetch("/maritimaLogo.png");
    const logoBuffer = await response.arrayBuffer();
    const objectInfo = pronosticoActual.objectInfo

    function normalizarGuiones(texto, longitud = 112) {
  // Expresión regular: busca secuencias de 3 o más guiones seguidos
  return texto.replace(/-{3,}/g, "-".repeat(longitud));
}

    // Encabezado
    let encabezado = pronosticoActual.encabezado  
    encabezado = !(pronosticoActual.id ==5) ? replaceFunction(encabezado, fechaInicio, fechaFin, fechaFin1, fechaFin2, pronosticoActual.isDayAndNight, isDay, isMariel) :  replaceFunction(encabezado, fechaInicio, fechaFin, fechaFin1, fechaFin2,pronosticoActual.isDayAndNight, isDay, true)
      const notisHombresDelMar = pronosticoActual.id != 0
      encabezado = notisHombresDelMar ? encabezado : encabezado.slice(0,-105).toUpperCase()
      encabezado = normalizarGuiones(encabezado)
      const encabezadoRuns = separadorSaltoDeLinea(encabezado, objectInfo, 'encabezado')
  
    // Zonas
    const zonas = pronosticoActual.zonas.map((z, index) => {
      let textOfTropa = '' 
      if(pronosticoActual.id != 5){
      textOfTropa = pronosticoActual.id ==4 && [6,12].includes(index) ? 
      separadorSaltoDeLinea(replaceFunction(z.bloque, fechaInicio, fechaFin, fechaFin1, fechaFin2, pronosticoActual.isDayAndNight, isDay, isMariel),objectInfo,'zonas') 
      : separadorSaltoDeLinea(z.bloque, objectInfo, 'zonas')}
      else{
        textOfTropa=separadorSaltoDeLinea(replaceFunction(z.bloque, fechaInicio, fechaFin, fechaFin1, fechaFin2, pronosticoActual.isDayAndNight, isDay, isMariel), objectInfo,'zonas',true, false, AlignmentType.START,true)
      }

      const typeOfJustificacion = [pronosticoActual.id ==4 && [6, 12].includes(index)] ? 'START' : 'JUSTIFIED'
      const bloque = z.nameBloqueInclude
        ? new Paragraph({
            alignment: AlignmentType[typeOfJustificacion],
            indent: { left: 0 }, // 👈 sin sangría
            children: textOfTropa,
            spacing: { before: 0, after: 0 },
          })
        : null;
      const nombreSeparado = separadorSaltoDeLinea(z.nombre, objectInfo, 'zonas')
      const nombre = new Paragraph({
        alignment: AlignmentType.START,
        indent: { left: 0 }, // 👈 sin sangría
        children: nombreSeparado,
        spacing: { before: 0, after: 0 },
      });
      const alignmentText = contenido[z.contenidoKey].length > 55 ? AlignmentType.JUSTIFIED : AlignmentType.LEFT;      
      const textZona = separadorSaltoDeLinea(contenido[z.contenidoKey], objectInfo, 'zonas', false, true, alignmentText)
      const texto = new Paragraph({
        indent: { left: 0 }, // 👈 sin sangría
        children: textZona,
        spacing: { before: 0, after: 0 },
      });

      // 👇 añadimos salto de línea después de cada zona
      const salto = new Paragraph({
        children: [],
        spacing: { before: 0, after: 0 },
      });
      if(z.nombre !== ''){
      return [bloque, nombre, texto, salto].filter(Boolean)}
      else{
        return [bloque, texto, salto].filter(Boolean)}
    });

    // Firma
    const cierre = new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 0 }, // 👈 sin sangría
      children: [new TextRun({ text: pronosticoActual.cierre.replace("{username}", username ), bold: true, font: "Arial", size: 24 })],
      spacing: { before: 0, after: 0 },
    });
    const nnnnMarady = new Paragraph({
      alignment: AlignmentType.START,
      indent : {left: 0},
      children: [new TextRun({text: pronosticoActual.id==1 ? 'nnnn' : ''})]
    })
    let advertenciaText = pronosticoActual.oleajeAdvertencia ? separadorSaltoDeLinea('--------------------------------------------------------------------------------------------------------------'+
'En áreas de oleaje y marejadas hasta 2.5 metros la navegación será peligrosa para las embarcaciones pequeñas.\n'+
'Embarcaciones pequeñas: eslora máxima de 10 metros.\n'+
'Embarcaciones menores:   eslora máxima de 25 metros.\n'+
'\n'+
'En áreas de chubascos y tormentas eléctricas tanto la altura de la ola como la fuerza del viento podrán ser superiores.\n'+'\n', objectInfo, 'zonas', false ) : separadorSaltoDeLinea('', objectInfo, 'zonas', false)
if(pronosticoActual.id == 5){advertenciaText=separadorSaltoDeLinea('En áreas de chubascos y tormentas eléctricas tanto la altura de la ola como la fuerza del viento podrán ser superiores.\n'+'\n', objectInfo, 'zonas', false )}
    const oleajeAdvertencia = new Paragraph({
      alignment: AlignmentType.START,
      indent : {left: 0},
      children: advertenciaText,
    })

    // Documento
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Logo centrado con dimensiones exactas
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                ...(objectInfo.isPhoto ? [new ImageRun({
                  data: logoBuffer,
                  transformation: {
                    width: Math.round(2.62 * 96), // 2.62'' → px (aprox 252px)
                    height: Math.round(0.8 * 96),  // 0.8'' → px (aprox 77px)
                  },
                }),] : [])
              ],
              spacing: { before: 0, after: 0 },
            }),

            // Encabezado
            new Paragraph({
              alignment: !notisHombresDelMar ? AlignmentType.JUSTIFIED : AlignmentType.START,
              indent: { left: 0 }, // 👈 sin sangría
              children: encabezadoRuns,
              spacing: { before: 0, after: 0 },
            }),

            // Guiones
            ...(!notisHombresDelMar ? [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              indent: { left: 0 }, // 👈 sin sangría
              children: [new TextRun({ text: "------------------------------------------------------------------------------------------------", bold: true, font: "Arial", size: 28 })],
              spacing: { before: 0, after: 0 },
            }),
          ] : []), 

            // 👇 salto de línea entre guiones y primer bloque
            new Paragraph({
              children: [],
              spacing: { before: 0, after: 0 },
            }),

            // Zonas
            ...zonas.flat(),

            // 👇 salto de línea entre última zona y firma
            new Paragraph({
              children: [],
              spacing: { before: 0, after: 0 },
            }),

            // Firma
            oleajeAdvertencia,
            cierre,
            nnnnMarady,
          ],
        },
      ],
    });
    const nombreFinal = replaceFunction(pronosticoActual.archivoName, fechaInicio, fechaFin, fechaFin1, fechaFin2, pronosticoActual.isDayAndNight, isDay, isMariel)
    try {
      const blob = await Packer.toBlob(doc);
      const nombreArchivo = `${nombreFinal}.docx`;
      saveAs(blob, nombreArchivo);
    } catch (error) {
      console.error("Error al generar el documento:", error);
    }
  };

  return (
    <button
      onClick={handleGuardar}
      className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
    >
      Guardar Pronóstico
    </button>
  );
}
