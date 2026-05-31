from __future__ import annotations

import math
from collections import defaultdict

from app.models.schemas import ThreatTimelineEvent, VehicleStatistics, VehicleTrackPoint
from app.services.detection_classes import VEHICLE_CLASSES, severity_for_threat
from app.services.yolo_detector import FrameDetection
from app.utils.time_format import seconds_to_timestamp


def _center(bbox: tuple[float, float, float, float]) -> tuple[float, float]:
    x1, y1, x2, y2 = bbox
    return ((x1 + x2) / 2, (y1 + y2) / 2)


def _speed(p1: tuple[float, float], p2: tuple[float, float], dt: float) -> float:
    if dt <= 0:
        return 0.0
    return math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / dt


def analyze_vehicles(
    detections: list[FrameDetection],
    fps: float,
    frame_width: int,
) -> tuple[list[VehicleStatistics], list[ThreatTimelineEvent]]:
    vehicle_dets = [d for d in detections if d.class_name.lower() in VEHICLE_CLASSES or d.class_name in ("Car", "Bike", "Truck", "Bus")]
    by_track: dict[int, list[FrameDetection]] = defaultdict(list)

    for d in vehicle_dets:
        tid = d.track_id if d.track_id is not None else hash((d.frame_number, d.bbox)) % 10000
        by_track[tid].append(d)

    stats: list[VehicleStatistics] = []
    traffic_events: list[ThreatTimelineEvent] = []

    for vid, track in sorted(by_track.items()):
        track.sort(key=lambda x: x.frame_number)
        path: list[VehicleTrackPoint] = []
        speeds: list[float] = []
        headings: list[float] = []

        for i, det in enumerate(track):
            cx, cy = _center(det.bbox)
            path.append(VehicleTrackPoint(timestamp_seconds=det.timestamp_seconds, x=cx, y=cy))
            if i > 0:
                prev = track[i - 1]
                dt = (det.frame_number - prev.frame_number) / fps if fps > 0 else 0.033
                p1 = _center(prev.bbox)
                p2 = (cx, cy)
                sp = _speed(p1, p2, dt)
                speeds.append(sp)
                headings.append(math.atan2(p2[1] - p1[1], p2[0] - p1[0]))

        avg_speed = sum(speeds) / len(speeds) if speeds else 0.0
        max_speed = max(speeds) if speeds else 0.0
        direction = "east"
        if len(headings) >= 2:
            direction = "north" if abs(headings[-1]) > 1.2 else "east"

        events: list[ThreatTimelineEvent] = []
        vtype = track[0].class_name

        # Rash driving heuristics
        if max_speed > frame_width * 0.35:
            ts = track[-1].timestamp_seconds
            events.append(
                ThreatTimelineEvent(
                    timestamp=seconds_to_timestamp(ts),
                    timestamp_seconds=ts,
                    type="Overspeeding",
                    confidence=min(0.98, 0.6 + max_speed / (frame_width * 0.5)),
                    risk_level="HIGH",
                    severity=severity_for_threat("Overspeeding", 0.9),
                )
            )
            traffic_events.append(events[-1])

        if len(headings) >= 5:
            deltas = [abs(headings[i] - headings[i - 1]) for i in range(1, len(headings))]
            zigzag = sum(1 for d in deltas if d > 0.8)
            if zigzag >= 3:
                ts = track[len(track) // 2].timestamp_seconds
                ev = ThreatTimelineEvent(
                    timestamp=seconds_to_timestamp(ts),
                    timestamp_seconds=ts,
                    type="Zig-Zag Driving",
                    confidence=0.87,
                    risk_level="HIGH",
                    severity="HIGH",
                )
                events.append(ev)
                traffic_events.append(ev)

            sudden = max(deltas) if deltas else 0
            if sudden > 1.4:
                ts = track[len(track) // 2].timestamp_seconds
                ev = ThreatTimelineEvent(
                    timestamp=seconds_to_timestamp(ts),
                    timestamp_seconds=ts,
                    type="Sudden Direction Change",
                    confidence=0.84,
                    risk_level="WARNING",
                    severity="MEDIUM",
                )
                events.append(ev)
                traffic_events.append(ev)

        # Wrong-side: sustained movement against dominant flow (left half moving right-fast)
        if path and path[0].x > frame_width * 0.55 and path[-1].x < frame_width * 0.45:
            ts = path[-1].timestamp_seconds
            ev = ThreatTimelineEvent(
                timestamp=seconds_to_timestamp(ts),
                timestamp_seconds=ts,
                type="Wrong-Side Driving",
                confidence=0.86,
                risk_level="HIGH",
                severity="HIGH",
            )
            events.append(ev)
            traffic_events.append(ev)

        stats.append(
            VehicleStatistics(
                vehicle_id=vid,
                vehicle_type=vtype,
                path=path,
                direction=direction,
                average_speed_px=round(avg_speed, 2),
                max_speed_px=round(max_speed, 2),
                events=events,
            )
        )

    return stats, traffic_events
