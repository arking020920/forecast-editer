export const pronosticos = {
  marino: {
    titulo: "PRONÓSTICO MARINO PARA LOS HOMBRES DEL MAR",
    encabezado: `
PRONÓSTICO MARINO PARA LOS HOMBRES DEL MAR, VÁLIDO DESDE LAS 10 DE LA MAÑANA DE HOY {fechaInicio} HASTA LAS 10 DE LA MAÑANA DEL {fechaFin}.
---------------------------------------------------------------------------------------------------
    `,
    zonas: [
      {
        bloque: "COSTA NORTE",
        nameBloqueInclude: true,
        nombre: "DESDE CABO SAN ANTONIO HASTA PENÍNSULA HICACOS:",
        contenidoKey: "zona1",
      },
      {
        bloque: "COSTA NORTE",
        nameBloqueInclude: false,
        nombre: "DESDE PENÍNSULA HICACOS HASTA PUNTA MATERNILLOS:",
        contenidoKey: "zona2",
      },
      {
        bloque: "COSTA NORTE",
        nameBloqueInclude: false,
        nombre: "DESDE PUNTA MATERNILLOS HASTA PUNTA MAISÍ:",
        contenidoKey: "zona3",
      },
      {
        bloque: "COSTA SUR",
        nameBloqueInclude: true,
        nombre: "DESDE PUNTA MAISÍ HASTA CABO CRUZ:",
        contenidoKey: "zona4",
      },
      {
        bloque: "COSTA SUR",
        nameBloqueInclude: false,
        nombre: "DESDE CABO CRUZ HASTA EL CABO SAN ANTONIO, INCLUYENDO A LA ISLA DE LA JUVENTUD:",
        contenidoKey: "zona5",
      },
    ],
    cierre: `
Desde el Centro de Meteorología Marina les informo el Met. {username}.
    `,
  },
};
