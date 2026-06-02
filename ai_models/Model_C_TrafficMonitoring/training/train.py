#!/usr/bin/env python3
"""Model C training — separate from Model A. See config/model.yaml."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
if __name__ == "__main__":
    w = ROOT / "Model_C_TrafficMonitoring" / "weights" / "best.pt"
    if w.exists():
        print("Model C weights exist — will not overwrite from this stub.")
        sys.exit(0)
    print("Prepare BDD100K / UA-DETRAC data under datasets/ then add training script.")
    sys.exit(1)
