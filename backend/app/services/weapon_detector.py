from __future__ import annotations

from pathlib import Path
from typing import Optional

import numpy as np

from app.config import get_settings
from app.services.detection_classes import map_class_name
from app.services.yolo_detector import FrameDetection

WEAPON_PROMPTS = [
    "gun",
    "handgun",
    "pistol",
    "rifle",
    "firearm",
    "weapon",
    "knife",
    "shotgun",
]

# Map open-vocab labels -> Drishti taxonomy
WEAPON_LABEL_MAP = {
    "gun": "Gun",
    "handgun": "Pistol",
    "pistol": "Pistol",
    "rifle": "Rifle",
    "firearm": "Gun",
    "weapon": "Weapon",
    "knife": "Knife",
    "shotgun": "Rifle",
}


def _normalize_weapon_label(raw: str) -> str:
    key = raw.lower().strip()
    if key in WEAPON_LABEL_MAP:
        return WEAPON_LABEL_MAP[key]
    return map_class_name(raw)


class WeaponDetector:
    """Dedicated weapon scan — YOLO-World and/or custom weapon weights."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.model = None
        self.device = "cpu"
        self.mode = "none"
        self._load()

    def _resolve_device(self) -> str:
        import torch

        if self.settings.use_gpu and torch.cuda.is_available():
            return "cuda"
        if self.settings.use_gpu and getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
            return "mps"
        return "cpu"

    def _load(self) -> None:
        # Weapon scan always uses YOLO-World / custom weights (COCO yolo11n has no gun class).
        custom = self.settings.weapon_model_path.strip()
        if custom and Path(custom).exists():
            try:
                from ultralytics import YOLO

                self.device = self._resolve_device()
                self.model = YOLO(custom)
                self.model.to(self.device)
                self.mode = "custom"
                return
            except Exception:
                pass

        default_pt = self.settings.data_dir / "models" / "weapon.pt"
        if default_pt.exists():
            try:
                from ultralytics import YOLO

                self.device = self._resolve_device()
                self.model = YOLO(str(default_pt))
                self.model.to(self.device)
                self.mode = "custom"
                return
            except Exception:
                pass

        try:
            from ultralytics import YOLOWorld

            self.device = self._resolve_device()
            world_model = self.settings.weapon_world_model or "yolov8s-worldv2.pt"
            self.model = YOLOWorld(world_model)
            self.model.set_classes(WEAPON_PROMPTS)
            self.model.to(self.device)
            self.mode = "world"
        except Exception:
            self.model = None
            self.mode = "none"

    @property
    def is_active(self) -> bool:
        return self.mode != "none"

    def detect_batch(
        self,
        frames: list[np.ndarray],
        frame_numbers: list[int],
        fps: float,
        person_boxes: Optional[list[list[tuple[float, float, float, float]]]] = None,
    ) -> list[FrameDetection]:
        if not frames:
            return []

        detections: list[FrameDetection] = []
        conf = self.settings.weapon_confidence_threshold

        if self.mode == "simulation":
            return detections

        if self.model is None:
            return detections

        # Scan full frames
        detections.extend(self._infer_frames(frames, frame_numbers, fps, conf))

        # Extra pass: zoom into person regions (guns are small in CCTV frames)
        if person_boxes:
            for frame, fn, boxes in zip(frames, frame_numbers, person_boxes):
                h, w = frame.shape[:2]
                for box in boxes:
                    x1, y1, x2, y2 = [int(v) for v in box]
                    pad_x = int((x2 - x1) * 0.15)
                    pad_y = int((y2 - y1) * 0.1)
                    cx1 = max(0, x1 - pad_x)
                    cy1 = max(0, y1 - pad_y)
                    cx2 = min(w, x2 + pad_x)
                    cy2 = min(h, y2 + pad_y)
                    crop = frame[cy1:cy2, cx1:cx2]
                    if crop.size == 0:
                        continue
                    for det in self._infer_frames([crop], [fn], fps, max(0.15, conf - 0.1)):
                        # Map crop coords back to full frame
                        bx1, by1, bx2, by2 = det.bbox
                        det.bbox = (bx1 + cx1, by1 + cy1, bx2 + cx1, by2 + cy1)
                        det.confidence = min(0.99, det.confidence + 0.05)
                        detections.append(det)

        return detections

    def _infer_frames(
        self,
        frames: list[np.ndarray],
        frame_numbers: list[int],
        fps: float,
        conf: float,
    ) -> list[FrameDetection]:
        out: list[FrameDetection] = []
        results = self.model.predict(frames, conf=conf, verbose=False, device=self.device)
        for result, frame_num in zip(results, frame_numbers):
            ts = frame_num / fps if fps > 0 else 0
            if result.boxes is None:
                continue
            boxes = result.boxes
            names = result.names or {}
            for i in range(len(boxes)):
                cls_id = int(boxes.cls[i])
                raw = names.get(cls_id, str(cls_id))
                class_name = _normalize_weapon_label(str(raw))
                if class_name not in ("Gun", "Pistol", "Rifle", "Knife", "Weapon"):
                    continue
                xyxy = boxes.xyxy[i].cpu().numpy().tolist()
                out.append(
                    FrameDetection(
                        frame_number=frame_num,
                        timestamp_seconds=ts,
                        class_name=class_name,
                        confidence=float(boxes.conf[i]),
                        bbox=(xyxy[0], xyxy[1], xyxy[2], xyxy[3]),
                    )
                )
        return out
