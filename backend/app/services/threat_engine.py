from __future__ import annotations

from app.models.schemas import DetectionRecord, ThreatTimelineEvent
from app.services.detection_classes import (
    WEAPON_CLASSES,
    severity_for_threat,
)
from app.services.yolo_detector import FrameDetection
from app.utils.time_format import seconds_to_timestamp
from app.models.schemas import BoundingBox


def build_detection_records(detections: list[FrameDetection]) -> list[DetectionRecord]:
    records: list[DetectionRecord] = []
    for d in detections:
        records.append(
            DetectionRecord(
                detection_type=d.class_name,
                timestamp_seconds=d.timestamp_seconds,
                timestamp_display=seconds_to_timestamp(d.timestamp_seconds),
                frame_number=d.frame_number,
                confidence=round(d.confidence, 4),
                bbox=BoundingBox(x1=d.bbox[0], y1=d.bbox[1], x2=d.bbox[2], y2=d.bbox[3]),
                track_id=d.track_id,
            )
        )
    return records


def generate_threat_events(
    detections: list[FrameDetection],
    crowd_alerts: list[ThreatTimelineEvent],
    traffic_events: list[ThreatTimelineEvent],
) -> list[ThreatTimelineEvent]:
    events: list[ThreatTimelineEvent] = []
    seen: set[tuple[str, int]] = set()

    threat_classes = WEAPON_CLASSES | {"masked person", "abandoned object", "knife", "gun", "pistol", "rifle"}

    for d in detections:
        cls_lower = d.class_name.lower()
        is_threat = any(t in cls_lower for t in threat_classes) or d.class_name in (
            "Gun", "Pistol", "Rifle", "Knife", "Masked Person", "Abandoned Object", "Weapon"
        )
        if not is_threat:
            continue
        bucket = int(d.timestamp_seconds // 2)
        key = (d.class_name, bucket)
        if key in seen:
            continue
        seen.add(key)

        label = d.class_name if d.class_name != "Knife" else "Weapon"
        if d.class_name in ("Gun", "Pistol", "Rifle"):
            label = "Weapon"

        sev = severity_for_threat(d.class_name, d.confidence)
        events.append(
            ThreatTimelineEvent(
                timestamp=seconds_to_timestamp(d.timestamp_seconds),
                timestamp_seconds=d.timestamp_seconds,
                type=label if label != "Knife" else "Knife",
                confidence=round(d.confidence, 2),
                risk_level="CRITICAL" if sev == "CRITICAL" else "HIGH" if sev == "HIGH" else "WARNING",
                severity=sev,
            )
        )

    events.extend(crowd_alerts)
    events.extend(traffic_events)
    events.sort(key=lambda e: e.timestamp_seconds)

    # Deduplicate near-identical traffic + weapon at same second
    unique: list[ThreatTimelineEvent] = []
    used_ts: set[tuple[str, int]] = set()
    for e in events:
        k = (e.type, int(e.timestamp_seconds))
        if k in used_ts:
            continue
        used_ts.add(k)
        unique.append(e)
    return unique
