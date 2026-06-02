"""LibreYOLO road-traffic HF dataset for Model C."""

from __future__ import annotations

from pathlib import Path

from ai_models.common.staging import add_sample

# Model C class map
CLASS_MAP = {
    "car": 0,
    "vehicle": 0,
    "motorcycle": 1,
    "motorbike": 1,
    "bicycle": 2,
    "bike": 2,
    "bus": 3,
    "truck": 4,
    "accident": 5,
}


def ingest_libre(raw_dir: Path, staging: Path, max_images: int = 2500) -> int:
    dest = raw_dir / "libre_traffic"
    dest.mkdir(parents=True, exist_ok=True)

    if not any(dest.rglob("*.jpg")):
        from huggingface_hub import snapshot_download

        print("    Downloading LibreYOLO/road-traffic...")
        snapshot_download(
            repo_id="LibreYOLO/road-traffic",
            repo_type="dataset",
            local_dir=str(dest),
            allow_patterns=["train/**", "valid/**", "data.yaml"],
        )

    added = 0
    for lbl in dest.rglob("*.txt"):
        if "label" not in str(lbl).lower() and lbl.parent.name != "labels":
            continue
        stem = lbl.stem
        img = None
        for ext in (".jpg", ".jpeg", ".png"):
            for base in (lbl.parent.parent / "images", lbl.parent, lbl.parent.parent):
                p = base / f"{stem}{ext}"
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
            if p[0].isdigit():
                cid = int(p[0])
            else:
                name = p[0].lower()
                cid = CLASS_MAP.get(name)
                if cid is None:
                    continue
            labels.append((cid, float(p[1]), float(p[2]), float(p[3]), float(p[4])))
        if labels and add_sample(staging, img, labels, "libre"):
            added += 1
        if added >= max_images:
            break
    return added
