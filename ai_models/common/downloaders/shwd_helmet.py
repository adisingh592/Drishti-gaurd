"""SHWD helmet dataset via Google Drive (not in Phase 1)."""

from __future__ import annotations

import zipfile
from pathlib import Path

from ai_models.common.staging import add_sample

HELMET, NO_HELMET = 0, 1


def ingest_shwd(raw_dir: Path, staging: Path, gdrive_id: str, max_images: int = 2000) -> int:
    zpath = raw_dir / "shwd.zip"
    if not zpath.exists() or zpath.stat().st_size < 1_000_000:
        try:
            import gdown
        except ImportError:
            print("    [SKIP] gdown not installed — pip install gdown for SHWD")
            return 0
        print("    Downloading SHWD from Google Drive...")
        gdown.download(id=gdrive_id, output=str(zpath), quiet=False)

    extract = raw_dir / "shwd_extracted"
    if not any(extract.rglob("*.jpg")):
        extract.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(zpath, "r") as zf:
            zf.extractall(extract)

    added = 0
    for xml in extract.rglob("*.xml"):
        if "annotation" not in xml.read_text(encoding="utf-8", errors="ignore")[:300]:
            continue
        try:
            import xml.etree.ElementTree as ET

            root = ET.parse(xml).getroot()
            fn = root.findtext("filename", "")
            img = None
            for p in extract.rglob(fn):
                if p.is_file() and p.suffix.lower() in (".jpg", ".jpeg", ".png"):
                    img = p
                    break
            if not img:
                continue
            w = int(root.findtext("size/width", "640"))
            h = int(root.findtext("size/height", "480"))
            labels = []
            for obj in root.findall("object"):
                name = (obj.findtext("name") or "").lower()
                cid = HELMET if "helmet" in name or "hat" in name else NO_HELMET
                box = obj.find("bndbox")
                if box is None:
                    continue
                xmin = float(box.findtext("xmin", 0))
                ymin = float(box.findtext("ymin", 0))
                xmax = float(box.findtext("xmax", 0))
                ymax = float(box.findtext("ymax", 0))
                xc = ((xmin + xmax) / 2) / w
                yc = ((ymin + ymax) / 2) / h
                bw = (xmax - xmin) / w
                bh = (ymax - ymin) / h
                labels.append((cid, xc, yc, bw, bh))
            if labels and add_sample(staging, img, labels, "shwd"):
                added += 1
        except Exception:
            continue
        if added >= max_images:
            break
    return added
