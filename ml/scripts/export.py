#!/usr/bin/env python3
"""Export best.pt to ONNX and TorchScript."""

from __future__ import annotations

import sys
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from ultralytics import YOLO

from drishti_ml.constants import MODELS_DIR


def main() -> None:
    weights = MODELS_DIR / "best.pt"
    if not weights.exists():
        print("Missing best.pt")
        sys.exit(1)

    model = YOLO(str(weights))
    out = MODELS_DIR / "exports"
    out.mkdir(parents=True, exist_ok=True)

    model.export(format="onnx", imgsz=640, simplify=True, opset=12)
    model.export(format="torchscript", imgsz=640)

    for f in MODELS_DIR.glob("best.*"):
        if f.suffix in (".onnx", ".torchscript"):
            dest = out / f.name
            import shutil
            shutil.move(str(f), str(dest))
            print(f"Exported {dest}")

    print("Done.")


if __name__ == "__main__":
    main()
