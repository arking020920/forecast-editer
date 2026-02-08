@echo on
cd /d C:\Users\ARMIN\Desktop\Reactjs\forecast-editer\forecast-editer\backend

:: Activar el entorno virtual
call venv\Scripts\activate

:: Ejecutar Flask dentro del entorno
flask run

:: Mantener la consola abierta al terminar
pause
