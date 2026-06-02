# Drishti Guard — Multi-Model AI (`ai_models/`)

## Model A (Security) — **FROZEN**

- **Status:** Trained in Phase 1 — **do not retrain or overwrite**
- **Weights:** `Model_A_SecurityThreats/weights/best.pt` (copied from `ml/models/phase1/best.pt`)
- **Classes:** Person, Handgun, Knife, Vehicle, Bus, Truck, Motorcycle
- **Weapons:** YOLO-World scan in backend remains active for Handgun/Rifle accuracy

## Models B, C, D — **Pending**

Train separately when ready (YOLOv11s). Until `weights/best.pt` exists:

| Model | Fallback |
|-------|----------|
| B Crowd | Person-count heuristics → Crowd / Dense_Crowd / Overcrowding |
| C Traffic | Vehicle classes from Model A + existing traffic tracker |
| D Safety | Fire / Smoke / Mask from Phase 1 class filter (same file, separate logical model) |

## Setup

```bat
setup-ai-models.bat
```

Or:

```bash
python -m ai_models.setup_models
```

## Master Detection Engine

`MasterDetectionEngine/` loads models, merges detections, scores threats, and generates reports. Used by the backend when `USE_MASTER_ENGINE=true`.
