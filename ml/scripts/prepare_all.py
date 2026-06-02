#!/usr/bin/env python3
"""Dedup, merge staged samples, split 80/10/10, write data.yaml."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from drishti_ml.constants import PREPARED_DIR
from drishti_ml.prepare.yolo_writer import (
    STAGING,
    deduplicate_staging,
    split_dataset,
    write_data_yaml,
)
from drishti_ml.utils.io import load_yaml


def main() -> None:
    cfg = load_yaml(ML_ROOT / "config" / "phase1.yaml")
    split_cfg = cfg.get("split", {}) or {}
    seed = int(cfg.get("seed", 42))

    if not (STAGING / "images").exists():
        print("No staged images. Run: python scripts/download_all.py")
        sys.exit(1)

    removed = deduplicate_staging()
    print(f"Removed {removed} duplicate images")

    PREPARED_DIR.mkdir(parents=True, exist_ok=True)
    for split in ("train", "val", "test"):
        sp = PREPARED_DIR / split
        if sp.exists():
            shutil.rmtree(sp)

    split_dataset(
        seed=seed,
        train_r=float(split_cfg.get("train", 0.8)),
        val_r=float(split_cfg.get("val", 0.1)),
    )
    yaml_path = write_data_yaml()

    for split in ("train", "val", "test"):
        n = len(list((PREPARED_DIR / split / "images").glob("*")))
        print(f"  {split}: {n} images")

    print(f"\ndata.yaml -> {yaml_path}")
    print("Next: python scripts/train.py")


if __name__ == "__main__":
    main()
