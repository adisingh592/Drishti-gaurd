from __future__ import annotations

import random
import shutil
from pathlib import Path

import cv2


def is_valid_image(path: Path) -> bool:
    img = cv2.imread(str(path))
    return img is not None and img.size > 0


def add_sample(
    staging: Path,
    image: Path,
    labels: list[tuple[int, float, float, float, float]],
    prefix: str,
) -> bool:
    if not is_valid_image(image):
        return False
    import hashlib

    h = hashlib.md5(image.read_bytes()).hexdigest()[:12]
    name = f"{prefix}_{h}{image.suffix.lower()}"
    (staging / "images").mkdir(parents=True, exist_ok=True)
    (staging / "labels").mkdir(parents=True, exist_ok=True)
    shutil.copy2(image, staging / "images" / name)
    lines = [f"{c} {x:.6f} {y:.6f} {w:.6f} {hb:.6f}" for c, x, y, w, hb in labels]
    (staging / "labels" / f"{Path(name).stem}.txt").write_text(
        "\n".join(lines) + ("\n" if lines else ""), encoding="utf-8"
    )
    return True


def split_staging(staging: Path, prepared: Path, seed: int = 42) -> None:
    images = sorted((staging / "images").glob("*"))
    random.seed(seed)
    random.shuffle(images)
    n = len(images)
    n_train = int(n * 0.8)
    n_val = int(n * 0.1)
    splits = {
        "train": images[:n_train],
        "val": images[n_train : n_train + n_val],
        "test": images[n_train + n_val :],
    }
    for sp, files in splits.items():
        for img in files:
            stem = img.stem
            lbl = staging / "labels" / f"{stem}.txt"
            di = prepared / sp / "images"
            dl = prepared / sp / "labels"
            di.mkdir(parents=True, exist_ok=True)
            dl.mkdir(parents=True, exist_ok=True)
            shutil.copy2(img, di / img.name)
            if lbl.exists():
                shutil.copy2(lbl, dl / lbl.name)


def write_data_yaml(prepared: Path, names: list[str]) -> None:
    import yaml

    data = {
        "path": str(prepared.resolve()),
        "train": "train/images",
        "val": "val/images",
        "test": "test/images",
        "nc": len(names),
        "names": names,
    }
    with (prepared / "data.yaml").open("w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, sort_keys=False)
