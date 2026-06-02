"""Backend adapter for ai_models.MasterDetectionEngine."""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Optional

import numpy as np

from app.config import get_settings
from app.services.yolo_detector import FrameDetection

_REPO_ROOT = Path(__file__).resolve().parents[3]
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

_engine = None


def _ensure_model_a_weights() -> None:
    setup_script = _REPO_ROOT / "ai_models" / "setup_models.py"
    model_a = _REPO_ROOT / "ai_models" / "Model_A_SecurityThreats" / "weights" / "best.pt"
    if not model_a.exists() and setup_script.exists():
        import runpy

        runpy.run_path(str(setup_script), run_name="__setup__")


def get_master_engine():
    global _engine
    if _engine is None:
        _ensure_model_a_weights()
        from ai_models.MasterDetectionEngine import MasterDetectionEngine

        settings = get_settings()
        device = "cuda" if settings.use_gpu else "cpu"
        try:
            import torch

            if device == "cuda" and not torch.cuda.is_available():
                device = "cpu"
        except Exception:
            device = "cpu"
        _engine = MasterDetectionEngine(device=device, conf=settings.confidence_threshold)
    return _engine


class MasterDetectionAdapter:
    """Drop-in batch detector using Master Engine (Model A + D + heuristics)."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.engine = get_master_engine()
        self.device = self.engine.loader.device
        self.model = self.engine.loader.load_a()
        self._load_error = None if self.model else "model_a_missing"

    @property
    def is_ready(self) -> bool:
        return self.model is not None

    def detect_batch(
        self,
        frames: list[np.ndarray],
        frame_numbers: list[int],
        fps: float,
    ) -> list[FrameDetection]:
        if not frames:
            return []
        if not self.is_ready:
            return []

        unified = self.engine.detect_batch(frames, frame_numbers, fps)
        return [
            FrameDetection(
                frame_number=u.frame_number,
                timestamp_seconds=u.timestamp_seconds,
                class_name=u.class_name,
                confidence=u.confidence,
                bbox=u.bbox,
                track_id=u.track_id,
            )
            for u in unified
        ]

    def detect_with_tracking(
        self,
        frame: np.ndarray,
        frame_number: int,
        fps: float,
    ) -> list[FrameDetection]:
        if not self.is_ready:
            return []
        from ultralytics import YOLO

        model: YOLO = self.model
        conf = self.settings.confidence_threshold
        results = model.track(frame, persist=True, conf=conf, verbose=False, device=self.device)
        if not results:
            return []
        result = results[0]
        ts = frame_number / fps if fps > 0 else 0.0
        from ai_models.MasterDetectionEngine.class_maps import MODEL_A_IDS

        out: list[FrameDetection] = []
        if result.boxes is None:
            return out
        for i in range(len(result.boxes)):
            cid = int(result.boxes.cls[i].item())
            if cid not in MODEL_A_IDS:
                continue
            conf_v = float(result.boxes.conf[i].item())
            xyxy = result.boxes.xyxy[i].tolist()
            tid = None
            if result.boxes.id is not None:
                tid = int(result.boxes.id[i].item())
            out.append(
                FrameDetection(
                    frame_number=frame_number,
                    timestamp_seconds=ts,
                    class_name=MODEL_A_IDS[cid],
                    confidence=conf_v,
                    bbox=(xyxy[0], xyxy[1], xyxy[2], xyxy[3]),
                    track_id=tid,
                )
            )
        return out
