#!/usr/bin/env python3
"""Download Phase 1 datasets (10GB budget)."""

from __future__ import annotations

import sys
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from drishti_ml.budget import dir_size, human_size
from drishti_ml.constants import MAX_TOTAL_BYTES, RAW_DIR
from drishti_ml.downloaders.bdd100k import Bdd100kDownloader
from drishti_ml.downloaders.coco_full import CocoFullDownloader
from drishti_ml.downloaders.crowdhuman import CrowdHumanDownloader
from drishti_ml.downloaders.dfire import DFireDownloader
from drishti_ml.downloaders.rmfd import RmfdDownloader
from drishti_ml.downloaders.rwf2000 import Rwf2000Downloader
from drishti_ml.downloaders.weapon_images import WeaponImagesDownloader
from drishti_ml.prepare.yolo_writer import reset_staging
from drishti_ml.utils.io import load_yaml

REGISTRY = {
    "coco_person": CocoFullDownloader,
    "rmfd_mask": RmfdDownloader,
    "dfire": DFireDownloader,
    "crowdhuman": CrowdHumanDownloader,
    "bdd100k_vehicles": Bdd100kDownloader,
    "sohas_weapon": WeaponImagesDownloader,
    "rwf2000": Rwf2000Downloader,
}

# Skip duplicate heavy download (annotations-only zip)
SKIP_KEYS = {"openimages_weapons"}


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--keep-staging", action="store_true", help="Do not wipe _staging")
    args = parser.parse_args()

    cfg = load_yaml(ML_ROOT / "config" / "phase1.yaml")
    datasets = cfg.get("datasets", {})
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    if not args.keep_staging:
        reset_staging()

    print("=" * 60)
    print("Drishti Guard Phase 1 — Dataset Download")
    print(f"Budget cap: {human_size(MAX_TOTAL_BYTES)}")
    print("=" * 60)

    staged = 0
    staging = ML_ROOT / "prepared" / "drishti_phase1" / "_staging" / "images"
    if staging.exists():
        staged = len(list(staging.glob("*")))

    for key, ds_cfg in datasets.items():
        if key in SKIP_KEYS:
            print(f"[SKIP] {key} (duplicate / annotations-only)")
            continue
        if not ds_cfg.get("enabled", True):
            print(f"[SKIP] {key}")
            continue
        if dir_size(RAW_DIR) >= MAX_TOTAL_BYTES and staged < 500:
            print(f"[BUDGET] Reached 10GB cap — stopping before {key}")
            break
        cls = REGISTRY.get(key)
        if not cls:
            print(f"[WARN] No downloader for {key}")
            continue
        print(f"\n>>> {key}")
        try:
            cls(ds_cfg).download()
            if staging.exists():
                staged = len(list(staging.glob("*")))
            print(f"    Staged images: {staged} | Raw size: {human_size(dir_size(RAW_DIR))}")
        except Exception as exc:
            print(f"    [ERROR] {key}: {exc}")

    print(f"\nDone. Staged: {staged} images | Raw: {human_size(dir_size(RAW_DIR))}")
    if staged < 100:
        print("[WARN] Low image count — check network or dataset sources.")
    print("Next: python scripts/prepare_all.py")


if __name__ == "__main__":
    main()
