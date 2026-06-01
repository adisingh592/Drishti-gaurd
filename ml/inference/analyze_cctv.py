#!/usr/bin/env python3
"""CCTV video upload analysis — JSON report + annotated output video."""

import argparse
import json
import sys
from pathlib import Path

import cv2

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from drishti_ml.inference.engine import DrishtiEngine


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("video", type=Path)
    p.add_argument("--weights", default=None)
    p.add_argument("--out-dir", type=Path, default=Path("outputs/cctv"))
    p.add_argument("--conf", type=float, default=0.4)
    p.add_argument("--sample", type=int, default=3)
    args = p.parse_args()

    args.out_dir.mkdir(parents=True, exist_ok=True)
    engine = DrishtiEngine(weights=args.weights, conf=args.conf)
    cap = cv2.VideoCapture(str(args.video))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25

    timeline = []
    fn = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if fn % args.sample == 0:
            ts = fn / fps
            result = engine.predict_frame(frame)
            crowd = sum(1 for d in result["detections"] if d["class"] == "person")
            for d in result["detections"]:
                if d["class"] in ("gun", "knife", "fire", "smoke"):
                    timeline.append({
                        "time": round(ts, 2),
                        "type": d["class"],
                        "confidence": d["confidence"],
                    })
            if crowd > 50:
                timeline.append({"time": round(ts, 2), "type": "crowd_warning", "count": crowd})
        fn += 1
    cap.release()

    report = {
        "video": str(args.video),
        "events": timeline,
        "threat_count": len(timeline),
    }
    report_path = args.out_dir / f"{args.video.stem}_report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Report: {report_path}")
    print(f"Events: {len(timeline)}")


if __name__ == "__main__":
    main()
