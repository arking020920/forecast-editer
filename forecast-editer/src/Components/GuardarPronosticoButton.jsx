import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } from "docx";
import { saveAs } from "file-saver";
import { useForecast } from "../context/ForecastContext";
import { pronosticos } from "../data/pronosticos";

export default function GuardarPronosticoButton() {
  const { tipoDePronostico, fechaInicio, fechaFin, username, contenido } = useForecast();
  const pronosticoActual = pronosticos[tipoDePronostico] || pronosticos.marino;

  const handleGuardar = async () => {
    // Cargar imagen desde public
    const response = await fetch("/maritimaLogo.png");
    const logoBuffer = await response.arrayBuffer();

    // Encabezado
    const encabezado = pronosticoActual.encabezado
      .replace("{fechaInicio}", fechaInicio.toLocaleDateString("es-ES"))
      .replace("{fechaFin}", fechaFin.toLocaleDateString("es-ES"))
      .toUpperCase().slice(0, -105);

    // Zonas
    const zonas = pronosticoActual.zonas.map((z) => {
      const bloque = z.nameBloqueInclude
        ? new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 0 }, // 👈 sin sangría
            children: [new TextRun({ text: `${z.bloque.toUpperCase()}:`, bold: true, font: "Arial", size: 24 })],
            spacing: { before: 0, after: 0 },
          })
        : null;

      const nombre = new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { left: 0 }, // 👈 sin sangría
        children: [new TextRun({ text: z.nombre.toUpperCase(), bold: true, font: "Arial", size: 24 })],
        spacing: { before: 0, after: 0 },
      });

      const texto = new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { left: 0 }, // 👈 sin sangría
        children: [new TextRun({ text: contenido[z.contenidoKey] || "", font: "Arial", size: 24 })],
        spacing: { before: 0, after: 0 },
      });

      // 👇 añadimos salto de línea después de cada zona
      const salto = new Paragraph({
        children: [],
        spacing: { before: 0, after: 0 },
      });

      return [bloque, nombre, texto, salto].filter(Boolean);
    });

    // Firma
    const cierre = new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 0 }, // 👈 sin sangría
      children: [new TextRun({ text: pronosticoActual.cierre.replace("{username}", username), bold: true, font: "Arial", size: 24 })],
      spacing: { before: 0, after: 0 },
    });

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
                new ImageRun({
                  data: logoBuffer,
                  transformation: {
                    width: Math.round(2.62 * 96), // 2.62'' → px (aprox 252px)
                    height: Math.round(0.8 * 96),  // 0.8'' → px (aprox 77px)
                  },
                }),
              ],
              spacing: { before: 0, after: 0 },
            }),

            // Encabezado
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              indent: { left: 0 }, // 👈 sin sangría
              children: [new TextRun({ text: encabezado, bold: true, font: "Arial", size: 28 })],
              spacing: { before: 0, after: 0 },
            }),

            // Guiones
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              indent: { left: 0 }, // 👈 sin sangría
              children: [new TextRun({ text: "------------------------------------------------------------------------------------------------", bold: true, font: "Arial", size: 28 })],
              spacing: { before: 0, after: 0 },
            }),

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
            cierre,
          ],
        },
      ],
    });

    try {
      const blob = await Packer.toBlob(doc);
      const mes = fechaInicio.toLocaleDateString("es-ES", { month: "long" }).toUpperCase();
      const nombreArchivo = `${pronosticoActual.titulo} ${mes}.docx`;
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
