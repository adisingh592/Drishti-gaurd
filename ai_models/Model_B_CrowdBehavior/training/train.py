#!/usr/bin/env python3
"""Model B training — run only when datasets are prepared. Does not touch Model A."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

if __name__ == "__main__":
    weights = ROOT / "Model_B_CrowdBehavior" / "weights" / "best.pt"
    if weights.exists():
        print("Model B weights already exist. Delete manually only if you intend to retrain B.")
        sys.exit(0)
    print("Model B: download datasets first (see config/model.yaml).")
    print("Then implement dataset prep under Model_B_CrowdBehavior/datasets/")
    sys.exit(1)
