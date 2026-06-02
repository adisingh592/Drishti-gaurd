"""Lazy-load YOLO weights per logical model without duplicating GPU memory."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

from ai_models.paths import (
    MODEL_A_ROOT,
    MODEL_B_ROOT,
    MODEL_C_ROOT,
    MODEL_D_ROOT,
    PHASE1_WEIGHTS_SOURCE,
)

_yolo_cache: dict[str, Any] = {}


def resolve_weights_path(model_root: Path, fallback: Path | None = None) -> Optional[Path]:
    best = model_root / "weights" / "best.pt"
    if best.exists():
        return best
    if fallback and fallback.exists():
        return fallback
    return None


class ModelLoader:
    """Load Model A–D; share one YOLO instance when paths point to the same file."""

    def __init__(self, device: str = "cuda", conf: float = 0.45) -> None:
        self.device = device
        self.conf = conf
        self._phase1 = PHASE1_WEIGHTS_SOURCE

    def _get_yolo(self, path: Path) -> Any:
        key = str(path.resolve())
        if key in _yolo_cache:
            return _yolo_cache[key]
        from ultralytics import YOLO

        model = YOLO(str(path))
        model.to(self.device)
        _yolo_cache[key] = model
        return model

    @property
    def model_a_path(self) -> Optional[Path]:
        return resolve_weights_path(MODEL_A_ROOT, self._phase1)

    @property
    def model_b_path(self) -> Optional[Path]:
        p = resolve_weights_path(MODEL_B_ROOT)
        return p

    @property
    def model_c_path(self) -> Optional[Path]:
        p = resolve_weights_path(MODEL_C_ROOT)
        if p:
            return p
        return None

    @property
    def model_d_path(self) -> Optional[Path]:
        p = resolve_weights_path(MODEL_D_ROOT)
        if not p:
            return self.model_a_path
        if self.model_a_path and p.resolve() == self.model_a_path.resolve():
            return p
        return p

    def load_a(self) -> Optional[Any]:
        p = self.model_a_path
        return self._get_yolo(p) if p else None

    def load_b(self) -> Optional[Any]:
        p = self.model_b_path
        return self._get_yolo(p) if p else None

    def load_c(self) -> Optional[Any]:
        p = self.model_c_path
        if p and self.model_b_path and p.resolve() == self.model_b_path.resolve():
            return None
        return self._get_yolo(p) if p else None

    def load_d(self) -> Optional[Any]:
        p = self.model_d_path
        return self._get_yolo(p) if p else None

    def status(self) -> dict[str, str]:
        return {
            "model_a": "ready" if self.model_a_path else "missing",
            "model_b": "ready" if self.model_b_path else "heuristic",
            "model_c": "ready" if self.model_c_path and not self.model_b_path else (
                "shared_a" if self.model_a_path else "heuristic"
            ),
            "model_d": "ready" if self.model_d_path else "missing",
            "phase1_source": str(self._phase1),
            "weapon_scan": "yolo_world_required",
        }
