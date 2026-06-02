"""Weapon images — YOLO-format repos with actual image files."""

from __future__ import annotations

from pathlib import Path

from drishti_ml.class_map import map_label
from drishti_ml.downloaders.base import BaseDownloader
from drishti_ml.prepare.voc_xml import parse_voc_xml
from drishti_ml.prepare.yolo_writer import add_sample
class WeaponImagesDownloader(BaseDownloader):
    name = "sohas_weapon"

    # Smaller YOLO weapon dataset (includes images)
    YOLO_WEAPON_ZIP = "https://github.com/ultralytics/assets/releases/download/v0.0.0/coco128.zip"

    def download(self) -> Path:
        self.out_dir.mkdir(parents=True, exist_ok=True)

        # 1) Ingest VOC XMLs if matching images exist under extracted SOHAS tree
        extracted = self.out_dir / "extracted"
        if extracted.exists():
            self._ingest_voc_with_images(extracted)

        # 2) Supplement: use COCO knife samples as knife class (already in coco_full)
        # 3) Try small weapon YOLO zip from Roboflow-style layout on GitHub
        try:
            root = self._fetch_zip(
                "https://github.com/AlonBarak-dev/Weapon_detection_YOLOv5/archive/refs/heads/master.zip",
                "weapon_guns.zip",
            )
            n = self._ingest_alon_guns(root)
            print(f"    Gun dataset ingested: {n}")
            self._ingest_yolo_dirs(root)
        except Exception as exc:
            print(f"    [WARN] Optional weapon zip skipped: {exc}")

        return self.out_dir

    def _ingest_voc_with_images(self, root: Path) -> None:
        count = 0
        for xml in root.rglob("*.xml"):
            if "annotation" not in xml.read_text(encoding="utf-8", errors="ignore")[:200]:
                continue
            stem = xml.stem
            img = None
            for ext in (".jpg", ".jpeg", ".png", ".bmp"):
                for p in [xml.parent / f"{stem}{ext}", xml.parent.parent / f"{stem}{ext}"]:
                    if p.exists():
                        img = p
                        break
                if img:
                    break
            if not img:
                # search by filename tag inside xml
                try:
                    import xml.etree.ElementTree as ET
                    fn = ET.parse(xml).getroot().findtext("filename", "")
                    if fn:
                        for p in root.rglob(fn):
                            if p.is_file():
                                img = p
                                break
                except Exception:
                    pass
            if not img:
                continue
            _, _, labels = parse_voc_xml(xml)
            if labels and add_sample(img, labels, "sohas"):
                count += 1
            if count >= 3000:
                break
        print(f"    SOHAS VOC+images ingested: {count}")

    def _ingest_alon_guns(self, root: Path) -> int:
        """Parse AlonBarak gun labels: line0=count, then xmin ymin xmax ymax (pixel coords)."""
        count = 0
        max_n = int(self.cfg.get("max_images", 500))
        import cv2

        for lbl in root.rglob("*.txt"):
            if lbl.parent.name.lower() != "labels":
                continue
            stem = lbl.stem
            img = None
            for ext in (".jpg", ".jpeg", ".png"):
                for base in (lbl.parent.parent / "images", lbl.parent.parent, lbl.parent):
                    p = base / f"{stem}{ext}"
                    if p.exists():
                        img = p
                        break
                if img:
                    break
            if not img:
                continue
            lines = [ln.strip() for ln in lbl.read_text(encoding="utf-8", errors="ignore").splitlines() if ln.strip()]
            if not lines:
                continue
            try:
                n_obj = int(lines[0])
            except ValueError:
                n_obj = len(lines)
                lines = lines
            else:
                lines = lines[1:]
            im = cv2.imread(str(img))
            if im is None:
                continue
            h, w = im.shape[:2]
            labels = []
            for line in lines[: max(n_obj, len(lines))]:
                parts = line.split()
                if len(parts) < 4:
                    continue
                x1, y1, x2, y2 = map(float, parts[:4])
                xc = ((x1 + x2) / 2) / w
                yc = ((y1 + y2) / 2) / h
                bw = abs(x2 - x1) / w
                bh = abs(y2 - y1) / h
                labels.append((1, xc, yc, bw, bh))  # class gun
            if labels and add_sample(img, labels, "gun"):
                count += 1
            if count >= max_n:
                break
        return count

    def _ingest_yolo_dirs(self, root: Path) -> None:
        for lbl in root.rglob("*.txt"):
            if "label" not in str(lbl).lower() and lbl.parent.name != "labels":
                continue
            img = None
            stem = lbl.stem
            for ext in (".jpg", ".png", ".jpeg"):
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
                    if cid > 10:
                        continue
                else:
                    m = map_label(p[0])
                    if m is None:
                        continue
                    cid = m
                labels.append((cid, float(p[1]), float(p[2]), float(p[3]), float(p[4])))
            if labels:
                add_sample(img, labels, "wpn")
