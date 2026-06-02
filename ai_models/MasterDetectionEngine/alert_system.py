"""Generate alerts from high-priority detections."""

from __future__ import annotations

from dataclasses import dataclass

from ai_models.MasterDetectionEngine.inference import UnifiedDetection
from ai_models.MasterDetectionEngine.threat_analyzer import priority_for


@dataclass
class Alert:
    level: str
    title: str
    message: str
    timestamp_seconds: float
    class_name: str
    confidence: float


def generate_alerts(detections: list[UnifiedDetection], min_conf: float = 0.5) -> list[Alert]:
    alerts: list[Alert] = []
    seen: set[tuple[str, int]] = set()

    for d in detections:
        if d.confidence < min_conf:
            continue
        pri = priority_for(d.class_name)
        if pri not in ("critical", "high", "medium"):
            continue
        bucket = int(d.timestamp_seconds // 2)
        key = (d.class_name, bucket)
        if key in seen:
            continue
        seen.add(key)

        level = "CRITICAL" if pri == "critical" else "HIGH" if pri == "high" else "WARNING"
        alerts.append(
            Alert(
                level=level,
                title=f"{d.class_name} detected",
                message=f"{d.class_name} ({d.source_model}) at {d.timestamp_seconds:.1f}s",
                timestamp_seconds=d.timestamp_seconds,
                class_name=d.class_name,
                confidence=d.confidence,
            )
        )
    alerts.sort(key=lambda a: a.timestamp_seconds)
    return alerts
