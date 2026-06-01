"""ByteTrack + DeepSORT tracking via supervision."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

import numpy as np

TrackerMode = Literal["bytetrack", "deepsort"]


@dataclass
class Track:
    track_id: int
    class_id: int
    class_name: str
    bbox: tuple[float, float, float, float]
    confidence: float


class MultiTracker:
    def __init__(self, mode: TrackerMode = "bytetrack") -> None:
        self.mode = mode
        self._tracker = None
        self._init()

    def _init(self) -> None:
        import supervision as sv

        if self.mode == "deepsort":
            self._tracker = sv.DeepSORTTracker()
        else:
            self._tracker = sv.ByteTrack()

    def update(
        self,
        detections_xyxy: np.ndarray,
        confidences: np.ndarray,
        class_ids: np.ndarray,
        class_names: list[str],
    ) -> list[Track]:
        import supervision as sv

        if len(detections_xyxy) == 0:
            return []

        dets = sv.Detections(
            xyxy=detections_xyxy,
            confidence=confidences,
            class_id=class_ids,
        )
        tracked = self._tracker.update_with_detections(dets)
        out: list[Track] = []
        if tracked.tracker_id is None:
            return out
        for i in range(len(tracked)):
            tid = tracked.tracker_id[i]
            if tid is None:
                continue
            cid = int(tracked.class_id[i]) if tracked.class_id is not None else 0
            cname = class_names[cid] if cid < len(class_names) else str(cid)
            box = tracked.xyxy[i]
            out.append(
                Track(
                    int(tid),
                    cid,
                    cname,
                    (float(box[0]), float(box[1]), float(box[2]), float(box[3])),
                    float(tracked.confidence[i]) if tracked.confidence is not None else 0.0,
                )
            )
        return out
