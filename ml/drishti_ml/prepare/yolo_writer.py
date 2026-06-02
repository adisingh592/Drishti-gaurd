from __future__ import annotations

import random
import shutil
from pathlib import Path

from drishti_ml.class_map import map_label, validate_class_id
from drishti_ml.constants import CLASS_NAMES, PREPARED_DIR
from drishti_ml.utils.io import file_hash, is_valid_image, save_yaml

STAGING = PREPARED_DIR / "_staging"


def reset_staging() -> None:
    if STAGING.exists():
        shutil.rmtree(STAGING)
    (STAGING / "images").mkdir(parents=True)
    (STAGING / "labels").mkdir(parents=True)


def add_sample(image: Path, labels: list[tuple[int, float, float, float, float]], prefix: str) -> bool:
    """labels: list of (class_id, xc, yc, w, h) normalized YOLO."""
    if not is_valid_image(image):
        return False
    h = file_hash(image)
    name = f"{prefix}_{h[:12]}{image.suffix.lower()}"
    dst_img = STAGING / "images" / name
    dst_lbl = STAGING / "labels" / f"{Path(name).stem}.txt"
    shutil.copy2(image, dst_img)
    lines = []
    for cid, xc, yc, w, hb in labels:
        if not validate_class_id(cid):
            continue
        lines.append(f"{cid} {xc:.6f} {yc:.6f} {w:.6f} {hb:.6f}")
    dst_lbl.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    return True


def coco_label_line_to_yolo(parts: list[str], w_img: int, h_img: int) -> tuple[int, float, float, float, float] | None:
    """COCO txt: class xc yc w h (normalized) — class is index in names file."""
    if len(parts) < 5:
        return None
    cid = int(float(parts[0]))
    return cid, float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])


def split_dataset(seed: int = 42, train_r: float = 0.8, val_r: float = 0.1) -> None:
    images = sorted((STAGING / "images").glob("*"))
    random.seed(seed)
    random.shuffle(images)
    n = len(images)
    n_train = int(n * train_r)
    n_val = int(n * val_r)
    splits = {
        "train": images[:n_train],
        "val": images[n_train : n_train + n_val],
        "test": images[n_train + n_val :],
    }
    for split_name, files in splits.items():
        for img in files:
            stem = img.stem
            lbl = STAGING / "labels" / f"{stem}.txt"
            out_i = PREPARED_DIR / split_name / "images"
            out_l = PREPARED_DIR / split_name / "labels"
            out_i.mkdir(parents=True, exist_ok=True)
            out_l.mkdir(parents=True, exist_ok=True)
            shutil.copy2(img, out_i / img.name)
            if lbl.exists():
                shutil.copy2(lbl, out_l / lbl.name)
            else:
                (out_l / f"{stem}.txt").write_text("", encoding="utf-8")


def write_data_yaml() -> Path:
    yaml_path = PREPARED_DIR / "data.yaml"
    data = {
        "path": str(PREPARED_DIR.resolve()),
        "train": "train/images",
        "val": "val/images",
        "test": "test/images",
        "nc": len(CLASS_NAMES),
        "names": CLASS_NAMES,
    }
    save_yaml(yaml_path, data)
    return yaml_path


def deduplicate_staging() -> int:
    seen: set[str] = set()
    removed = 0
    for img in sorted((STAGING / "images").glob("*")):
        h = file_hash(img)
        if h in seen:
            img.unlink(missing_ok=True)
            lbl = STAGING / "labels" / f"{img.stem}.txt"
            lbl.unlink(missing_ok=True)
            removed += 1
        else:
            seen.add(h)
    return removed
