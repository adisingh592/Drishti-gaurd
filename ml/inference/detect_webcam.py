#!/usr/bin/env python3
"""Real-time webcam surveillance detection."""

import argparse
import sys
from pathlib import Path

import cv2

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

from drishti_ml.inference.engine import DrishtiEngine


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--weights", default=None)
    p.add_argument("--camera", type=int, default=0)
    p.add_argument("--conf", type=float, default=0.4)
    args = p.parse_args()

    engine = DrishtiEngine(weights=args.weights, conf=args.conf)
    cap = cv2.VideoCapture(args.camera)
    print("Press Q to quit")
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        result = engine.predict_frame(frame)
        crowd = sum(1 for d in result["detections"] if d["class"] == "person")
        out = engine.draw(frame, result)
        cv2.putText(out, f"Crowd: {crowd}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.imshow("Drishti Guard", out)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
