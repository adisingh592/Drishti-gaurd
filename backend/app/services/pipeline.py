from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Callable, Optional

import cv2
import numpy as np

from app.config import get_settings
from app.models.schemas import (
    AnalysisResultResponse,
    AnalysisStatus,
    AnalysisSummary,
    CrowdStatistics,
    DetectionRecord,
    RiskScore,
    ScreenshotEvidence,
    ThreatTimelineEvent,
    VehicleStatistics,
    VideoMetadata,
)
from app.services import database
from app.services.crowd_analyzer import analyze_crowd
from app.services.risk_scorer import calculate_risk_score
from app.services.screenshot_generator import capture_screenshot
from app.services.summary_generator import generate_summary
from app.services.threat_engine import build_detection_records, generate_threat_events
from app.services.vehicle_tracker import analyze_vehicles
from app.services.yolo_detector import FrameDetection, YOLODetector

_detector: Optional[YOLODetector] = None


def get_detector() -> YOLODetector:
    global _detector
    if _detector is None:
        _detector = YOLODetector()
    return _detector


async def _update_progress(
    upload_id: str,
    progress: int,
    step: str,
    message: str,
    status: AnalysisStatus = AnalysisStatus.PROCESSING,
) -> None:
    await database.update_upload(
        upload_id,
        {
            "status": status.value,
            "progress": progress,
            "current_step": step,
            "message": message,
        },
    )


async def run_analysis_pipeline(
    upload_id: str,
    video_path: Path,
    metadata: VideoMetadata,
) -> AnalysisResultResponse:
    settings = get_settings()
    detector = get_detector()

    await _update_progress(upload_id, 5, "extract_frames", "Extracting frames from video")

    cap = cv2.VideoCapture(str(video_path))
    fps = metadata.fps or 25.0
    width = metadata.width
    height = metadata.height
    sample = max(1, settings.frame_sample_rate)
    batch_size = settings.batch_size

    all_detections: list[FrameDetection] = []
    frame_cache: dict[int, np.ndarray] = {}
    frame_numbers: list[int] = []
    frames_batch: list[np.ndarray] = []
    nums_batch: list[int] = []
    processed_frames = 0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    frame_idx = 0

    loop = asyncio.get_event_loop()

    def process_batch() -> list[FrameDetection]:
        return detector.detect_batch(frames_batch.copy(), nums_batch.copy(), fps)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % sample == 0:
            frame_cache[frame_idx] = frame.copy()
            frames_batch.append(frame)
            nums_batch.append(frame_idx)
            frame_numbers.append(frame_idx)
            if len(frames_batch) >= batch_size:
                dets = await loop.run_in_executor(None, process_batch)
                all_detections.extend(dets)
                processed_frames += len(frames_batch)
                pct = min(55, 5 + int(50 * processed_frames / max(total_frames // sample, 1)))
                await _update_progress(
                    upload_id, pct, "yolo_inference", f"YOLO inference — {processed_frames} frames"
                )
                frames_batch.clear()
                nums_batch.clear()
        frame_idx += 1

    if frames_batch:
        dets = await loop.run_in_executor(None, process_batch)
        all_detections.extend(dets)
        processed_frames += len(frames_batch)

    cap.release()
    await _update_progress(upload_id, 58, "tracking", "Running ByteTrack object tracking")

    # Second pass with tracking on threat-heavy segments
    cap = cv2.VideoCapture(str(video_path))
    tracked: list[FrameDetection] = []
    key_frames = sorted({d.frame_number for d in all_detections})[:120]
    for fn in key_frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, fn)
        ret, frame = cap.read()
        if ret:
            td = await loop.run_in_executor(None, lambda f=frame, n=fn: detector.detect_with_tracking(f, n, fps))
            tracked.extend(td)
            frame_cache[fn] = frame
    cap.release()
    all_detections.extend(tracked)

    await _update_progress(upload_id, 68, "threat_detection", "Generating threat events")
    crowd_stats = analyze_crowd(all_detections, fps)
    vehicle_stats, traffic_events = analyze_vehicles(all_detections, fps, width)
    timeline = generate_threat_events(all_detections, crowd_stats.alerts, traffic_events)

    await _update_progress(upload_id, 78, "screenshots", "Capturing evidence screenshots")
    screenshots: list[ScreenshotEvidence] = []
    shot_idx = 0
    for event in timeline:
        fn = int(event.timestamp_seconds * fps)
        frame = frame_cache.get(fn)
        if frame is None:
            cap = cv2.VideoCapture(str(video_path))
            cap.set(cv2.CAP_PROP_POS_FRAMES, fn)
            ret, frame = cap.read()
            cap.release()
            if not ret:
                continue
        det_bbox = None
        for d in all_detections:
            if abs(d.timestamp_seconds - event.timestamp_seconds) < 1.5 and (
                d.class_name.lower() in event.type.lower() or event.type.lower() in d.class_name.lower()
            ):
                det_bbox = d.bbox
                break
        shot = capture_screenshot(
            frame, upload_id, event.type, event.timestamp_seconds, event.confidence, det_bbox, shot_idx
        )
        event.screenshot_url = shot.url
        screenshots.append(shot)
        shot_idx += 1
        if shot_idx % 5 == 0:
            await _update_progress(upload_id, 78 + min(12, shot_idx), "screenshots", f"Captured {shot_idx} screenshots")

    await _update_progress(upload_id, 92, "risk_scoring", "Calculating risk score")
    risk = calculate_risk_score(timeline)
    summary = generate_summary(
        metadata.duration_seconds,
        processed_frames,
        timeline,
        crowd_stats,
        risk,
    )
    detection_records = build_detection_records(all_detections[:500])

    result = AnalysisResultResponse(
        upload_id=upload_id,
        status=AnalysisStatus.COMPLETED,
        video_metadata=metadata,
        threat_timeline=timeline,
        screenshots=screenshots,
        detections=detection_records,
        crowd_statistics=crowd_stats,
        vehicle_statistics=vehicle_stats,
        risk_score=risk,
        summary=summary,
        progress=100,
    )

    await database.update_upload(
        upload_id,
        {
            "status": AnalysisStatus.COMPLETED.value,
            "progress": 100,
            "current_step": "complete",
            "message": "Analysis complete",
            "result": result.model_dump(),
        },
    )
    return result


async def run_analysis_background(upload_id: str) -> None:
    doc = await database.get_upload(upload_id)
    if not doc:
        return
    try:
        video_path = Path(doc["video_path"])
        from app.models.schemas import VideoMetadata

        metadata = VideoMetadata(**doc["metadata"])
        await run_analysis_pipeline(upload_id, video_path, metadata)
    except Exception as exc:
        await database.update_upload(
            upload_id,
            {
                "status": AnalysisStatus.FAILED.value,
                "progress": 0,
                "message": str(exc),
                "error": str(exc),
            },
        )
