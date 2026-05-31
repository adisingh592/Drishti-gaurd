from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


class AnalysisStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class RiskLevel(str, Enum):
    SAFE = "SAFE"
    WARNING = "WARNING"
    HIGH_ALERT = "HIGH ALERT"
    CRITICAL = "CRITICAL"


class Severity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class VideoMetadata(BaseModel):
    upload_id: str
    file_name: str
    duration_seconds: float
    fps: float
    width: int
    height: int
    resolution: str
    file_size_bytes: int
    file_size_human: str
    video_url: str


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class DetectionRecord(BaseModel):
    detection_type: str
    timestamp_seconds: float
    timestamp_display: str
    frame_number: int
    confidence: float
    bbox: BoundingBox
    track_id: Optional[int] = None


class ThreatTimelineEvent(BaseModel):
    timestamp: str
    timestamp_seconds: float
    type: str
    confidence: float
    screenshot_url: Optional[str] = None
    risk_level: str
    severity: str


class ScreenshotEvidence(BaseModel):
    id: str
    filename: str
    url: str
    timestamp: str
    timestamp_seconds: float
    label: str
    confidence: float
    severity: str


class CrowdDensityPoint(BaseModel):
    timestamp_seconds: float
    timestamp: str
    count: int
    level: str


class CrowdStatistics(BaseModel):
    max_count: int
    average_count: float
    peak_timestamp: str
    timeline: list[CrowdDensityPoint]
    alerts: list[ThreatTimelineEvent]
    current_level: str


class VehicleTrackPoint(BaseModel):
    timestamp_seconds: float
    x: float
    y: float


class VehicleStatistics(BaseModel):
    vehicle_id: int
    vehicle_type: str
    path: list[VehicleTrackPoint]
    direction: str
    average_speed_px: float
    max_speed_px: float
    events: list[ThreatTimelineEvent]


class RiskScore(BaseModel):
    numeric_score: int
    risk_level: str
    explanation: str
    breakdown: dict[str, int] = Field(default_factory=dict)


class AnalysisSummary(BaseModel):
    title: str = "Analysis Complete"
    video_duration: str
    frames_processed: int
    threats_found: int
    weapons: int
    masked_persons: int
    crowd_alerts: int
    traffic_violations: int
    overall_threat_score: int
    threat_level: str
    details: list[str] = Field(default_factory=list)


class AnalysisProgress(BaseModel):
    upload_id: str
    status: AnalysisStatus
    progress: int
    current_step: str
    message: str
    error: Optional[str] = None


class UploadResponse(BaseModel):
    upload_id: str
    message: str
    metadata: VideoMetadata


class AnalysisResultResponse(BaseModel):
    upload_id: str
    status: AnalysisStatus
    video_metadata: VideoMetadata
    threat_timeline: list[ThreatTimelineEvent]
    screenshots: list[ScreenshotEvidence]
    detections: list[DetectionRecord]
    crowd_statistics: CrowdStatistics
    vehicle_statistics: list[VehicleStatistics]
    risk_score: RiskScore
    summary: AnalysisSummary
    progress: int = 100


class AnalyzeStartResponse(BaseModel):
    upload_id: str
    status: AnalysisStatus
    message: str
