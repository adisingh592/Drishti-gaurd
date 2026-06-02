@echo off
cd /d "%~dp0"
echo Drishti Guard Phase 1 Pipeline
echo.

if not exist .venv\Scripts\python.exe (
  python -m venv .venv
  call .venv\Scripts\pip install -r requirements.txt
)

call .venv\Scripts\python scripts\download_all.py
if errorlevel 1 exit /b 1
call .venv\Scripts\python scripts\prepare_all.py
if errorlevel 1 exit /b 1
call .venv\Scripts\python scripts\train.py
if errorlevel 1 exit /b 1
call .venv\Scripts\python scripts\validate.py
call .venv\Scripts\python scripts\export.py
echo.
echo Phase 1 complete. Weights: models\phase1\best.pt
pause
