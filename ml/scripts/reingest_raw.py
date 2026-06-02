#!/usr/bin/env python3
"""Re-ingest already-downloaded raw zips without re-downloading."""

import sys
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from drishti_ml.prepare.yolo_writer import reset_staging
from drishti_ml.downloaders.bdd100k import Bdd100kDownloader
from drishti_ml.downloaders.coco_full import CocoFullDownloader
from drishti_ml.downloaders.crowdhuman import CrowdHumanDownloader
from drishti_ml.downloaders.dfire import DFireDownloader
from drishti_ml.downloaders.rmfd import RmfdDownloader
from drishti_ml.downloaders.weapon_images import WeaponImagesDownloader
from drishti_ml.utils.io import load_yaml

if __name__ == "__main__":
    reset_staging()
    cfg = load_yaml(ML_ROOT / "config" / "phase1.yaml")
    ds = cfg.get("datasets", {})
    for cls, key in [
        (RmfdDownloader, "rmfd_mask"),
        (CocoFullDownloader, "coco_person"),
        (DFireDownloader, "dfire"),
        (CrowdHumanDownloader, "crowdhuman"),
        (Bdd100kDownloader, "bdd100k_vehicles"),
        (WeaponImagesDownloader, "sohas_weapon"),
    ]:
        print(f"Re-ingest {key}...")
        cls(ds[key]).download()
    staging = ML_ROOT / "prepared" / "drishti_phase1" / "_staging" / "images"
    print(f"Total staged: {len(list(staging.glob('*'))) if staging.exists() else 0}")
