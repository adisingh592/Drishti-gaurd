from __future__ import annotations

from pathlib import Path

import yaml

REGISTRY = Path(__file__).parent / "dataset_registry.yaml"


def load_registry() -> dict:
    with REGISTRY.open(encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def phase1_keys() -> set[str]:
    return set(load_registry().get("phase1_used", []))


def should_skip(dataset_key: str, entry: dict | None = None) -> tuple[bool, str]:
    if entry and entry.get("skip_phase1"):
        return True, entry.get("skip_reason", "marked skip_phase1 in registry")
    if dataset_key in phase1_keys():
        return True, "listed in phase1_used"
    return False, ""
