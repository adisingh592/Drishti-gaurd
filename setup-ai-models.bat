@echo off
cd /d "%~dp0"
echo Setting up ai_models (copies Phase 1 weights into Model A — never overwrites)...
python ai_models\setup_models.py
if errorlevel 1 (
  echo Try: ml\.venv\Scripts\python ai_models\setup_models.py
  pause
  exit /b 1
)
echo Done.
pause
