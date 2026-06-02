"""Master Detection Engine — orchestrates Models A–D without retraining Phase 1."""

from __future__ import annotations

from ai_models.MasterDetectionEngine.alert_system import Alert, generate_alerts
from ai_models.MasterDetectionEngine.inference import MasterInference, UnifiedDetection
from ai_models.MasterDetectionEngine.model_loader import ModelLoader
from ai_models.MasterDetectionEngine.report_generator import generate_incident_report
from ai_models.MasterDetectionEngine.threat_analyzer import aggregate_threat_score


class MasterDetectionEngine:
    def __init__(self, device: str = "cuda", conf: float = 0.45) -> None:
        self.loader = ModelLoader(device=device, conf=conf)
        self.inference = MasterInference(self.loader)

    def status(self) -> dict[str, str]:
        return self.loader.status()

    def detect_batch(
        self,
        frames,
        frame_numbers: list[int],
        fps: float,
    ) -> list[UnifiedDetection]:
        return self.inference.detect_batch(frames, frame_numbers, fps)

    def analyze(self, detections: list[UnifiedDetection]) -> dict:
        alerts = generate_alerts(detections)
        report = generate_incident_report(detections, alerts, self.status())
        score, level = aggregate_threat_score(detections)
        report["threat_score"] = score
        report["threat_level"] = level
        return {"detections": detections, "alerts": alerts, "report": report}
