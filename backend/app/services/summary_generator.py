from __future__ import annotations

from app.models.schemas import AnalysisSummary, CrowdStatistics, RiskScore, ThreatTimelineEvent
from app.utils.time_format import format_duration


def generate_summary(
    duration_seconds: float,
    frames_processed: int,
    timeline: list[ThreatTimelineEvent],
    crowd: CrowdStatistics,
    risk: RiskScore,
) -> AnalysisSummary:
    weapons = sum(1 for e in timeline if any(w in e.type.lower() for w in ("gun", "pistol", "rifle", "knife", "weapon")))
    masked = sum(1 for e in timeline if "masked" in e.type.lower())
    crowd_alerts = len(crowd.alerts) + sum(1 for e in timeline if "crowd" in e.type.lower())
    traffic = sum(
        1
        for e in timeline
        if any(
            t in e.type.lower()
            for t in ("rash", "overspeed", "zig", "wrong-side", "sudden", "driving")
        )
    )

    details = [
        f"Processed {frames_processed:,} frames across {format_duration(duration_seconds)} of footage.",
        f"Identified {len(timeline)} threat events on the timeline.",
        f"Peak crowd density: {crowd.max_count} persons ({crowd.current_level}).",
        risk.explanation,
    ]

    return AnalysisSummary(
        video_duration=format_duration(duration_seconds),
        frames_processed=frames_processed,
        threats_found=len(timeline),
        weapons=weapons,
        masked_persons=masked,
        crowd_alerts=crowd_alerts,
        traffic_violations=traffic,
        overall_threat_score=risk.numeric_score,
        threat_level=risk.risk_level,
        details=details,
    )
