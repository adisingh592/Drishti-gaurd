"""Incident summary for upload analysis."""

from __future__ import annotations

from ai_models.MasterDetectionEngine.alert_system import Alert
from ai_models.MasterDetectionEngine.inference import UnifiedDetection
from ai_models.MasterDetectionEngine.threat_analyzer import aggregate_threat_score, detection_summary_counts


def generate_incident_report(
    detections: list[UnifiedDetection],
    alerts: list[Alert],
    models_status: dict[str, str],
) -> dict:
    score, risk_level = aggregate_threat_score(detections)
    counts = detection_summary_counts(detections)

    security = sum(counts.get(k, 0) for k in ("Person", "Handgun", "Knife", "Vehicle", "Bus", "Truck", "Motorcycle"))
    crowd = sum(counts.get(k, 0) for k in ("Crowd", "Dense_Crowd", "Overcrowding", "Fighting", "Violence"))
    safety = sum(counts.get(k, 0) for k in ("Fire", "Smoke", "Mask", "No_Mask"))
    traffic = sum(counts.get(k, 0) for k in ("Rash_Driving", "Wrong_Direction", "Accident", "Vehicle"))

    return {
        "threat_level": risk_level,
        "threat_score": score,
        "incident_summary": _build_summary(counts, alerts, risk_level),
        "object_counts": counts,
        "statistics": {
            "security": security,
            "crowd": crowd,
            "traffic": traffic,
            "safety": safety,
        },
        "models_loaded": models_status,
        "alert_count": len(alerts),
    }


def _build_summary(counts: dict[str, int], alerts: list[Alert], risk_level: str) -> str:
    parts = [f"Overall assessment: {risk_level}."]
    if not counts:
        parts.append("No significant objects detected in sampled frames.")
        return " ".join(parts)
    top = sorted(counts.items(), key=lambda x: -x[1])[:5]
    parts.append("Top detections: " + ", ".join(f"{k} ({v})" for k, v in top) + ".")
    if alerts:
        crit = [a for a in alerts if a.level == "CRITICAL"]
        if crit:
            parts.append(f"{len(crit)} critical alert(s) require immediate review.")
    return " ".join(parts)
