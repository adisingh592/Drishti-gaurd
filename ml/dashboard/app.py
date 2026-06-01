"""Streamlit dashboard for Drishti Guard Phase 1."""

import json
import sys
from pathlib import Path

import streamlit as st

ML_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_ROOT))

st.set_page_config(page_title="Drishti Guard ML", layout="wide")
st.title("Drishti Guard — Phase 1 Dashboard")

tab1, tab2, tab3 = st.tabs(["Detect", "Training", "Metrics"])

with tab1:
    st.subheader("Image / Video Detection")
    uploaded = st.file_uploader("Upload image or video", type=["jpg", "png", "jpeg", "mp4", "avi"])
    conf = st.slider("Confidence", 0.1, 0.9, 0.4)
    if uploaded and st.button("Run detection"):
        from drishti_ml.inference.engine import DrishtiEngine
        import cv2
        import numpy as np
        import tempfile

        engine = DrishtiEngine(conf=conf)
        data = uploaded.read()
        if uploaded.type and uploaded.type.startswith("video"):
            tmp = Path(tempfile.gettempdir()) / uploaded.name
            tmp.write_bytes(data)
            st.video(str(tmp))
            st.info("Use CLI: python inference/detect_video.py for full annotated export")
        else:
            arr = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
            result = engine.predict_frame(frame, track=False)
            out = engine.draw(frame, result)
            st.image(cv2.cvtColor(out, cv2.COLOR_BGR2RGB), channels="RGB")
            st.json(result)

with tab2:
    st.subheader("Training pipeline")
    st.code(
        "cd ml\npython scripts/download_all.py\npython scripts/prepare_all.py\npython scripts/train.py",
        language="bash",
    )
    if (ML_ROOT / "prepared" / "drishti_phase1" / "data.yaml").exists():
        st.success("Prepared dataset found")
    else:
        st.warning("Run download + prepare first")

with tab3:
    st.subheader("Validation metrics")
    metrics_path = ML_ROOT / "reports" / "phase1" / "metrics.json"
    if metrics_path.exists():
        st.json(json.loads(metrics_path.read_text(encoding="utf-8")))
    else:
        st.info("Run: python scripts/validate.py")
