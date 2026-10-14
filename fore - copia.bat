@echo off
setlocal enabledelayedexpansion

:: CONFIGURACIÓN DE PUERTOS
set PUERTO_FLASK=5000
set PUERTO_FRONTEND=5173
:: (Nota: Si usas React/Next.js cambia 5173 por 3000. Si usas Vite déjalo en 5173)

echo ========================================================
echo [1/4] Iniciando Servidor Flask (Backend)...
echo ========================================================

:: Abre una nueva consola para Flask y ejecuta conda + flask
start "Backend - Flask" cmd /k "conda activate gfs && cd /d D:\armin\forecast-editer\forecast-editer\backend && python -m flask run"

echo.
echo [2/4] Esperando a que Flask monte y este listo en el puerto %PUERTO_FLASK%...

:: Bucle de sondeo: Revisa cada 500ms si el puerto 5000 ya responde
:ESPERAR_FLASK
powershell -Command "$client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', %PUERTO_FLASK%); exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak >nul
    goto ESPERAR_FLASK
)

echo [OK] Backend cargado exitosamente.

echo.
echo ========================================================
echo [3/4] Iniciando Servidor Frontend (npm run dev)...
echo ========================================================

:: Abre una segunda consola para el Frontend
start "Frontend - NPM" cmd /k "cd /d D:\armin\forecast-editer\forecast-editer\forecast-editer && npm run dev"

echo.
echo [4/4] Esperando a que el Frontend monte y este listo en el puerto %PUERTO_FRONTEND%...

:: Bucle de sondeo: Revisa si el puerto del frontend ya responde
:ESPERAR_FRONTEND
powershell -Command "$client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('localhost', %PUERTO_FRONTEND%); exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak >nul
    goto ESPERAR_FRONTEND
)

echo [OK] Frontend montado correctamente.

echo.
echo ========================================================
echo ¡Todo listo! Abriendo navegador principal...
echo ========================================================

:: Abre la dirección en tu navegador predeterminado
start http://localhost:%PUERTO_FRONTEND%

exit