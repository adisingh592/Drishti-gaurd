# Drishti Guard — Phase 1 ML Pipeline

Lightweight surveillance AI for **RTX 3050 6GB** / **32GB RAM** / **10GB dataset cap**.

## Tasks

| Task | Classes |
|------|---------|
| Person | `person` |
| Gun / Knife | `gun`, `knife` |
| Face mask | `mask`, `no_mask` |
| Vehicles | `car`, `motorcycle`, `bus`, `truck` |
| Fire / Smoke | `fire`, `smoke` |
| Crowd | person count thresholds |
| Violence | RWF-2000 frames + motion heuristic |

## Folder structure

```
ml/
├── config/phase1.yaml, classes.yaml
├── datasets/raw/          # downloaded data
├── prepared/drishti_phase1/  # unified YOLO dataset + data.yaml
├── models/phase1/         # best.pt, exports/
├── runs/phase1/           # training runs
├── reports/phase1/        # metrics.json, plots
├── drishti_ml/            # library code
├── scripts/               # download, prepare, train, validate, export
├── inference/             # webcam, image, video, CCTV
├── api/                   # FastAPI :8001
├── dashboard/             # Streamlit :8501
└── docker/
```

## Quick start

```powershell
cd ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

python scripts/download_all.py
python scripts/prepare_all.py
python scripts/train.py
python scripts/validate.py
python scripts/export.py
```

Or run everything: **`run_phase1.bat`**

## Training (RTX 3050)

| Setting | Value |
|---------|-------|
| model | yolo11m.pt |
| epochs | 100 |
| imgsz | 640 |
| batch | 8 (falls back to 4 on OOM) |
| amp | true |
| cache | true |

## Inference

```powershell
python inference/detect_webcam.py
python inference/detect_image.py path\to\image.jpg
python inference/detect_video.py path\to\video.mp4
python inference/analyze_cctv.py path\to\cctv.mp4
```

## API & Dashboard

```powershell
uvicorn api.main:app --host 0.0.0.0 --port 8001
streamlit run dashboard/app.py
```

## Link to main Drishti backend

In `backend/.env`:

```env
CUSTOM_MODEL_PATH=../ml/models/phase1/best.pt
SIMULATION_MODE=false
```

## Datasets (Phase 1)

| Dataset | Source |
|---------|--------|
| SOHAS / weapons | OD-WeaponDetection (GitHub) |
| Open Images weapons | Merged via weapon downloader |
| COCO person | coco128 subset |
| RMFD masks | Real-World-Masked-Face-Dataset |
| D-Fire | DFireDataset |
| CrowdHuman | Person expansion (COCO subset if bulk unavailable) |
| BDD100K vehicles | COCO vehicle fallback if BDD zip fails |
| RWF-2000 | Frame extraction for violence |

Total download capped at **10GB** in `config/phase1.yaml`.

## Metrics

After `validate.py`: `reports/phase1/metrics.json` — mAP50, mAP50-95, precision, recall, F1, confusion matrix plots from Ultralytics.

## Export

`scripts/export.py` → `models/phase1/exports/` (ONNX, TorchScript)

## Tracking

ByteTrack (default) and DeepSORT via `supervision` in `drishti_ml/tracking/tracker.py`.
