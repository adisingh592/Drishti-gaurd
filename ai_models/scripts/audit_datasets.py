#!/usr/bin/env python3
"""Audit B/C/D datasets vs Phase 1 skip list and local raw folders."""

from __future__ import annotations

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT))

from ai_models.common.phase1_skip import load_registry, should_skip
from ai_models.paths import MODEL_A_ROOT, MODEL_B_ROOT, MODEL_C_ROOT, MODEL_D_ROOT

MODELS = {
    "B": MODEL_B_ROOT,
    "C": MODEL_C_ROOT,
    "D": MODEL_D_ROOT,
}


def count_raw_images(root: Path) -> int:
    if not root.exists():
        return 0
    exts = {".jpg", ".jpeg", ".png", ".bmp"}
    return sum(1 for p in root.rglob("*") if p.suffix.lower() in exts)


def main() -> None:
    reg = load_registry()
    print("=" * 60)
    print("Dataset audit (Phase 1 skip + download status)")
    print("=" * 60)
    print("\nPhase 1 used (will NOT re-download):")
    for k in reg.get("phase1_used", []):
        print(f"  - {k}")

    a_w = MODEL_A_ROOT / "weights" / "best.pt"
    print(f"\nModel A (frozen): {'OK' if a_w.exists() else 'MISSING'} {a_w}")

    for model_key, cfg_key in [("B", "model_b"), ("C", "model_c"), ("D", "model_d")]:
        print(f"\n--- Model {model_key} ---")
        mcfg = reg.get(cfg_key, {})
        for ds in mcfg.get("datasets", []):
            key = ds.get("key", "?")
            skip, reason = should_skip(key, ds)
            flag = "SKIP" if skip else ("ON" if ds.get("enabled") else "pending")
            print(f"  [{flag:7}] {key}: {reason or ds.get('status', '')}")
        root = MODELS[model_key]
        raw = root / "datasets" / "raw"
        prep = root / "prepared"
        w = root / "weights" / "best.pt"
        n_raw = count_raw_images(raw)
        n_train = len(list((prep / "train" / "images").glob("*"))) if (prep / "train" / "images").exists() else 0
        print(f"  raw images: {n_raw} | prepared train: {n_train} | weights: {'yes' if w.exists() else 'no'}")


if __name__ == "__main__":
    main()
