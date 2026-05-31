from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np

from app.config import get_settings
from app.services.detection_classes import map_class_name


@dataclass
class FrameDetection:
    frame_number: int
    timestamp_seconds: float
    class_name: str
    confidence: float
    bbox: tuple[float, float, float, float]
    track_id: Optional[int] = None


class YOLODetector:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.model = None
        self.device = "cpu"
        self._load_model()

    def _resolve_device(self) -> str:
        import torch

        if self.settings.use_gpu and torch.cuda.is_available():
            return "cuda"
        if self.settings.use_gpu and getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
            return "mps"
        return "cpu"

    def _load_model(self) -> None:
        if self.settings.simulation_mode:
            self.model = None
            self._load_error = "simulation_mode"
            return
        try:
            from ultralytics import YOLO

            self.device = self._resolve_device()
            model_path = self.settings.custom_model_path or self.settings.yolo_model
            self.model = YOLO(model_path)
            self.model.to(self.device)
        except Exception as exc:
            self.model = None
            self._load_error = str(exc)

    @property
    def is_ready(self) -> bool:
        return self.model is not None

    def detect_batch(self, frames: list[np.ndarray], frame_numbers: list[int], fps: float) -> list[FrameDetection]:
        if not frames:
            return []

        if self.model is None:
            return self._simulate_batch(frames, frame_numbers, fps)

        conf = self.settings.confidence_threshold
        results = self.model.predict(
            frames,
            conf=conf,
            verbose=False,
            device=self.device,
        )

        detections: list[FrameDetection] = []
        for result, frame_num in zip(results, frame_numbers):
            ts = frame_num / fps if fps > 0 else 0
            if result.boxes is None:
                continue
            boxes = result.boxes
            names = result.names or {}
            for i in range(len(boxes)):
                cls_id = int(boxes.cls[i])
                raw_name = names.get(cls_id, str(cls_id))
                class_name = map_class_name(raw_name)
                xyxy = boxes.xyxy[i].cpu().numpy().tolist()
                track_id = None
                if boxes.id is not None:
                    track_id = int(boxes.id[i])
                detections.append(
                    FrameDetection(
                        frame_number=frame_num,
                        timestamp_seconds=ts,
                        class_name=class_name,
                        confidence=float(boxes.conf[i]),
                        bbox=(xyxy[0], xyxy[1], xyxy[2], xyxy[3]),
                        track_id=track_id,
                    )
                )
        return detections

    def detect_with_tracking(self, frame: np.ndarray, frame_number: int, fps: float) -> list[FrameDetection]:
        if self.model is None:
            return self._simulate_batch([frame], [frame_number], fps)

        conf = self.settings.confidence_threshold
        results = self.model.track(
            frame,
            persist=True,
            conf=conf,
            verbose=False,
            device=self.device,
            tracker="bytetrack.yaml",
        )
        detections: list[FrameDetection] = []
        ts = frame_number / fps if fps > 0 else 0
        for result in results:
            if result.boxes is None:
                continue
            boxes = result.boxes
            names = result.names or {}
            for i in range(len(boxes)):
                cls_id = int(boxes.cls[i])
                raw_name = names.get(cls_id, str(cls_id))
                class_name = map_class_name(raw_name)
                xyxy = boxes.xyxy[i].cpu().numpy().tolist()
                track_id = int(boxes.id[i]) if boxes.id is not None else None
                detections.append(
                    FrameDetection(
                        frame_number=frame_num,
                        timestamp_seconds=ts,
                        class_name=class_name,
                        confidence=float(boxes.conf[i]),
                        bbox=(xyxy[0], xyxy[1], xyxy[2], xyxy[3]),
                        track_id=track_id,
                    )
                )
        return detections

    def _simulate_batch(
        self, frames: list[np.ndarray], frame_numbers: list[int], fps: float
    ) -> list[FrameDetection]:
        """Deterministic demo detections when YOLO unavailable."""
        detections: list[FrameDetection] = []
        h, w = frames[0].shape[:2]
        for frame_num in frame_numbers:
            ts = frame_num / fps if fps > 0 else 0
            t = ts % 120
            if 8 < t < 12:
                detections.append(
                    FrameDetection(frame_num, ts, "Person", 0.91, (w * 0.3, h * 0.2, w * 0.45, h * 0.85))
                )
            if 42 < t < 46:
                detections.append(
                    FrameDetection(frame_num, ts, "Gun", 0.94, (w * 0.55, h * 0.35, w * 0.62, h * 0.55))
                )
                detections.append(
                    FrameDetection(frame_num, ts, "Person", 0.88, (w * 0.5, h * 0.25, w * 0.7, h * 0.9))
                )
            if 75 < t < 90:
                for j in range(8):
                    ox = (j % 4) * (w * 0.12) + w * 0.1
                    oy = (j // 4) * (h * 0.15) + h * 0.2
                    detections.append(
                        FrameDetection(
                            frame_num, ts, "Person", 0.82 + j * 0.01,
                            (ox, oy, ox + w * 0.08, oy + h * 0.2),
                        )
                    )
            if 100 < t < 110:
                detections.append(
                    FrameDetection(frame_num, ts, "Car", 0.89, (w * 0.2, h * 0.6, w * 0.5, h * 0.85), track_id=7)
                )
        return detections
