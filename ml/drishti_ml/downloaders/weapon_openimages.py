from __future__ import annotations

from pathlib import Path

from drishti_ml.class_map import map_label
from drishti_ml.downloaders.base import BaseDownloader
from drishti_ml.prepare.yolo_writer import add_sample


class WeaponOpenImagesDownloader(BaseDownloader):
    """SOHAS / OD-WeaponDetection + weapon labels from YOLO-format repos."""

    name = "openimages_weapons"

    def download(self) -> Path:
        # Primary: OD-WeaponDetection (SOHAS-related weapon imagery)
        sohas_cfg = self.cfg.get("sohas_url") or (
            "https://github.com/ari-dasci/OD-WeaponDetection/archive/refs/heads/master.zip"
        )
        root = self._fetch_zip(sohas_cfg, "weapons.zip")
        self._ingest_yolo_tree(root, "oiw")
        return root

    def _ingest_yolo_tree(self, root: Path, prefix: str) -> None:
        for lbl in root.rglob("*.txt"):
            if "labels" not in str(lbl).lower() and lbl.parent.name not in ("labels", "Annotations"):
                continue
            img = self._find_image(lbl)
            if not img:
                continue
            labels = []
            for line in lbl.read_text(encoding="utf-8", errors="ignore").splitlines():
                parts = line.split()
                if len(parts) < 5:
                    continue
                raw_cls = parts[0]
                if raw_cls.isdigit():
                    cid = int(raw_cls)
                    if cid in (1, 2):
                        labels.append((cid, float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])))
                    continue
                mapped = map_label(raw_cls)
                if mapped is not None:
                    labels.append((mapped, float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])))
            if labels:
                add_sample(img, labels, prefix)


    def _find_image(self, lbl: Path) -> Path | None:
        stem = lbl.stem
        parent = lbl.parent
        candidates = [
            parent.parent / "images" / f"{stem}.jpg",
            parent.parent / "images" / f"{stem}.png",
            parent / f"{stem}.jpg",
            lbl.with_suffix(".jpg"),
            lbl.with_suffix(".png"),
        ]
        for c in candidates:
            if c.exists():
                return c
        for ext in (".jpg", ".jpeg", ".png", ".bmp"):
            for p in lbl.parent.rglob(f"{stem}{ext}"):
                return p
        return None
