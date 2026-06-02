#!/usr/bin/env python3
"""Model D training — uses separate weights when ready; until then Phase 1 filter is used."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
PHASE1 = ROOT / "ml" / "models" / "phase1" / "best.pt"

if __name__ == "__main__":
    dedicated = ROOT / "Model_D_SafetyMonitoring" / "weights" / "best.pt"
    if dedicated.exists() and PHASE1.exists():
        import hashlib

        def md5(p):
            h = hashlib.md5()
            with open(p, "rb") as f:
                h.update(f.read(1 << 20))
            return h.hexdigest()

        if md5(dedicated) == md5(PHASE1):
            print("Refusing to train: D weights are still Phase 1 copy. Remove copy to train dedicated D.")
            sys.exit(1)
    print("Train YOLOv11s on helmet/mask/fire datasets — save to Model_D_SafetyMonitoring/weights/")
    sys.exit(1)
