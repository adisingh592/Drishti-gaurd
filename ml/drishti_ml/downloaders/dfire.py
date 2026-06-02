"""Fire/smoke from BoWFire (VUT Brno mirror, ~59MB)."""

from __future__ import annotations

from pathlib import Path

from drishti_ml.downloaders.base import BaseDownloader
from drishti_ml.prepare.yolo_writer import add_sample

# GitHub BoWFire mirror is often 404; VUT Brno hosts the tensorflow pack
BOWFIRE_URL = "http://merlin.fit.vutbr.cz/fire/dataset-bowfire-for-tensorflow.tar.bz2"


class DFireDownloader(BaseDownloader):
    name = "dfire"

    def download(self) -> Path:
        url = self.cfg.get("url", BOWFIRE_URL)
        root = self._fetch_zip(url, zip_name="bowfire.tar.bz2")
        count = self._ingest_bowfire(root)
        print(f"    Fire/smoke ingested: {count}")
        return root

    def _ingest_bowfire(self, root: Path) -> int:
        count = 0
        max_n = int(self.cfg.get("max_images", 800))
        for img in root.rglob("*"):
            if img.suffix.lower() not in (".jpg", ".jpeg", ".png", ".bmp"):
                continue
            path_lower = str(img).lower()
            if "smoke" in path_lower:
                cid = 10
            elif "fire" in path_lower or "flame" in path_lower or "burn" in path_lower:
                cid = 9
            elif "non" in path_lower or "no_fire" in path_lower or "negative" in path_lower:
                continue
            else:
                # BoWFire tensorflow pack: folder names often Fire / NonFire
                parent = img.parent.name.lower()
                if "non" in parent or parent in ("0", "nofire"):
                    continue
                if "fire" in parent or parent in ("1", "fire"):
                    cid = 9
                else:
                    continue
            labels = [(cid, 0.5, 0.5, 0.85, 0.85)]
            if add_sample(img, labels, "fire"):
                count += 1
            if count >= max_n:
                break
        return count
