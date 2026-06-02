#!/usr/bin/env python3
"""Train YOLOv11m on Drishti Phase 1 dataset (RTX 3050 optimized)."""

from __future__ import annotations

import sys
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from ultralytics import YOLO

from drishti_ml.constants import MODELS_DIR, PREPARED_DIR, RUNS_DIR
from drishti_ml.utils.io import load_yaml


def main() -> None:
    cfg = load_yaml(ML_ROOT / "config" / "phase1.yaml")
    t = cfg.get("training", {})
    data_yaml = PREPARED_DIR / "data.yaml"
    if not data_yaml.exists():
        print("Missing data.yaml — run prepare_all.py first")
        sys.exit(1)

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    RUNS_DIR.mkdir(parents=True, exist_ok=True)

    import os

    last = RUNS_DIR / "train" / "weights" / "last.pt"
    target_epochs = int(t.get("epochs", 100))
    results_csv = RUNS_DIR / "train" / "results.csv"
    done_epochs = 0
    if results_csv.exists():
        done_epochs = max(0, len(results_csv.read_text(encoding="utf-8").strip().splitlines()) - 1)

    resume = os.environ.get("PHASE1_RESUME", "").lower() in ("1", "true", "yes")
    if resume and last.exists() and done_epochs < target_epochs:
        print(f"Resuming from {last} (epoch {done_epochs}/{target_epochs})")
        model = YOLO(str(last))
    else:
        if last.exists() and done_epochs >= target_epochs:
            print("Training already complete — copying best.pt")
            import shutil
            best = RUNS_DIR / "train" / "weights" / "best.pt"
            if best.exists():
                shutil.copy2(best, MODELS_DIR / "best.pt")
            return
        model = YOLO(t.get("model", "yolo11m.pt"))
        resume = False

    try:
        results = model.train(
            resume=resume,
            data=str(data_yaml),
            epochs=int(t.get("epochs", 100)),
            imgsz=int(t.get("imgsz", 640)),
            batch=int(t.get("batch", 8)),
            amp=bool(t.get("amp", True)),
            cache=bool(t.get("cache", True)),
            device=t.get("device", 0),
            workers=int(t.get("workers", 4)),
            patience=int(t.get("patience", 25)),
            optimizer=t.get("optimizer", "AdamW"),
            cos_lr=bool(t.get("cos_lr", True)),
            project=str(RUNS_DIR),
            name="train",
            exist_ok=True,
        )
    except RuntimeError as exc:
        if "out of memory" in str(exc).lower() or "CUDA" in str(exc):
            print("OOM — retrying with batch=4")
            results = model.train(
                resume=resume,
                data=str(data_yaml),
                epochs=int(t.get("epochs", 100)),
                imgsz=int(t.get("imgsz", 640)),
                batch=4,
                amp=True,
                cache=True,
                device=t.get("device", 0),
                workers=2,
                project=str(RUNS_DIR),
                name="train",
                exist_ok=True,
            )
        else:
            raise

    best = Path(results.save_dir) / "weights" / "best.pt"
    if best.exists():
        dest = MODELS_DIR / "best.pt"
        import shutil
        shutil.copy2(best, dest)
        print(f"Best weights copied to {dest}")
    print("Next: python scripts/validate.py")


if __name__ == "__main__":
    main()
