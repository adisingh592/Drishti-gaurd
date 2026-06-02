"""Mall crowd dataset — crowd density labels (not used in Phase 1)."""

from __future__ import annotations

import csv
import zipfile
from pathlib import Path

from ai_models.common.staging import add_sample

# class ids for Model B
CROWD, DENSE, OVER = 0, 1, 2


def ingest_mall(raw_dir: Path, staging: Path, max_images: int = 2000) -> int:
    url = "https://personal.ie.cuhk.edu.hk/~ccloy/files/datasets/mall_dataset.zip"
    zpath = raw_dir / "mall_dataset.zip"
    if not zpath.exists() or zpath.stat().st_size < 1_000_000:
        from drishti_ml.utils.io import download_file

        download_file(url, zpath)

    extract = raw_dir / "mall_extracted"
    if not (extract / "frames").exists():
        extract.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(zpath, "r") as zf:
            zf.extractall(extract)

    count_csv = None
    for p in extract.rglob("mall_gt.csv"):
        count_csv = p
        break
    frames_dir = extract / "frames"
    if not frames_dir.exists():
        for p in extract.rglob("frames"):
            if p.is_dir():
                frames_dir = p
                break

    counts: dict[str, int] = {}
    if count_csv and count_csv.exists():
        with count_csv.open(encoding="utf-8", errors="ignore") as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) >= 2:
                    counts[row[0].strip()] = int(float(row[1]))

    added = 0
    for img in sorted(frames_dir.glob("*.jpg")):
        n = counts.get(img.name, counts.get(img.stem, 15))
        if n > 80:
            cid = OVER
        elif n > 35:
            cid = DENSE
        else:
            cid = CROWD
        labels = [(cid, 0.5, 0.5, 0.95, 0.95)]
        if add_sample(staging, img, labels, "mall"):
            added += 1
        if added >= max_images:
            break
    return added
