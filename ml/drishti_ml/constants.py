from pathlib import Path

ML_ROOT = Path(__file__).resolve().parents[1]
CONFIG_DIR = ML_ROOT / "config"
RAW_DIR = ML_ROOT / "datasets" / "raw"
PREPARED_DIR = ML_ROOT / "prepared" / "drishti_phase1"
MODELS_DIR = ML_ROOT / "models" / "phase1"
RUNS_DIR = ML_ROOT / "runs" / "phase1"
REPORTS_DIR = ML_ROOT / "reports" / "phase1"

CLASS_NAMES = [
    "person", "gun", "knife", "mask", "no_mask",
    "car", "motorcycle", "bus", "truck", "fire", "smoke",
]
NUM_CLASSES = len(CLASS_NAMES)
MAX_TOTAL_BYTES = 10 * 1024**3
