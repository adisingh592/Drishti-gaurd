"""Phase 1 FastAPI — detection + CCTV analysis."""

from __future__ import annotations

import shutil
import tempfile
import uuid
from pathlib import Path

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import sys

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from drishti_ml.inference.engine import DrishtiEngine

app = FastAPI(title="Drishti Guard ML API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

_engine: DrishtiEngine | None = None


def get_engine() -> DrishtiEngine:
    global _engine
    if _engine is None:
        _engine = DrishtiEngine()
    return _engine


class DetectResponse(BaseModel):
    detections: list
    tracks: list
    crowd_count: int
    crowd_level: str


@app.get("/health")
def health():
    return {"status": "ok", "phase": 1}


@app.post("/detect/image", response_model=DetectResponse)
async def detect_image(file: UploadFile = File(...)):
    import cv2
    import numpy as np

    data = await file.read()
    arr = np.frombuffer(data, np.uint8)
    frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    result = get_engine().predict_frame(frame)
    crowd = sum(1 for d in result["detections"] if d["class"] == "person")
    from drishti_ml.crowd.analyzer import crowd_level

    return DetectResponse(
        detections=result["detections"],
        tracks=result["tracks"],
        crowd_count=crowd,
        crowd_level=crowd_level(crowd),
    )


@app.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    suffix = Path(file.filename or "video.mp4").suffix
    tmp = Path(tempfile.gettempdir()) / f"drishti_{uuid.uuid4().hex}{suffix}"
    with tmp.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    import subprocess

    out = tmp.with_suffix(".json")
    subprocess.run(
        [sys.executable, str(ML_ROOT / "inference" / "analyze_cctv.py"), str(tmp), "--out-dir", str(tmp.parent)],
        check=True,
        cwd=str(ML_ROOT),
    )
    report = tmp.parent / f"{tmp.stem}_report.json"
    return {"report_path": str(report), "content": report.read_text(encoding="utf-8") if report.exists() else {}}
