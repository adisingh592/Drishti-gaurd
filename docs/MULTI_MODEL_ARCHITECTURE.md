# Multi-Model Architecture

## Overview

Drishti Guard uses **four specialized YOLO models** orchestrated by the **Master Detection Engine**. Phase 1 weights are **Model A only** and are never retrained by this pipeline.

```
Upload → Master Engine → Model A (+ YOLO-World weapons) → Model D filter → Model B heuristics → Model C traffic → Merge → Threat score → Report
```

## Model A — Security Threats (Phase 1)

| Item | Value |
|------|--------|
| Path | `ai_models/Model_A_SecurityThreats/weights/best.pt` |
| Source | `ml/models/phase1/best.pt` (read-only canonical) |
| Architecture | YOLO11m |
| Retrain | **No** |

## Weapon accuracy

- **YOLO-World** (`ENABLE_WEAPON_SCAN=true`) is the primary handgun/rifle detector.
- Model A `gun` class is mapped to **Handgun** for display; do not disable World scan to preserve accuracy.

## Models B–D

See each folder’s `config/model.yaml` and `training/README.md`. Training scripts are stubs until datasets are prepared.

## Backend

- `USE_MASTER_ENGINE=true` in `backend/.env`
- `app/services/master_detection_adapter.py` bridges FastAPI to `ai_models/`

## Threat levels

Safe → Moderate Risk → High Risk → Critical Risk

Priority: Handgun, Rifle, Fire, Accident, Violence (critical); Knife, Fighting, overcrowding (high); smoke, mask violations (medium).
