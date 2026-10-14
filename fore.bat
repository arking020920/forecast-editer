@echo off
setlocal enabledelayedexpansion

set PUERTO_FLASK=5000
set URL_FRONTEND=http://localhost:5173

echo ========================================================
echo               INICIANDO PROYECTO
echo ========================================================
echo.

:: ---------------------------------------------------------
:: 1. GESTION DEL BACKEND (FLASK)
:: ---------------------------------------------------------
echo [1/4] Comprobando si Flask ya esta en ejecucion...

:: Chequeo TCP en 127.0.0.1:5000
powershell -Command "$client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', %PUERTO_FLASK%); exit 0 } catch { exit 1 }" >nul 2>&1

if %errorlevel% equ 0 (
    echo [INFO] Flask ya estaba corriendo. Omitiendo inicio.
) else (
    echo [INFO] Flask no esta activo. Iniciando en segundo plano...
    start "Backend - Flask"  cmd /k  "conda activate gfs && cd /d D:\armin\forecast-editer\forecast-editer\backend && python -m flask run"
    
    echo [INFO] Esperando respuesta del Backend...
    :ESPERAR_FLASK
    powershell -Command "$client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', %PUERTO_FLASK%); exit 0 } catch { exit 1 }" >nul 2>&1
    if !errorlevel! neq 0 (
        timeout /t 1 /nobreak >nul
        goto ESPERAR_FLASK
    )
    echo [OK] Backend levantado con exito.
)

echo.
:: ---------------------------------------------------------
:: 2. GESTION DEL FRONTEND (NPM / VITE)
:: ---------------------------------------------------------
echo [2/4] Comprobando si el Frontend HTTP ya esta en ejecucion...

:: Chequeo mediante peticion HTTP real a http://localhost:5173
powershell -Command "try { $res = Invoke-WebRequest -Uri '%URL_FRONTEND%' -UseBasicParsing -TimeoutSec 1; exit 0 } catch { exit 1 }" >nul 2>&1

if %errorlevel% equ 0 (
    echo [INFO] El Frontend ya estaba respondiendo en HTTP. Omitiendo inicio.
) else (
    echo [INFO] Frontend inactivo. Ejecutando 'npm run dev' en segundo plano...
    start "Frontend - NPM" /min cmd /k "cd /d D:\armin\forecast-editer\forecast-editer\forecast-editer && npm run dev"

    echo [INFO] Esperando a que el servidor HTTP localhost:5173 este listo...
    :ESPERAR_FRONTEND
    powershell -Command "try { $res = Invoke-WebRequest -Uri '%URL_FRONTEND%' -UseBasicParsing -TimeoutSec 1; exit 0 } catch { exit 1 }" >nul 2>&1
    if !errorlevel! neq 0 (
        timeout /t 1 /nobreak >nul
        goto ESPERAR_FRONTEND
    )
    echo [OK] Servidor HTTP del Frontend listo y respondiendo.
)

echo.
:: ---------------------------------------------------------
:: 3. APERTURA DEL NAVEGADOR
:: ---------------------------------------------------------
echo ========================================================
echo Abriendo aplicacion en el navegador: %URL_FRONTEND%
echo ========================================================

start %URL_FRONTEND%

:: Termina el script y cierra la ventana de consola
exit