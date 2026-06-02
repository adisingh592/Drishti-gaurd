"""Run Model A–D inference and merge detections."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np

from ai_models.MasterDetectionEngine.class_maps import MODEL_A_IDS, MODEL_C_IDS, MODEL_D_IDS
from ai_models.MasterDetectionEngine.model_loader import ModelLoader


@dataclass
class UnifiedDetection:
    frame_number: int
    timestamp_seconds: float
    class_name: str
    confidence: float
    bbox: tuple[float, float, float, float]
    source_model: str
    track_id: Optional[int] = None


class MasterInference:
    def __init__(self, loader: ModelLoader) -> None:
        self.loader = loader

    def _filter_result(
        self,
        result,
        frame_num: int,
        fps: float,
        allowed: dict[int, str],
        source: str,
    ) -> list[UnifiedDetection]:
        out: list[UnifiedDetection] = []
        ts = frame_num / fps if fps > 0 else 0.0
        if result.boxes is None:
            return out
        for i in range(len(result.boxes)):
            cid = int(result.boxes.cls[i].item())
            if cid not in allowed:
                continue
            conf = float(result.boxes.conf[i].item())
            xyxy = result.boxes.xyxy[i].tolist()
            out.append(
                UnifiedDetection(
                    frame_number=frame_num,
                    timestamp_seconds=ts,
                    class_name=allowed[cid],
                    confidence=conf,
                    bbox=(xyxy[0], xyxy[1], xyxy[2], xyxy[3]),
                    source_model=source,
                )
            )
        return out

    def _predict_batch(self, model, frames: list[np.ndarray]):
        return model.predict(
            frames,
            conf=self.loader.conf,
            verbose=False,
            device=self.loader.device,
        )

    def _heuristic_crowd(self, person_count: int, frame_num: int, fps: float) -> list[UnifiedDetection]:
        if person_count <= 20:
            return []
        ts = frame_num / fps if fps > 0 else 0.0
        if person_count > 100:
            label, conf = "Overcrowding", 0.85
        elif person_count > 50:
            label, conf = "Dense_Crowd", 0.75
        else:
            label, conf = "Crowd", 0.65
        return [
            UnifiedDetection(
                frame_number=frame_num,
                timestamp_seconds=ts,
                class_name=label,
                confidence=conf,
                bbox=(0.0, 0.0, 0.0, 0.0),
                source_model="Model_B_heuristic",
            )
        ]

    def detect_batch(
        self,
        frames: list[np.ndarray],
        frame_numbers: list[int],
        fps: float,
    ) -> list[UnifiedDetection]:
        if not frames:
            return []

        merged: list[UnifiedDetection] = []
        model_a = self.loader.load_a()
        if model_a is None:
            return merged

        a_path = self.loader.model_a_path
        d_path = self.loader.model_d_path
        same_ad = (
            a_path is not None
            and d_path is not None
            and a_path.resolve() == d_path.resolve()
        )

        # One GPU forward pass for shared Phase 1 weights (A + D filters)
        results = self._predict_batch(model_a, frames)
        for result, fn in zip(results, frame_numbers):
            merged.extend(self._filter_result(result, fn, fps, MODEL_A_IDS, "Model_A_SecurityThreats"))
            if same_ad:
                merged.extend(self._filter_result(result, fn, fps, MODEL_D_IDS, "Model_D_SafetyMonitoring"))

        if not same_ad and d_path:
            model_d = self.loader.load_d()
            if model_d is not None and model_d is not model_a:
                d_results = self._predict_batch(model_d, frames)
                for result, fn in zip(d_results, frame_numbers):
                    merged.extend(
                        self._filter_result(result, fn, fps, MODEL_D_IDS, "Model_D_SafetyMonitoring")
                    )

        c_path = self.loader.model_c_path
        if c_path and a_path and c_path.resolve() != a_path.resolve():
            model_c = self.loader.load_c()
            if model_c is not None:
                c_results = self._predict_batch(model_c, frames)
                for result, fn in zip(c_results, frame_numbers):
                    merged.extend(
                        self._filter_result(result, fn, fps, MODEL_C_IDS, "Model_C_TrafficMonitoring")
                    )

        if self.loader.model_b_path:
            model_b = self.loader.load_b()
            if model_b is not None and model_b is not model_a:
                b_results = self._predict_batch(model_b, frames)
                for result, fn in zip(b_results, frame_numbers):
                    merged.extend(
                        self._filter_result(result, fn, fps, {0: "Crowd"}, "Model_B_CrowdBehavior")
                    )
        else:
            persons: dict[int, int] = {}
            for d in merged:
                if d.class_name == "Person":
                    persons[d.frame_number] = persons.get(d.frame_number, 0) + 1
            for fn, n in persons.items():
                merged.extend(self._heuristic_crowd(n, fn, fps))

        return merged
