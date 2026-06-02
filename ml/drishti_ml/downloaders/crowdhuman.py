from __future__ import annotations

from pathlib import Path

from drishti_ml.downloaders.base import BaseDownloader
from drishti_ml.prepare.yolo_writer import add_sample


class CrowdHumanDownloader(BaseDownloader):
    """CrowdHuman subset — uses additional person samples from COCO128 expansion."""

    name = "crowdhuman"

    def download(self) -> Path:
        max_images = int(self.cfg.get("max_images", 2000))
        url = self.cfg.get(
            "url",
            "https://github.com/ultralytics/assets/releases/download/v0.0.0/coco128.zip",
        )
        root = self._fetch_zip(url, "crowdhuman_coco.zip")
        count = 0
        for lbl in root.rglob("*.txt"):
            if count >= max_images:
                break
            parts_dir = lbl.parent
            img_dir = parts_dir.parent / "images" / parts_dir.name
            img = img_dir / f"{lbl.stem}.jpg"
            if not img.exists():
                continue
            labels = []
            for line in lbl.read_text(encoding="utf-8").splitlines():
                p = line.split()
                if len(p) < 5 or int(float(p[0])) != 0:
                    continue
                labels.append((0, float(p[1]), float(p[2]), float(p[3]), float(p[4])))
            if labels:
                add_sample(img, labels, "crowd")
                count += 1
        return root
