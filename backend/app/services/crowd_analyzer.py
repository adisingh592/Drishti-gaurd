from __future__ import annotations

from collections import defaultdict

from app.models.schemas import CrowdDensityPoint, CrowdStatistics, ThreatTimelineEvent
from app.services.detection_classes import crowd_density_level, severity_for_threat
from app.services.yolo_detector import FrameDetection
from app.utils.time_format import seconds_to_timestamp


def analyze_crowd(
    detections: list[FrameDetection],
    fps: float,
) -> CrowdStatistics:
    by_frame: dict[int, list[FrameDetection]] = defaultdict(list)
    for d in detections:
        if d.class_name == "Person":
            by_frame[d.frame_number].append(d)

    timeline: list[CrowdDensityPoint] = []
    alerts: list[ThreatTimelineEvent] = []
    max_count = 0
    peak_ts = 0.0
    total = 0
    last_level = "SAFE"
    prev_warning = False
    prev_critical = False

    for frame_num in sorted(by_frame.keys()):
        count = len(by_frame[frame_num])
        ts = frame_num / fps if fps > 0 else 0
        level = crowd_density_level(count)
        timeline.append(
            CrowdDensityPoint(
                timestamp_seconds=ts,
                timestamp=seconds_to_timestamp(ts),
                count=count,
                level=level,
            )
        )
        total += count
        if count > max_count:
            max_count = count
            peak_ts = ts

        if level == "WARNING" and not prev_warning:
            alerts.append(
                ThreatTimelineEvent(
                    timestamp=seconds_to_timestamp(ts),
                    timestamp_seconds=ts,
                    type="Crowd Density Warning",
                    confidence=min(0.99, 0.7 + count / 200),
                    risk_level="WARNING",
                    severity=severity_for_threat("Crowd Density Warning", 0.9),
                )
            )
            prev_warning = True
        if level == "CRITICAL" and not prev_critical:
            alerts.append(
                ThreatTimelineEvent(
                    timestamp=seconds_to_timestamp(ts),
                    timestamp_seconds=ts,
                    type="Crowd Density Critical",
                    confidence=min(0.99, 0.75 + count / 300),
                    risk_level="CRITICAL",
                    severity="CRITICAL",
                )
            )
            prev_critical = True
        if level in ("SAFE", "MODERATE"):
            prev_warning = False
            prev_critical = False
        last_level = level

    avg = total / len(timeline) if timeline else 0.0
    return CrowdStatistics(
        max_count=max_count,
        average_count=round(avg, 1),
        peak_timestamp=seconds_to_timestamp(peak_ts),
        timeline=timeline,
        alerts=alerts,
        current_level=last_level,
    )
