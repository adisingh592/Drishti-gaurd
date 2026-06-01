#!/usr/bin/env python3
import argparse
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
    p.add_argument("--out", type=Path, default=None)
    p.add_argument("--conf", type=float, default=0.4)
    p.add_argument("--sample", type=int, default=2, help="Process every Nth frame")
    args = p.parse_args()

    engine = DrishtiEngine(weights=args.weights, conf=args.conf)
    cap = cv2.VideoCapture(str(args.video))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out_path = args.out or args.video.with_name(args.video.stem + "_drishti.mp4")
    writer = cv2.VideoWriter(str(out_path), cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))
    fn = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if fn % args.sample == 0:
            result = engine.predict_frame(frame)
            frame = engine.draw(frame, result)
        writer.write(frame)
        fn += 1
    cap.release()
    writer.release()
    print(f"Saved {out_path}")


if __name__ == "__main__":
    main()
