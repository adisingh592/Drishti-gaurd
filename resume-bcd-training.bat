@echo off
cd /d "%~dp0"
title Drishti Guard — Resume B/C/D from checkpoint
echo.
echo ============================================================
echo   Resume Models B/C/D from saved checkpoint
echo   Progress file: ai_models\checkpoints\bcd_progress.json
echo ============================================================
echo.

cd ml
if exist .venv\Scripts\python.exe (
  .venv\Scripts\python ..\ai_models\scripts\resume_bcd_from_checkpoint.py
) else (
  python ..\ai_models\scripts\resume_bcd_from_checkpoint.py
)

echo.
pause
