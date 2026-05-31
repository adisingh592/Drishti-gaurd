from __future__ import annotations

import uuid
from pathlib import Path

import cv2
import numpy as np

from app.config import get_settings
from app.models.schemas import ScreenshotEvidence
from app.services.detection_classes import severity_for_threat
from app.utils.time_format import seconds_to_timestamp


def _slug(label: str) -> str:
    return label.lower().replace(" ", "_").replace("-", "_")[:32]


def capture_screenshot(
    frame: np.ndarray,
    upload_id: str,
    label: str,
    timestamp_seconds: float,
    confidence: float,
    bbox: tuple[float, float, float, float] | None,
    index: int,
) -> ScreenshotEvidence:
    settings = get_settings()
    out = frame.copy()
    h, w = out.shape[:2]

    if bbox:
        x1, y1, x2, y2 = [int(v) for v in bbox]
        color = (0, 80, 255) if "crowd" in label.lower() else (0, 0, 255)
        cv2.rectangle(out, (x1, y1), (x2, y2), color, 2)
        cv2.putText(
            out,
            f"{label} {confidence:.0%}",
            (x1, max(20, y1 - 8)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            color,
            2,
        )

    ts_display = seconds_to_timestamp(timestamp_seconds)
    cv2.rectangle(out, (0, h - 36), (w, h), (2, 8, 20), -1)
    cv2.putText(out, f"{label} | {ts_display} | {confidence:.0%}", (8, h - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 220, 255), 1)

    m, s = divmod(int(timestamp_seconds), 60)
    fname = f"{_slug(label)}_{m:02d}_{s:02d}.jpg"
    shot_id = str(uuid.uuid4())[:8]
    path = settings.screenshots_dir / upload_id / fname
    path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(path), out, [cv2.IMWRITE_JPEG_QUALITY, 88])

    severity = severity_for_threat(label, confidence)
    return ScreenshotEvidence(
        id=shot_id,
        filename=fname,
        url=f"/api/files/screenshots/{upload_id}/{fname}",
        timestamp=ts_display,
        timestamp_seconds=timestamp_seconds,
        label=label,
        confidence=confidence,
        severity=severity,
    )
