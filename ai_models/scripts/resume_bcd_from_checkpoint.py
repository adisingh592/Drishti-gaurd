#!/usr/bin/env python3
"""
Resume B/C/D work from ai_models/checkpoints/bcd_progress.json.
Run when the user says "resume" or via resume-bcd-training.bat.
"""

from __future__ import annotations

import json
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
AI_MODELS = Path(__file__).resolve().parents[1]
CHECKPOINT = AI_MODELS / "checkpoints" / "bcd_progress.json"
ML_ROOT = REPO_ROOT / "ml"

MODEL_D_ROOT = AI_MODELS / "Model_D_SafetyMonitoring"
D_RUN = MODEL_D_ROOT / "training" / "runs" / "train"
D_LAST = D_RUN / "weights" / "last.pt"
D_BEST_RUN = D_RUN / "weights" / "best.pt"
D_BEST_DEST = MODEL_D_ROOT / "weights" / "best.pt"


def _load() -> dict:
    if not CHECKPOINT.exists():
        raise SystemExit(f"Missing checkpoint: {CHECKPOINT}")
    with CHECKPOINT.open(encoding="utf-8") as f:
        return json.load(f)


def _save(state: dict) -> None:
    state["saved_at"] = datetime.now(timezone.utc).isoformat()
    CHECKPOINT.parent.mkdir(parents=True, exist_ok=True)
    with CHECKPOINT.open("w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)
        f.write("\n")


def resume_model_d(state: dict) -> None:
    d = state["models"]["D"]
    if d.get("status") == "trained":
        print("  Model D already marked trained — skipping train resume.")
        return
    if not D_LAST.exists():
        raise SystemExit(
            f"No checkpoint to resume: {D_LAST}\n"
            "Run: python ai_models/scripts/run_bcd_pipeline.py --model D --train-only"
        )
    print(f"\n{'=' * 60}\nResuming Model D training from {D_LAST}\n{'=' * 60}")
    print("  Using workers=0, cache=False (avoids Windows dataloader/disk-cache hangs)")
    from ultralytics import YOLO

    model = YOLO(str(D_LAST))
    model.train(
        resume=True,
        workers=0,
        cache=False,
        batch=4,
        device=0,
    )
    d["status"] = "trained"
    for step in state["resume_queue"]:
        if step["id"] == "resume_model_d":
            step["status"] = "done"


def copy_model_d_weights(state: dict) -> None:
    if not D_BEST_RUN.exists():
        print(f"  [WARN] No run weights at {D_BEST_RUN}")
        return
    D_BEST_DEST.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(D_BEST_RUN, D_BEST_DEST)
    print(f"  Model D weights updated: {D_BEST_DEST}")
    state["models"]["D"]["weights_public"] = str(D_BEST_DEST.relative_to(REPO_ROOT)).replace("\\", "/")
    for step in state["resume_queue"]:
        if step["id"] == "copy_model_d_weights":
            step["status"] = "done"


def run_audit() -> None:
    audit = AI_MODELS / "scripts" / "audit_datasets.py"
    import subprocess

    py = ML_ROOT / ".venv" / "Scripts" / "python.exe"
    exe = str(py) if py.exists() else sys.executable
    subprocess.run([exe, str(audit)], cwd=str(ML_ROOT), check=False)


def main() -> None:
    state = _load()
    print("Drishti Guard — resume from checkpoint")
    print(f"  Checkpoint: {CHECKPOINT}")
    print(f"  Saved at:   {state.get('saved_at', '?')}")
    print(f"  Model B:    {state['models']['B']['status']}")
    print(f"  Model C:    {state['models']['C']['status']}")
    print(f"  Model D:    {state['models']['D']['status']}")

    resume_model_d(state)
    copy_model_d_weights(state)

    _save(state)
    print("\nCheckpoint updated.")
    run_audit()
    print("\nDone. Restart the app with start-drishti.bat if weights changed.")


if __name__ == "__main__":
    main()
