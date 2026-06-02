"""Sample frames from HuggingFace godseye violence dataset (Fight / NonFight)."""

from __future__ import annotations

from pathlib import Path

import cv2

from ai_models.common.staging import add_sample

FIGHTING, VIOLENCE = 3, 4


def ingest_godseye(raw_dir: Path, staging: Path, max_videos: int = 120) -> int:
    dest = raw_dir / "godseye"
    dest.mkdir(parents=True, exist_ok=True)

    try:
        from huggingface_hub import snapshot_download
    except ImportError:
        print("    [SKIP] huggingface_hub not installed")
        return 0

    if not any(dest.rglob("*.avi")):
        print("    Downloading godseye subset from HuggingFace...")
        snapshot_download(
            repo_id="valiantlynxz/godseye-violence-detection-dataset",
            repo_type="dataset",
            local_dir=str(dest),
            allow_patterns=["train/Fight/**/*.avi", "train/NonFight/**/*.avi"],
        )

    added = 0
    videos = sorted(dest.rglob("*.avi"))[:max_videos]
    for avi in videos:
        is_fight = "Fight" in str(avi) or "fight" in str(avi)
        cap = cv2.VideoCapture(str(avi))
        fn = 0
        while cap.isOpened() and fn < 6:
            ret, frame = cap.read()
            if not ret:
                break
            if fn % 12 == 0:
                tmp = raw_dir / f"frame_{avi.stem}_{fn}.jpg"
                cv2.imwrite(str(tmp), frame)
                if not is_fight:
                    continue
                labels = [(VIOLENCE, 0.5, 0.5, 0.9, 0.9)]
                if add_sample(staging, tmp, labels, "vio"):
                    added += 1
                tmp.unlink(missing_ok=True)
            fn += 1
        cap.release()
        if added >= max_videos * 4:
            break
    return added
