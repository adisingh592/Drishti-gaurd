from __future__ import annotations

import yaml

from drishti_ml.constants import CONFIG_DIR, NUM_CLASSES


def load_label_map() -> dict[str, int]:
    with (CONFIG_DIR / "classes.yaml").open(encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return {str(k).lower().strip(): int(v) for k, v in data.get("label_map", {}).items()}


def map_label(raw: str) -> int | None:
    key = raw.lower().strip().replace("-", "_")
    m = load_label_map()
    if key in m:
        return m[key]
    for alias, cid in m.items():
        if alias in key or key in alias:
            return cid
    return None


def validate_class_id(cid: int) -> bool:
    return 0 <= cid < NUM_CLASSES
