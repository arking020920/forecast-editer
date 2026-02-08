export const pronosticos = {
  marino: 
  [
    {
    id:0,
    info:`
PRONÓSTICO MARINO PARA LOS HOMBRES DEL MAR, VÁLIDO DESDE LAS 10 DE LA MAÑANA DE HOY {fechaInicio} HASTA LAS 10 DE LA MAÑANA DEL {fechaFin}.
    `,
    isDayAndNight:false,
    insertGuion:true,
    oleajeAdvertencia: false,
    objectInfo : {isPhoto: true, encabezadoFontSize: 14, zonasFontSize: 12},
    titulo: "PRONÓSTICO MARINO PARA LOS HOMBRES DEL MAR",
    archivoName:'PRONÓSTICO MARINO PARA LOS HOMBRES DEL MAR.{day0Number}.{month0Number}.{yearNumber}',
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
    `},

  {
    id:1,
    titulo: "MARADY",
    archivoName:'FQCU40.12.{day0Number}.{month0Number}.{yearNumber}',
    insertGuion:false,
    objectInfo : {isPhoto: false, encabezadoFontSize: 12, zonasFontSize: 12},
    info:`PRONÓSTICO METEOROLÓGICO PARA LOS MARES ADYACENTES A CUBA.\n
    Fecha: {dayNumber}/{monthNumber}/{yearNumber}\n
    Válido desde las 00:00 hasta las 24:00 horas del {fechaFin}.
    `,
    isDayAndNight:true,
    oleajeAdvertencia: false,
    encabezado: `ZCZC
FQCU40 MUHV {day0Number}1200Z
PRONÓSTICO METEOROLÓGICO PARA LOS MARES ADYACENTES A CUBA.
CENTRO DE METEOROLOGÍA MARINA. INSTITUTO DE METEOROLOGÍA (CITMA).

Fecha: {dayNumber}/{monthNumber}/{yearNumber}	                                                Hora local: 13:00
----------------------------------------------------------------------------------------------------------------------
Válido desde las 00:00 hasta las 24:00 horas del {fechaFin}.
----------------------------------------------------------------------------------------------------------------------`,
    zonas: [
      {
       bloque:'SITUACIÓN METEOROLÓGICA SIGNIFICATIVA', 
       nameBloqueInclude:true,
       nombre:"",
       contenidoKey: 'zona1'
      },
      {
        bloque: "GOLFO DE MÉXICO",
        nameBloqueInclude: true,
        nombre: "Mitad Occidental:\nPorción Noroccidental:",
        contenidoKey: "zona2",
      },
      {
        bloque: "GOLFO DE MEXICO",
        nameBloqueInclude: false,
        nombre: "Porción Suroccidental:",
        contenidoKey: "zona3",
      },
      {
        bloque: "Golfo de Mexico",
        nameBloqueInclude: false,
        nombre: "Mitad Oriental:\nPorción Nororiental:",
        contenidoKey: "zona4",
      },
      {
        bloque: "GOLFO DE MÉXICO",
        nameBloqueInclude: false,
        nombre: "Porción suroriental:",
        contenidoKey: "zona5",
      },
      {
        bloque: "MAR CARIBE",
        nameBloqueInclude: true,
        nombre: "Mitad Occidental:",
        contenidoKey: "zona6",
      },
      {
        bloque: "Mar Caribe",
        nameBloqueInclude: false,
        nombre: "Mitad Oriental:",
        contenidoKey: "zona7",
      },
      {
        bloque: "Mar Caribe",
        nameBloqueInclude: false,
        nombre: "Región Mosquitos-Darién:",
        contenidoKey: "zona8",
      },
      {
        bloque: "PUERTO RICO Y LA FLORIDA HASTA LAS BERMUDAS",
        nameBloqueInclude: true,
        nombre: "Porción noroccidental:",
        contenidoKey: "zona9",
      },
      {
        bloque: "Atlantico",
        nameBloqueInclude: false,
        nombre: "Porción suroccidental:",
        contenidoKey: "zona10",
      },
      {
        bloque: "Atlantico",
        nameBloqueInclude: false,
        nombre: "Canal Viejo de las Bahamas:",
        contenidoKey: "zona11",
      },
      {
        bloque: "Atlantico",
        nameBloqueInclude: false,
        nombre: "Porción nororiental:",
        contenidoKey: "zona12",
      },
      {
        bloque: "Atlantico",
        nameBloqueInclude: false,
        nombre: "Porción suroriental:",
        contenidoKey: "zona13",
      },
      
      
    ],
    cierre: `
Pronosticadores: {username}.
    `},
    {
    id:2,
    info:`
PRONOSTICO HIDROMETEOROLOGICO PARA EL MAR TERRITORIAL DE CUBA\n
Fecha: {dayNumber}/{monthNumber}/{yearNumber}\n
    Válido desde las 00:00 hasta las 24:00 horas del {fechaFin}.`,
    isDayAndNight:true,
    insertGuion:false,
    oleajeAdvertencia:true,
    objectInfo : {isPhoto: true, encabezadoFontSize: 12, zonasFontSize: 12},
    titulo: "COSTAS DE CUBA {MORNING}",
    archivoName:'FQC41.12.{day0Number}.{month0Number}.{yearNumber}',
    encabezado: `FQCU41 MUHV {day0Number}1200Z
PRONÓSTICO HIDROMETEOROLÓGICO PARA EL MAR TERRITORIAL DE CUBA    
INSTITUTO DE METEOROLOGÍA, CENTRO DE METEOROLOGÍA MARINA, SECCIÓN DE PRONÓSTICOS HIDROMETEOROLÓGICOS (CITMA).
----------------------------------------------------------------------------------------------------------------------
Fecha: {dayNumber}/{monthNumber}/{yearNumber}	                                                Hora local: 13:00
----------------------------------------------------------------------------------------------------------------------
Válido desde las 00:00 hasta las 24:00 horas del {fechaFin}.
----------------------------------------------------------------------------------------------------------------------`,
    zonas: [
      {
        bloque: "SITUACIÓN SINÓPTICA SIGNIFICATIVA",
        nameBloqueInclude: true,
        nombre: "",
        contenidoKey: "zona1",
      },
      {
        bloque: "COSTA NORTE",
        nameBloqueInclude: true,
        nombre: "DESDE CABO SAN ANTONIO HASTA PENÍNSULA HICACOS:",
        contenidoKey: "zona2",
      },
      {
        bloque: "COSTA NORTE",
        nameBloqueInclude: false,
        nombre: "DESDE PENÍNSULA HICACOS HASTA PUNTA MATERNILLOS:",
        contenidoKey: "zona3",
      },
      {
        bloque: "COSTA NORTE",
        nameBloqueInclude: false,
        nombre: "DESDE PUNTA MATERNILLOS HASTA PUNTA MAISÍ:",
        contenidoKey: "zona4",
      },
      {
        bloque: "COSTA SUR",
        nameBloqueInclude: true,
        nombre: "DESDE PUNTA MAISÍ HASTA CABO CRUZ:",
        contenidoKey: "zona5",
      },
      {
        bloque: "COSTA SUR",
        nameBloqueInclude: false,
        nombre: "DESDE CABO CRUZ HASTA EL CABO SAN ANTONIO, INCLUYENDO A LA ISLA DE LA JUVENTUD:",
        contenidoKey: "zona6",
      },
    ],
    cierre: `
      Pronosticadores: {username}.
    `},
     {
    id:3,
    info:`
PRONOSTICO ESPECIALIZADO DE LAS COSTAS DE CUBA PARA LA EMPRESA DE NAVEGACIÓN CARIBE\n
Fecha: {dayNumber}/{monthNumber}/{yearNumber}\n
    Válido desde las 00:00 hasta las 24:00 horas del {fechaFin}.`,
    isDayAndNight:false,
    insertGuion:false,
    oleajeAdvertencia:true,
    objectInfo : {isPhoto: true, encabezadoFontSize: 12, zonasFontSize: 12},
    titulo: "CARIBE",
    archivoName:'CARIBE.{day0Number}.{month0Number}.{yearNumber}',
    encabezado: `PRONOSTICO ESPECIALIZADO DE LAS COSTAS DE CUBA PARA LA EMPRESA DE NAVEGACIÓN CARIBE. 
INSTITUTO DE METEOROLOGÍA, CENTRO DE METEOROLOGÍA MARINA, SECCIÓN DE PRONÓSTICOS HIDROMETOROLÓGICOS.
--------------------------------------------------------------------------------------------------------------------
e-mail: pmando@navcar.transnet.cu,Yoan Manuel J. P Mando 
(jpmando@navcar.transnet.cu)
Teléfono: 7698-0182 EXT. 1188                 
--------------------------------------------------------------------------------------------------------------------
FECHA: {dayNumber}/{monthNumber}/{yearNumber}                                                               HORA: 15:00 Local.
--------------------------------------------------------------------------------------------------------------------
Válido desde las 00:00 hasta las 24:00 horas del {fechaFin}.
--------------------------------------------------------------------------------------------------------------------`,
    zonas: [
      {
        bloque: "SITUACIÓN SINÓPTICA SIGNIFICATIVA",
        nameBloqueInclude: true,
        nombre: "",
        contenidoKey: "zona1",
      },
      {
        bloque: "COSTA NORTE",
        nameBloqueInclude: true,
        nombre: "DESDE CABO SAN ANTONIO HASTA PENÍNSULA HICACOS:",
        contenidoKey: "zona2",
      },
      {
        bloque: "COSTA NORTE",
        nameBloqueInclude: false,
        nombre: "DESDE PENÍNSULA HICACOS HASTA PUNTA MATERNILLOS:",
        contenidoKey: "zona3",
      },
      {
        bloque: "COSTA NORTE",
        nameBloqueInclude: false,
        nombre: "DESDE PUNTA MATERNILLOS HASTA PUNTA MAISÍ:",
        contenidoKey: "zona4",
      },
      {
        bloque: "COSTA SUR",
        nameBloqueInclude: true,
        nombre: "DESDE PUNTA MAISÍ HASTA CABO CRUZ:",
        contenidoKey: "zona5",
      },
      {
        bloque: "COSTA SUR",
        nameBloqueInclude: false,
        nombre: "DESDE CABO CRUZ HASTA EL CABO SAN ANTONIO, INCLUYENDO A LA ISLA DE LA JUVENTUD:",
        contenidoKey: "zona6",
      },
    ],
    cierre: `
      Pronosticadores: {username}.
    `},
  ],
};
