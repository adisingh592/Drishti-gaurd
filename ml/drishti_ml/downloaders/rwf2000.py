from __future__ import annotations

from pathlib import Path

import cv2

from drishti_ml.downloaders.base import BaseDownloader


class Rwf2000Downloader(BaseDownloader):
    """Download RWF-2000 and extract frames for violence activity training."""

    name = "rwf2000"

    def download(self) -> Path:
        url = self.cfg.get(
            "url",
            "https://github.com/mcheng16/RWF2000-Optical-Flow/archive/refs/heads/master.zip",
        )
        root = self._fetch_zip(url)
        out = self.out_dir / "frames"
        out.mkdir(parents=True, exist_ok=True)
        max_per_class = int(self.cfg.get("max_clips_per_class", 150))
        manifest = []

        for avi in root.rglob("*.avi"):
            if len(manifest) >= max_per_class * 2:
                break
            label = "violence" if "Fight" in str(avi) or "fight" in str(avi) else "normal"
            cap = cv2.VideoCapture(str(avi))
            fn = 0
            while cap.isOpened() and fn < 8:
                ret, frame = cap.read()
                if not ret:
                    break
                if fn % 15 == 0:
                    fp = out / f"{label}_{avi.stem}_{fn}.jpg"
                    cv2.imwrite(str(fp), frame)
                    manifest.append({"file": str(fp.name), "label": label})
                fn += 1
            cap.release()

        (self.out_dir / "manifest.json").write_text(
            __import__("json").dumps(manifest, indent=2), encoding="utf-8"
        )
        return root
