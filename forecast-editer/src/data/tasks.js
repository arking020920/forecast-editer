// src/data/tareas.js
export const tareas = [
  // 0 Hombres del Mar
  {
    id: "hombres-del-mar",
    text: "Realizar pronóstico Hombres del Mar",
    deadline: "10:00 AM",
    type: "save",
    filePattern: false,
    name: 0,
    route: "Hombres del mar",
  },

  // 1 Marady Día + salvados (saveInRed)
  {
    id: "marady-dia",
    text: "Realizar pronóstico Marady (Día)",
    deadline: "1:00 PM",
    type: "save",
    filePattern: true,
    name: 1,
    route: "Marady FQCU40.12",
  },
  {
    id: "salvar-fqc40-dia",
    text: "Salvar Documento Word FQC40 en Pron-Nac y en telex",
    deadline: "1:00 PM",
    type: "saveInRed",
    filePattern: true,
    fileName: "FQC40.docx",
    routes: ["\\\\10.0.22.182\\ftp\\Pron-Nac", "\\\\10.0.22.182\\ftp\\telex"]
  },
  {
    id: "salvar-marady-dia",
    text: "Salvar Marady.txt en Pron-Nac y en telex",
    deadline: "1:00 PM",
    type: "saveInRed",
    filePattern: true,
    fileName: "Marady.txt",
    routes: ["\\\\10.0.22.182\\ftp\\Pron-Nac", "\\\\10.0.22.182\\ftp\\telex"]
  },

  // 2 Costas Día + salvar FQC41
  {
    id: "costas-cuba-dia",
    text: "Realizar pronóstico Costas de Cuba (Día)",
    deadline: "1:30 PM",
    type: "save",
    filePattern: true,
    name: 2,
    route: "Costa FQCU41.12"
  },
  {
    id: "salvar-fqc41-dia",
    text: "Salvar Documento Word FQC41 en Pron-Nac y en telex",
    deadline: "1:30 PM",
    type: "saveInRed",
    filePattern: true,
    fileName: "FQC41.docx",
    routes: ["\\\\10.0.22.182\\ftp\\Pron-Nac", "\\\\10.0.22.182\\ftp\\telex"]
  },

  // 3 CARIBE + correo
  {
    id: "caribe",
    text: "Realizar pronóstico CARIBE",
    deadline: "3:00 PM",
    type: "save",
    filePattern: false,
    name: 3,
    route: "CARIBE"
  },
  {
    id: "correo-caribe",
    text: "Enviar por Correo Pronóstico para la Empresa Caribe",
    deadline: "3:00 PM",
    type: "correo",
    manualCheck: true
  },

  // 4 Tropas + correo
  {
    id: "tropas-guardafronteras",
    text: "Realizar pronóstico Tropas Guardafronteras",
    deadline: "3:00 PM",
    type: "save",
    filePattern: false,
    name: 4,
    route: "TGF"
  },
  {
    id: "correo-guardafronteras",
    text: "Enviar Por Correo Pronóstico para las Tropas Guardafronteras",
    deadline: "3:00 PM",
    type: "correo",
    manualCheck: true
  },

  // 5 Mariel Tarde + correo
  {
    id: "mariel-tarde",
    text: "Realizar pronóstico Bahía del Mariel (Tarde)",
    deadline: "6:00 PM",
    type: "save",
    filePattern: false,
    name: 5,
    route: "Mariel 6 PM"
  },
  {
    id: "correo-mariel-tarde",
    text: "Enviar por Correo Pronóstico Bahía del Mariel (Tarde)",
    deadline: "6:00 PM",
    type: "correo",
    manualCheck: true
  },

  // Marady Noche + salvados (mismo FQC40/Marady.txt)
  {
    id: "marady-noche",
    text: "Realizar pronóstico Marady (Noche)",
    deadline: "1:00 AM",
    type: "save",
    filePattern: true,
    name: 1,
    route: "Marady FQCU40.00"
  },
  {
    id: "salvar-fqc40-noche",
    text: "Salvar Documento Word FQC40 en Pron-Nac y en telex",
    deadline: "1:00 AM",
    type: "saveInRed",
    filePattern: true,
    fileName: "FQC40.docx",
    routes: ["\\\\10.0.22.182\\ftp\\Pron-Nac", "\\\\10.0.22.182\\ftp\\telex"]
  },
  {
    id: "salvar-marady-noche",
    text: "Salvar Marady.txt en Pron-Nac y en telex",
    deadline: "1:00 AM",
    type: "saveInRed",
    filePattern: true,
    fileName: "Marady.txt",
    routes: ["\\\\10.0.22.182\\ftp\\Pron-Nac", "\\\\10.0.22.182\\ftp\\telex"]
  },

  // Costas Noche + salvar FQC41
  {
    id: "costas-cuba-noche",
    text: "Realizar pronóstico Costas de Cuba (Noche)",
    deadline: "1:30 AM",
    type: "save",
    filePattern: true,
    name: 2,
    route: "Costa FQCU41.00"
  },
  {
    id: "salvar-fqc41-noche",
    text: "Salvar Documento Word FQC41 en Pron-Nac y en telex",
    deadline: "1:30 AM",
    type: "saveInRed",
    filePattern: true,
    fileName: "FQC41.docx",
    routes: ["\\\\10.0.22.182\\ftp\\Pron-Nac", "\\\\10.0.22.182\\ftp\\telex"]
  },

  // Mariel Mañana + correo
  {
    id: "mariel-manana",
    text: "Realizar pronóstico Bahía del Mariel (Mañana)",
    deadline: "6:00 AM",
    type: "save",
    filePattern: false,
    name: 5,
    route: "Mariel 6 AM"
  },
  {
    id: "correo-mariel-manana",
    text: "Enviar por Correo Pronóstico Bahía del Mariel (Mañana)",
    deadline: "6:00 AM",
    type: "correo",
    manualCheck: true
  }
];
