from __future__ import annotations

import os
from pathlib import Path

from drishti_ml.constants import MAX_TOTAL_BYTES


def dir_size(path: Path) -> int:
    total = 0
    if not path.exists():
        return 0
    for root, _, files in os.walk(path):
        for f in files:
            fp = Path(root) / f
            try:
                total += fp.stat().st_size
            except OSError:
                pass
    return total


def human_size(n: int) -> str:
    for u in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f} {u}"
        n /= 1024
    return f"{n:.1f} TB"


def can_download_more(base: Path, extra_bytes: int, cap: int = MAX_TOTAL_BYTES) -> bool:
    return dir_size(base) + extra_bytes <= cap
