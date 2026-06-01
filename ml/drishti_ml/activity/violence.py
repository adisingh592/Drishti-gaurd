"""RWF-2000 violence clip classifier (lightweight CNN stub for Phase 1)."""

from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np

from drishti_ml.constants import RAW_DIR


class ViolenceClassifier:
    """Heuristic + optional frame-folder manifest from RWF-2000 download."""

    def __init__(self) -> None:
        self.manifest_path = RAW_DIR / "rwf2000" / "manifest.json"

    def predict_clip(self, frames: list[np.ndarray]) -> dict:
        # Phase 1: motion-energy heuristic until dedicated CNN is trained
        if len(frames) < 2:
            return {"label": "normal", "confidence": 0.5}
        diffs = []
        for i in range(1, min(len(frames), 16)):
            g1 = cv2.cvtColor(frames[i - 1], cv2.COLOR_BGR2GRAY)
            g2 = cv2.cvtColor(frames[i], cv2.COLOR_BGR2GRAY)
            diffs.append(float(np.mean(cv2.absdiff(g1, g2))))
        energy = float(np.mean(diffs))
        if energy > 25:
            return {"label": "violence", "confidence": min(0.95, energy / 40)}
        return {"label": "normal", "confidence": 0.7}
