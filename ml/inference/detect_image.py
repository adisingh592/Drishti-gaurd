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
    p.add_argument("image", type=Path)
    p.add_argument("--weights", default=None)
    p.add_argument("--out", type=Path, default=None)
    p.add_argument("--conf", type=float, default=0.4)
    args = p.parse_args()

    engine = DrishtiEngine(weights=args.weights, conf=args.conf)
    frame = cv2.imread(str(args.image))
    result = engine.predict_frame(frame, track=False)
    out = engine.draw(frame, result)
    dest = args.out or args.image.with_name(args.image.stem + "_drishti.jpg")
    cv2.imwrite(str(dest), out)
    print(f"Saved {dest}")
    print(f"Detections: {len(result['detections'])}")


if __name__ == "__main__":
    main()
