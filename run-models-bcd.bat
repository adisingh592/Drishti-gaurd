@echo off
cd /d "%~dp0"
echo Drishti Guard — Download and train Models B, C, D (Model A frozen)
echo.
cd ml
if exist .venv\Scripts\python.exe (
  .venv\Scripts\python ..\ai_models\scripts\audit_datasets.py
  echo.
  .venv\Scripts\python ..\ai_models\scripts\run_bcd_pipeline.py --model all
) else (
  python ..\ai_models\scripts\audit_datasets.py
  python ..\ai_models\scripts\run_bcd_pipeline.py --model all
)
pause
