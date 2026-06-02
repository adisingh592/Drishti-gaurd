from __future__ import annotations

from pathlib import Path

import cv2

from drishti_ml.downloaders.base import BaseDownloader
from drishti_ml.prepare.yolo_writer import add_sample


class RmfdDownloader(BaseDownloader):
    name = "rmfd_mask"

    def download(self) -> Path:
        url = self.cfg.get(
            "url",
            "https://github.com/X-zhangyang/Real-World-Masked-Face-Dataset/archive/refs/heads/master.zip",
        )
        root = self._fetch_zip(url)
        # RMFD: folder structure with masked / without_mask — full-image labels
        for img in root.rglob("*"):
            if img.suffix.lower() not in (".jpg", ".jpeg", ".png"):
                continue
            path_lower = str(img).lower()
            if "mask" in path_lower and "no_mask" not in path_lower and "without" not in path_lower:
                cid = 3
            elif "no_mask" in path_lower or "without" in path_lower or "unmasked" in path_lower:
                cid = 4
            else:
                continue
            h_img, w_img = cv2.imread(str(img)).shape[:2]
            labels = [(cid, 0.5, 0.5, 0.95, 0.95)]
            add_sample(img, labels, "rmfd")
        return root
