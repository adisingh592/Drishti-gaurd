#!/usr/bin/env python3
"""Report Phase 1 dataset download and training status."""

from __future__ import annotations

import sys
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from drishti_ml.budget import dir_size, human_size
from drishti_ml.constants import PREPARED_DIR, RAW_DIR, RUNS_DIR
from drishti_ml.utils.io import load_yaml


def count_images(folder: Path) -> int:
    if not folder.exists():
        return 0
    exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
    return sum(1 for p in folder.rglob("*") if p.suffix.lower() in exts)


def main() -> None:
    cfg = load_yaml(ML_ROOT / "config" / "phase1.yaml")
    print("=" * 60)
    print("Phase 1 audit")
    print("=" * 60)

    for key, ds in (cfg.get("datasets") or {}).items():
        en = ds.get("enabled", True)
        raw = RAW_DIR / key.replace("sohas_weapon", "sohas_weapon")
        if key == "sohas_weapon":
            raw = RAW_DIR / "sohas_weapon"
        n = count_images(raw) if raw.exists() else 0
        status = "OK" if n >= 50 else ("SKIP" if not en else "LOW/MISSING")
        print(f"  [{status:12}] {key}: enabled={en}, raw_images={n}")

    p = PREPARED_DIR
    for split in ("train", "val", "test", "_staging"):
        n = len(list((p / split / "images").glob("*"))) if (p / split / "images").exists() else 0
        print(f"  prepared/{split}: {n} images")

    print(f"  raw total: {human_size(dir_size(RAW_DIR))}")

    results = RUNS_DIR / "train" / "results.csv"
    if results.exists():
        lines = results.read_text(encoding="utf-8").strip().splitlines()
        epochs = max(0, len(lines) - 1)
        print(f"  training epochs completed: {epochs} / {cfg.get('training', {}).get('epochs', 100)}")
        if epochs:
            print(f"  last row: {lines[-1][:100]}")
    best = RUNS_DIR / "train" / "weights" / "best.pt"
    print(f"  best.pt: {best.exists()} ({best})")


if __name__ == "__main__":
    main()
