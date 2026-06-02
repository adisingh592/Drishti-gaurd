#!/usr/bin/env python3
"""
Download, prepare, and train Models B/C/D only.
Never touches Model A / Phase 1 weights.
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
AI_MODELS = Path(__file__).resolve().parents[1]
ML_ROOT = REPO_ROOT / "ml"
sys.path.insert(0, str(REPO_ROOT))
sys.path.insert(0, str(ML_ROOT))


def _load_reg():
    import yaml

    p = AI_MODELS / "common" / "dataset_registry.yaml"
    with p.open(encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


from ai_models.common.phase1_skip import should_skip  # noqa: E402
from ai_models.common.staging import split_staging, write_data_yaml  # noqa: E402
from ai_models.paths import MODEL_B_ROOT, MODEL_C_ROOT, MODEL_D_ROOT  # noqa: E402


def reset_staging(model_root: Path) -> Path:
    staging = model_root / "prepared" / "_staging"
    if staging.exists():
        shutil.rmtree(staging)
    (staging / "images").mkdir(parents=True)
    (staging / "labels").mkdir(parents=True)
    return staging


def download_model_b(staging: Path) -> int:
    from ai_models.common.downloaders.godseye_violence import ingest_godseye
    from ai_models.common.downloaders.mall_crowd import ingest_mall

    raw = MODEL_B_ROOT / "datasets" / "raw"
    raw.mkdir(parents=True, exist_ok=True)
    reg = _load_reg()
    total = 0
    for ds in reg["model_b"]["datasets"]:
        key = ds["key"]
        skip, reason = should_skip(key, ds)
        if skip or not ds.get("enabled"):
            print(f"  [SKIP] {key}: {reason or ds.get('status', '')}")
            continue
        if key == "mall_crowd":
            n = ingest_mall(raw, staging)
            print(f"  [OK] mall_crowd: {n} images")
            total += n
        elif key == "godseye_violence":
            n = ingest_godseye(raw, staging, max_videos=int(ds.get("max_videos", 80)))
            print(f"  [OK] godseye_violence: {n} images")
            total += n
    return total


def download_model_c(staging: Path) -> int:
    from ai_models.common.downloaders.aaic_traffic import ingest_aaic
    from ai_models.common.downloaders.libre_traffic import ingest_libre

    raw = MODEL_C_ROOT / "datasets" / "raw"
    raw.mkdir(parents=True, exist_ok=True)
    reg = _load_reg()
    total = 0
    for ds in reg["model_c"]["datasets"]:
        key = ds["key"]
        skip, reason = should_skip(key, ds)
        if skip or not ds.get("enabled"):
            print(f"  [SKIP] {key}: {reason or ds.get('status', '')}")
            continue
        if key == "libre_road_traffic":
            n = ingest_libre(raw, staging)
            print(f"  [OK] libre_road_traffic: {n} images")
            total += n
        elif key == "aaic_iran":
            n = ingest_aaic(raw, staging)
            print(f"  [OK] aaic_iran: {n} images")
            total += n
    return total


def download_model_d(staging: Path) -> int:
    from ai_models.common.downloaders.shwd_helmet import ingest_shwd

    raw = MODEL_D_ROOT / "datasets" / "raw"
    raw.mkdir(parents=True, exist_ok=True)
    reg = _load_reg()
    total = 0
    for ds in reg["model_d"]["datasets"]:
        key = ds["key"]
        skip, reason = should_skip(key, ds)
        if skip or not ds.get("enabled"):
            print(f"  [SKIP] {key}: {reason or ds.get('status', '')}")
            continue
        if key == "shwd_helmet":
            n = ingest_shwd(raw, staging, ds.get("gdrive_id", ""))
            print(f"  [OK] shwd_helmet: {n} images")
            total += n
    return total


def prepare(model_root: Path, class_names: list[str]) -> Path:
    staging = model_root / "prepared" / "_staging"
    prepared = model_root / "prepared"
    if not (staging / "images").exists() or not any((staging / "images").glob("*")):
        raise SystemExit(f"No staged images under {staging}")
    for sp in ("train", "val", "test"):
        p = prepared / sp
        if p.exists():
            shutil.rmtree(p)
    split_staging(staging, prepared)
    write_data_yaml(prepared, class_names)
    n = len(list((prepared / "train" / "images").glob("*")))
    print(f"  Prepared train: {n} images -> {prepared / 'data.yaml'}")
    return prepared / "data.yaml"


def train(model_root: Path, data_yaml: Path) -> None:
    reg = _load_reg()
    t = reg["training_defaults"]
    weights_dir = model_root / "weights"
    weights_dir.mkdir(parents=True, exist_ok=True)
    runs = model_root / "training" / "runs"
    runs.mkdir(parents=True, exist_ok=True)

    from ultralytics import YOLO

    model = YOLO(t.get("model", "yolo11s.pt"))
    # workers=0 + cache=False avoids common Windows hangs with disk cache / multiprocessing
    cache_mode = t.get("cache", "disk")
    workers = int(t.get("workers", 0))
    if sys.platform == "win32" and workers != 0:
        workers = 0
    results = model.train(
        data=str(data_yaml),
        epochs=int(t.get("epochs", 100)),
        imgsz=int(t.get("imgsz", 640)),
        batch=int(t.get("batch", 4)),
        amp=bool(t.get("amp", True)),
        cache=cache_mode if cache_mode not in (False, "false", "none") else False,
        workers=workers,
        device=int(t.get("device", 0)),
        patience=int(t.get("patience", 25)),
        project=str(runs),
        name="train",
        exist_ok=True,
    )
    best = Path(results.save_dir) / "weights" / "best.pt"
    if best.exists():
        dest = weights_dir / "best.pt"
        if dest.exists() and model_root.name == "Model_A_SecurityThreats":
            raise RuntimeError("Refusing to overwrite Model A weights")
        shutil.copy2(best, dest)
        print(f"  Weights saved: {dest}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", choices=["B", "C", "D", "all"], default="all")
    parser.add_argument("--download-only", action="store_true")
    parser.add_argument("--train-only", action="store_true")
    args = parser.parse_args()

    jobs = []
    if args.model in ("B", "all"):
        jobs.append(
            (
                "B",
                MODEL_B_ROOT,
                ["Crowd", "Dense_Crowd", "Overcrowding", "Fighting", "Violence"],
                download_model_b,
            )
        )
    if args.model in ("C", "all"):
        jobs.append(
            (
                "C",
                MODEL_C_ROOT,
                ["Vehicle", "Motorcycle", "Bicycle", "Bus", "Truck", "Accident", "Rash_Driving", "Wrong_Direction"],
                download_model_c,
            )
        )
    if args.model in ("D", "all"):
        jobs.append(
            (
                "D",
                MODEL_D_ROOT,
                ["Helmet", "No_Helmet", "Mask", "No_Mask", "Fire", "Smoke"],
                download_model_d,
            )
        )

    for label, root, names, dl_fn in jobs:
        print(f"\n{'=' * 60}\nModel {label} — {root.name}\n{'=' * 60}")
        if not args.train_only:
            staging = reset_staging(root)
            n = dl_fn(staging)
            print(f"  Staged total: {n}")
            if n < 30:
                print(f"  [WARN] Model {label}: too few images — training may be weak")
        if not args.download_only:
            try:
                yaml_path = prepare(root, names)
            except SystemExit as e:
                print(f"  [SKIP train] {e}")
                continue
            if label == "D" and len(list((root / "prepared" / "train" / "images").glob("*"))) < 50:
                print("  [SKIP] Model D train — insufficient new data; keep Phase 1 fallback weights")
                continue
            print(f"  Training {label} (yolo11s, 100 epochs)...")
            train(root, yaml_path)

    print("\nDone. Run: python ai_models/scripts/audit_datasets.py")


if __name__ == "__main__":
    main()
