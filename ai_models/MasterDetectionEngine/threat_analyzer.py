"""Threat scoring and priority from merged detections."""

from __future__ import annotations

from ai_models.MasterDetectionEngine.class_maps import RISK_LEVELS, THREAT_PRIORITY
from ai_models.MasterDetectionEngine.inference import UnifiedDetection


def priority_for(class_name: str) -> str:
    return THREAT_PRIORITY.get(class_name, THREAT_PRIORITY.get(class_name.replace(" ", "_"), "low"))


def aggregate_threat_score(detections: list[UnifiedDetection]) -> tuple[int, str]:
    """Return numeric score 0–100 and risk label."""
    weights = {
        "critical": 80,
        "high": 50,
        "medium": 25,
        "low": 10,
    }
    raw = 0.0
    max_pri = "low"
    pri_rank = {"low": 0, "medium": 1, "high": 2, "critical": 3}

    for d in detections:
        pri = priority_for(d.class_name)
        if pri_rank.get(pri, 0) > pri_rank.get(max_pri, 0):
            max_pri = pri
        raw += weights.get(pri, 10) * d.confidence

    score = min(100, int(raw * 0.4 + min(len(detections), 20) * 2))
    if score <= 25:
        level = RISK_LEVELS[0]
    elif score <= 50:
        level = RISK_LEVELS[1]
    elif score <= 75:
        level = RISK_LEVELS[2]
    else:
        level = RISK_LEVELS[3]
    return score, level


def detection_summary_counts(detections: list[UnifiedDetection]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for d in detections:
        counts[d.class_name] = counts.get(d.class_name, 0) + 1
    return counts
