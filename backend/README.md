# Drishti Guard Backend

FastAPI surveillance video analysis API with YOLOv11, ByteTrack, crowd density, vehicle tracking, and risk scoring.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env
python run.py
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/upload` | Upload video, returns `upload_id` |
| POST | `/api/analyze/{upload_id}` | Start background analysis |
| GET | `/api/analyze/{upload_id}/progress` | Poll progress |
| GET | `/api/analyze/{upload_id}/results` | Full analysis JSON |
| GET | `/api/analytics/{upload_id}` | Same as results |
| GET | `/api/files/videos/{upload_id}` | Stream uploaded video |
| GET | `/api/health` | Health + YOLO status |

## Custom weapon model

Set `CUSTOM_MODEL_PATH` in `.env` to your fine-tuned YOLO weights for gun/knife/masked-person classes.

## MongoDB (optional)

Set `MONGODB_URL` in `.env`. Without it, metadata is stored in `data/db_store.json`.
