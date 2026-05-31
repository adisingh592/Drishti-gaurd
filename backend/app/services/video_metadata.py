from __future__ import annotations

from pathlib import Path

import cv2

from app.models.schemas import VideoMetadata
from app.utils.time_format import human_file_size


def extract_video_metadata(upload_id: str, video_path: Path, file_name: str) -> VideoMetadata:
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)
    duration = frame_count / fps if fps > 0 else 0.0
    cap.release()

    file_size = video_path.stat().st_size
    return VideoMetadata(
        upload_id=upload_id,
        file_name=file_name,
        duration_seconds=round(duration, 2),
        fps=round(fps, 2),
        width=width,
        height=height,
        resolution=f"{width}x{height}",
        file_size_bytes=file_size,
        file_size_human=human_file_size(file_size),
        video_url=f"/api/files/videos/{upload_id}",
    )
