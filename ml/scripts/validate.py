#!/usr/bin/env python3
"""Validate model and export metrics (mAP, PR, F1, confusion matrix)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from ultralytics import YOLO

from drishti_ml.constants import MODELS_DIR, PREPARED_DIR, REPORTS_DIR, RUNS_DIR


def main() -> None:
    weights = MODELS_DIR / "best.pt"
    if not weights.exists():
        weights = RUNS_DIR / "train" / "weights" / "best.pt"

    if not weights.exists():
        print("No weights found — train first")
        sys.exit(1)

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    data_yaml = PREPARED_DIR / "data.yaml"
    model = YOLO(str(weights))

    metrics = model.val(data=str(data_yaml), split="test", plots=True, save_json=True)
    report = {
        "mAP50": float(metrics.box.map50),
        "mAP50_95": float(metrics.box.map),
        "precision": float(metrics.box.mp),
        "recall": float(metrics.box.mr),
        "f1": float(2 * metrics.box.mp * metrics.box.mr / (metrics.box.mp + metrics.box.mr + 1e-9)),
    }
    (REPORTS_DIR / "metrics.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    print(f"Plots saved under {REPORTS_DIR}")
    print("Next: python scripts/export.py")


if __name__ == "__main__":
    main()
