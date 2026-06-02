from __future__ import annotations

from pathlib import Path

from drishti_ml.downloaders.base import BaseDownloader
from drishti_ml.prepare.yolo_writer import add_sample

# COCO class id -> Drishti class id
COCO_MAP = {
    0: 0,   # person
    43: 2,  # knife
    2: 5,   # car
    3: 6,   # motorcycle
    5: 7,   # bus
    7: 8,   # truck
}


class CocoFullDownloader(BaseDownloader):
    name = "coco_person"

    def download(self) -> Path:
        url = self.cfg.get("url", "https://github.com/ultralytics/assets/releases/download/v0.0.0/coco128.zip")
        root = self._fetch_zip(url)
        for lbl in root.rglob("*.txt"):
            if lbl.parent.name not in ("labels", "train2017", "val2017") and "labels" not in str(lbl.parent):
                continue
            img = self._find_image(lbl)
            if not img:
                continue
            labels = []
            for line in lbl.read_text(encoding="utf-8").splitlines():
                p = line.split()
                if len(p) < 5:
                    continue
                coco_id = int(float(p[0]))
                if coco_id not in COCO_MAP:
                    continue
                cid = COCO_MAP[coco_id]
                labels.append((cid, float(p[1]), float(p[2]), float(p[3]), float(p[4])))
            if labels:
                add_sample(img, labels, "coco")
        return root

    def _find_image(self, lbl: Path) -> Path | None:
        stem = lbl.stem
        split = lbl.parent.name
        roots = [lbl.parent.parent.parent, lbl.parent.parent, lbl.parent]
        for root in roots:
            for cand in [
                root / "images" / split / f"{stem}.jpg",
                root / "images" / f"{stem}.jpg",
                lbl.parent / f"{stem}.jpg",
            ]:
                if cand.exists():
                    return cand
        return None
