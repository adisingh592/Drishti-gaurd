from __future__ import annotations

from pathlib import Path

from drishti_ml.downloaders.base import BaseDownloader
from drishti_ml.prepare.yolo_writer import add_sample, coco_label_line_to_yolo


class CocoPersonDownloader(BaseDownloader):
    name = "coco_person"

    def download(self) -> Path:
        url = self.cfg.get("url", "https://github.com/ultralytics/assets/releases/download/v0.0.0/coco128.zip")
        root = self._fetch_zip(url)
        # coco128 layout: images/train2017, labels/train2017
        for labels_dir in root.rglob("labels"):
            images_dir = labels_dir.parent / "images"
            if not images_dir.exists():
                images_dir = labels_dir.parent.parent / "images" / labels_dir.name
            if not images_dir.exists():
                continue
            for lbl_file in labels_dir.glob("*.txt"):
                img = images_dir / f"{lbl_file.stem}.jpg"
                if not img.exists():
                    img = images_dir / f"{lbl_file.stem}.png"
                if not img.exists():
                    continue
                yolo_labels = []
                for line in lbl_file.read_text(encoding="utf-8").strip().splitlines():
                    parts = line.split()
                    if not parts:
                        continue
                    cid_coco = int(float(parts[0]))
                    if cid_coco != 0:  # person only in COCO
                        continue
                    parsed = coco_label_line_to_yolo(["0"] + parts[1:], 1, 1)
                    if parsed:
                        yolo_labels.append(parsed)
                if yolo_labels:
                    add_sample(img, yolo_labels, "coco_p")
        return root
