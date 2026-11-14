Forecast-editer es una herramienta WEB que facilita la construccion y edicion de los pronosticos del CMM desarrollada por el aspirante a Msc. Armin de Jesus Quintana Cabrera.
Actualmente cuenta con introduccion de atajos para facilitar la rapida escritura de los pronosticos. Genera el formato adecuado para cada pronostico adapatandose a tipo, fecha y hora. Permite cargar flujo de informacion de un pronostico a otro, ademas de flujo dentro de un mismo pronostico. Cuenta con un gestor de descargas de datos meteorologicos y un elaborador de mapas de las diferentes variables empleadas en los pronosticos. Además cuenta con un visualizador de mapas en tiempo real y un generador de docx con los pronosticos ya formateados adecuadamente. Se trabaja en la automatizacion de los pronosticos empleando agentes de IA.
Dependencias fundamentales:
node.js para administrar las dependencias del frontend (react.js), entorno python en conda para poder usar la biblioteca cfgrib con eccodes, servidor flask gestionando el backend.
¿Como usarlo?
Pasos previos
1- Consiga cualquier distribucion de conda. Cree un entorno e instale la biblioteca cfgrib mediante el gestor de conda. Esto es fundamental para que la biblioteca eccodes se instale adecuadamente.
2- Las demas bibliotecas se pueden instalar via pip con el archivo requirements.txt dentro del entorno que creo previamente
3- Instale node.js
4- Clone el repositorio en alguna carpeta de su eleccion
5- Dirijase a la carpeta frontend en una terminal cd/ruta/a/la/carpeta/frontend y ejecute en la terminal npm install 
Pasos para ejecutar en (Windows) En Linux el procedimiento es analogo
1-Abra una terminal cmd
2-Escriba conda activate ¨nombre-del-entorno-conda¨
3-Una vez dentro del entorno muevase a la ruta de la carpeta backend: cd/ruta/a/la/carpeta/backend
4-Ejecute en la consola python -m flask run
5-Una vez montado el servidor flask muevase a la carpeta frontend: cd/ruta/a/la/carpeta/frontend
6-Ejecute npm run dev
7-Copie la url que le saldra en el navegador
8-Emplee las credenciales basicas user: administrador password: 1234
