@echo off
setlocal EnableExtensions
title Drishti Guard Launcher

cd /d "%~dp0"
set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%front end"
set "BACKEND_URL=http://127.0.0.1:8000/api/health"
set "FRONTEND_URL=http://localhost:5173"
set "APP_URL=http://localhost:5173/app/upload"

echo.
echo  ============================================
echo    Drishti Guard - Starting Backend + Frontend
echo  ============================================
echo.

if not exist "%BACKEND%\app\main.py" (
  echo [ERROR] Backend not found at: %BACKEND%
  pause
  exit /b 1
)

if not exist "%FRONTEND%\package.json" (
  echo [ERROR] Frontend not found at: %FRONTEND%
  pause
  exit /b 1
)

where python >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Python is not installed or not on PATH.
  pause
  exit /b 1
)

if not exist "%BACKEND%\.venv\Scripts\python.exe" (
  echo [SETUP] Creating Python virtual environment...
  cd /d "%BACKEND%"
  python -m venv .venv
  if errorlevel 1 (
    echo [ERROR] Failed to create venv.
    pause
    exit /b 1
  )
  echo [SETUP] Installing backend dependencies - first run may take several minutes...
  call .venv\Scripts\pip install -r requirements.txt
  if errorlevel 1 (
    echo [ERROR] pip install failed.
    pause
    exit /b 1
  )
  cd /d "%ROOT%"
)

where pnpm >nul 2>&1
if errorlevel 1 (
  where npm >nul 2>&1
  if errorlevel 1 (
    echo [ERROR] Install Node.js and pnpm or npm for the frontend.
    pause
    exit /b 1
  )
  set "FE_INSTALL=npm install"
  set "FE_DEV=npm run dev"
) else (
  set "FE_INSTALL=pnpm install"
  set "FE_DEV=pnpm dev"
)

if not exist "%FRONTEND%\node_modules\vite" (
  echo [SETUP] Installing frontend dependencies...
  cd /d "%FRONTEND%"
  call %FE_INSTALL%
  if errorlevel 1 (
    echo [ERROR] Frontend install failed.
    pause
    exit /b 1
  )
  cd /d "%ROOT%"
)

echo [1/3] Starting FastAPI backend on port 8000...
start "Drishti Guard - Backend (API)" cmd /k "cd /d "%BACKEND%" && .venv\Scripts\python run.py"

echo [2/3] Waiting for backend API...
set /a BACKEND_TRIES=0
:wait_backend
set /a BACKEND_TRIES+=1
if %BACKEND_TRIES% GTR 90 (
  echo [ERROR] Backend did not start within ~3 minutes. Check the Backend window for errors.
  pause
  exit /b 1
)
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri '%BACKEND_URL%' -UseBasicParsing -TimeoutSec 3; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  ping 127.0.0.1 -n 3 >nul
  goto wait_backend
)
echo       Backend is ready: %BACKEND_URL%

echo [3/3] Starting Vite frontend on port 5173...
start "Drishti Guard - Frontend (UI)" cmd /k "cd /d "%FRONTEND%" && %FE_DEV%"

echo       Waiting for frontend (proxies /api to backend)...
set /a FRONTEND_TRIES=0
:wait_frontend
set /a FRONTEND_TRIES+=1
if %FRONTEND_TRIES% GTR 60 (
  echo [ERROR] Frontend did not start within ~2 minutes. Check the Frontend window.
  pause
  exit /b 1
)
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri '%FRONTEND_URL%' -UseBasicParsing -TimeoutSec 3; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  ping 127.0.0.1 -n 3 >nul
  goto wait_frontend
)
echo       Frontend is ready: %FRONTEND_URL%

echo.
echo  Opening Upload and Analyze in your browser...
echo  Frontend: %FRONTEND_URL%  --^>  proxies /api  --^>  Backend: http://127.0.0.1:8000
echo.
start "" "%APP_URL%"

echo  ============================================
echo    Drishti Guard is running
echo    - Keep both terminal windows open
echo    - Upload page: %APP_URL%
echo    - API docs:    http://127.0.0.1:8000/docs
echo  ============================================
echo.
pause
