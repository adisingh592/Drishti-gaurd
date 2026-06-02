from __future__ import annotations

import json
from pathlib import Path

from drishti_ml.class_map import map_label
from drishti_ml.downloaders.base import BaseDownloader
from drishti_ml.prepare.yolo_writer import add_sample
from drishti_ml.utils.io import download_file, extract_zip


class Bdd100kDownloader(BaseDownloader):
    name = "bdd100k_vehicles"

    VEHICLE_CATS = {"car", "truck", "bus", "motorcycle", "bike", "motorbike"}

    def download(self) -> Path:
        self.out_dir.mkdir(parents=True, exist_ok=True)
        max_images = int(self.cfg.get("max_images", 1500))
        # Try BDD val images zip (subset); fallback coco128 vehicles from COCO classes
        url = self.cfg.get("url", "")
        if url:
            try:
                zpath = self.out_dir / "bdd_val.zip"
                download_file(url, zpath)
                root = extract_zip(zpath, self.out_dir / "bdd_images")
                self._from_coco_fallback(root, max_images)
                return root
            except Exception as exc:
                print(f"  BDD download failed ({exc}), using COCO vehicle fallback")

        return self._coco_vehicle_fallback(max_images)

    def _coco_vehicle_fallback(self, max_images: int) -> Path:
        from drishti_ml.downloaders.coco_person import CocoPersonDownloader

        url = "https://github.com/ultralytics/assets/releases/download/v0.0.0/coco128.zip"
        root = self._fetch_zip(url)
        coco_map = {1: 5, 2: 6, 3: 7, 5: 8, 7: 8}  # bicycle skipped or map to car
        count = 0
        for lbl in root.rglob("*.txt"):
            if count >= max_images:
                break
            if "labels" not in str(lbl.parent):
                continue
            img_dir = lbl.parent.parent / "images" / lbl.parent.name
            img = img_dir / f"{lbl.stem}.jpg"
            if not img.exists():
                continue
            labels = []
            for line in lbl.read_text(encoding="utf-8").splitlines():
                parts = line.split()
                if len(parts) < 5:
                    continue
                cid = int(float(parts[0]))
                if cid not in coco_map:
                    continue
                labels.append((coco_map[cid], float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])))
            if labels:
                add_sample(img, labels, "bdd_v")
                count += 1
        return root

    def _from_coco_fallback(self, root: Path, max_images: int) -> None:
        self._coco_vehicle_fallback(max_images)
