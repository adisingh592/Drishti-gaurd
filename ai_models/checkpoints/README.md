# B/C/D training checkpoint

## Save point (current)

See **`bcd_progress.json`** for the full machine-readable state.

| Model | Download | Train | Weights |
|-------|----------|-------|---------|
| **A** | N/A (frozen Phase 1) | Do not retrain | `Model_A_SecurityThreats/weights/best.pt` |
| **B** | Mall crowd (2000) | Done (early stop) | `Model_B_CrowdBehavior/weights/best.pt` |
| **C** | Libre traffic (680 staged) | Done (early stop epoch 58) | `Model_C_TrafficMonitoring/weights/best.pt` |
| **D** | SHWD helmet (2000 staged) | **Interrupted ~epoch 17/100** | Run resume to finish |

Phase 1 datasets are **not** re-downloaded for B/C/D (see `phase1_skip_datasets` in the JSON).

## How to resume

When you are ready, either:

1. Tell the assistant: **"resume"**, or  
2. From `ml/` (with its venv active), run **`python ../ai_models/scripts/resume_bcd_from_checkpoint.py`**.

That runs `ai_models/scripts/resume_bcd_from_checkpoint.py`, which:

1. Resumes Model **D** YOLO training from `Model_D_SafetyMonitoring/training/runs/train/weights/last.pt`
2. Copies the finished `best.pt` into `Model_D_SafetyMonitoring/weights/`
3. Updates `bcd_progress.json` and runs `audit_datasets.py`

## Optional later

- Enable `optional_aaic_model_c` in `bcd_progress.json` (`"enabled": true`) to ingest AAIC Iran (zip already on disk) and retrain C.
- Manual datasets: ShanghaiTech, UCF-QNRF, UA-DETRAC, Hockey Fights (404), Godseye violence (large HF).
