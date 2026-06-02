from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path

from drishti_ml.constants import RAW_DIR
from drishti_ml.utils.io import download_file, extract_archive, extract_zip


class BaseDownloader(ABC):
    name: str = "base"

    def __init__(self, cfg: dict) -> None:
        self.cfg = cfg
        self.out_dir = RAW_DIR / self.name

    @abstractmethod
    def download(self) -> Path:
        ...

    def _fetch_zip(self, url: str, zip_name: str | None = None) -> Path:
        self.out_dir.mkdir(parents=True, exist_ok=True)
        zname = zip_name or f"{self.name}.zip"
        zpath = self.out_dir / zname
        download_file(url, zpath)
        dest = self.out_dir / "extracted"
        if dest.exists():
            import shutil
            shutil.rmtree(dest, ignore_errors=True)
        extract_archive(zpath, dest)
        return dest
