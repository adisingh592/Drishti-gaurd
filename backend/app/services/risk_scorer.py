from __future__ import annotations

from app.models.schemas import RiskScore, ThreatTimelineEvent
from app.services.detection_classes import THREAT_WEIGHTS, risk_level_label


def calculate_risk_score(events: list[ThreatTimelineEvent]) -> RiskScore:
    breakdown: dict[str, int] = {}
    raw = 0.0

    for ev in events:
        weight = 0
        for key, w in THREAT_WEIGHTS.items():
            if key.lower() in ev.type.lower():
                weight = max(weight, w)
        if weight == 0:
            if ev.severity == "CRITICAL":
                weight = 45
            elif ev.severity == "HIGH":
                weight = 30
            else:
                weight = 15
        contribution = int(weight * ev.confidence)
        breakdown[ev.type] = breakdown.get(ev.type, 0) + contribution
        raw += contribution

    # Diminishing returns for many events
    score = min(100, int(raw * 0.65 + min(len(events) * 3, 25)))
    level = risk_level_label(score)

    parts = []
    if breakdown:
        top = sorted(breakdown.items(), key=lambda x: -x[1])[:4]
        parts.append("Primary contributors: " + ", ".join(f"{k} (+{v})" for k, v in top))
    parts.append(f"Overall threat score {score}/100 — classified as {level}.")
    if score <= 30:
        parts.append("No significant threats detected beyond baseline monitoring.")
    elif score <= 60:
        parts.append("Elevated activity warrants review of flagged timeline segments.")
    elif score <= 85:
        parts.append("Multiple high-severity indicators — immediate analyst review recommended.")
    else:
        parts.append("Critical threat profile — escalate per security protocol.")

    return RiskScore(
        numeric_score=score,
        risk_level=level,
        explanation=" ".join(parts),
        breakdown=breakdown,
    )
