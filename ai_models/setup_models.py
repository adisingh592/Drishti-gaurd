#!/usr/bin/env python3
"""
One-time setup: copy Phase 1 weights into Model A (and optional Model D fallback).

Never overwrites existing Model A weights.
Never modifies ml/models/phase1/best.pt.
"""

from __future__ import annotations

import hashlib
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT))

from ai_models.paths import (  # noqa: E402
    MODEL_A_ROOT,
    MODEL_B_ROOT,
    MODEL_C_ROOT,
    MODEL_D_ROOT,
    PHASE1_WEIGHTS_SOURCE,
)


def _md5(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def _copy_if_missing(src: Path, dest: Path, label: str) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        if src.exists() and _md5(src) == _md5(dest):
            print(f"[OK] {label}: already present (matches Phase 1)")
        else:
            print(f"[SKIP] {label}: {dest.name} exists — not overwritten")
        return
    if not src.exists():
        print(f"[WARN] {label}: source missing {src}")
        return
    shutil.copy2(src, dest)
    print(f"[OK] {label}: copied from Phase 1 -> {dest}")


def main() -> None:
    src = PHASE1_WEIGHTS_SOURCE
    print("Drishti Guard — ai_models setup")
    print(f"Phase 1 source: {src}")

    _copy_if_missing(src, MODEL_A_ROOT / "weights" / "best.pt", "Model A best.pt")
    last_src = REPO_ROOT / "ml" / "runs" / "phase1" / "train" / "weights" / "last.pt"
    if last_src.exists():
        _copy_if_missing(last_src, MODEL_A_ROOT / "weights" / "last.pt", "Model A last.pt")

    model_d_best = MODEL_D_ROOT / "weights" / "best.pt"
    if not model_d_best.exists():
        _copy_if_missing(src, model_d_best, "Model D fallback (fire/mask from Phase 1)")
    else:
        print("[SKIP] Model D: dedicated weights present")

    for root in (MODEL_A_ROOT, MODEL_B_ROOT, MODEL_C_ROOT, MODEL_D_ROOT):
        for sub in ("datasets", "training", "exports", "config", "weights"):
            (root / sub).mkdir(parents=True, exist_ok=True)

    print("Done.")


if __name__ == "__main__":
    main()
