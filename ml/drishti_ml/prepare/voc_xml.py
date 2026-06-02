"""Convert Pascal VOC XML to YOLO normalized boxes."""

from __future__ import annotations

import xml.etree.ElementTree as ET
from pathlib import Path

from drishti_ml.class_map import map_label


def parse_voc_xml(xml_path: Path) -> tuple[int, int, list[tuple[int, float, float, float, float]]]:
    tree = ET.parse(xml_path)
    root = tree.getroot()
    size = root.find("size")
    w = int(size.findtext("width", "1"))
    h = int(size.findtext("height", "1"))
    labels: list[tuple[int, float, float, float, float]] = []
    for obj in root.findall("object"):
        name = obj.findtext("name", "")
        cid = map_label(name)
        if cid is None:
            # SOHAS weapon synonyms
            n = name.lower()
            if "gun" in n or "pistol" in n or "rifle" in n or "firearm" in n:
                cid = 1
            elif "knife" in n or "blade" in n:
                cid = 2
            elif "weapon" in n:
                cid = 1
            else:
                continue
        box = obj.find("bndbox")
        xmin = float(box.findtext("xmin", 0))
        ymin = float(box.findtext("ymin", 0))
        xmax = float(box.findtext("xmax", 0))
        ymax = float(box.findtext("ymax", 0))
        xc = ((xmin + xmax) / 2) / w
        yc = ((ymin + ymax) / 2) / h
        bw = (xmax - xmin) / w
        bh = (ymax - ymin) / h
        labels.append((cid, xc, yc, bw, bh))
    return w, h, labels
