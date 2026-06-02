"""AAIC Iran traffic dataset (YOLO format) for Model C."""

from __future__ import annotations

import zipfile
from pathlib import Path

from ai_models.common.staging import add_sample

CLASS_MAP = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4}  # map file class ids to Vehicle..Truck


def ingest_aaic(raw_dir: Path, staging: Path, max_images: int = 1500) -> int:
    url = "https://github.com/HooshDrive/AAICDataset/archive/refs/heads/main.zip"
    zpath = raw_dir / "aaic.zip"
    if not zpath.exists() or zpath.stat().st_size < 10000:
        from drishti_ml.utils.io import download_file

        download_file(url, zpath)

    extract = raw_dir / "aaic_extracted"
    if not any(extract.rglob("images")):
        extract.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(zpath, "r") as zf:
            zf.extractall(extract)

    added = 0
    for lbl in extract.rglob("*.txt"):
        if lbl.name in ("data.yaml", "classes.txt", "README.txt"):
            continue
        # YOLO label files live under labels/ or beside images/
        if lbl.parent.name not in ("labels", "label") and "labels" not in lbl.parts:
            continue
        stem = lbl.stem
        split = lbl.parent.name  # train | test | val
        img = None
        for ext in (".jpg", ".jpeg", ".png"):
            candidates = (
                lbl.parent.parent / "images" / split / f"{stem}{ext}",
                lbl.parent.parent / "images" / f"{stem}{ext}",
            )
            for p in candidates:
                if p.exists():
                    img = p
                    break
            if img:
                break
        if not img:
            continue
        labels = []
        for line in lbl.read_text(encoding="utf-8", errors="ignore").splitlines():
            p = line.split()
            if len(p) < 5:
                continue
            cid = int(float(p[0])) % 5
            labels.append((cid, float(p[1]), float(p[2]), float(p[3]), float(p[4])))
        if labels and add_sample(staging, img, labels, "aaic"):
            added += 1
        if added >= max_images:
            break
    return added
