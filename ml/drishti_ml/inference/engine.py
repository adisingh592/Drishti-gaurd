"""Shared detection + tracking engine for Phase 1."""

from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np

from drishti_ml.constants import CLASS_NAMES, MODELS_DIR
from drishti_ml.tracking.tracker import MultiTracker


class DrishtiEngine:
    def __init__(
        self,
        weights: str | Path | None = None,
        conf: float = 0.4,
        tracker: str = "bytetrack",
    ) -> None:
        from ultralytics import YOLO

        w = Path(weights or MODELS_DIR / "best.pt")
        if not w.exists():
            w = Path("yolo11m.pt")
        self.model = YOLO(str(w))
        self.conf = conf
        self.tracker = MultiTracker(tracker)  # type: ignore

    def predict_frame(self, frame: np.ndarray, track: bool = True) -> dict:
        results = self.model.predict(frame, conf=self.conf, verbose=False)[0]
        boxes = results.boxes
        if boxes is None:
            return {"detections": [], "tracks": []}

        xyxy = boxes.xyxy.cpu().numpy()
        confs = boxes.conf.cpu().numpy()
        cids = boxes.cls.cpu().numpy().astype(int)
        names = [CLASS_NAMES[c] if c < len(CLASS_NAMES) else str(c) for c in cids]

        dets = []
        for i in range(len(xyxy)):
            dets.append({
                "class": names[i],
                "confidence": float(confs[i]),
                "bbox": xyxy[i].tolist(),
            })

        tracks = []
        if track:
            tracks = [
                {
                    "id": t.track_id,
                    "class": t.class_name,
                    "confidence": t.confidence,
                    "bbox": list(t.bbox),
                }
                for t in self.tracker.update(xyxy, confs, cids, CLASS_NAMES)
            ]

        return {"detections": dets, "tracks": tracks}

    def draw(self, frame: np.ndarray, result: dict) -> np.ndarray:
        out = frame.copy()
        for d in result.get("detections", []):
            x1, y1, x2, y2 = [int(v) for v in d["bbox"]]
            color = (0, 0, 255) if d["class"] in ("gun", "knife") else (0, 255, 255)
            cv2.rectangle(out, (x1, y1), (x2, y2), color, 2)
            cv2.putText(
                out,
                f"{d['class']} {d['confidence']:.0%}",
                (x1, max(15, y1 - 5)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                color,
                2,
            )
        return out
