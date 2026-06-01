from __future__ import annotations

import hashlib
import shutil
import tarfile
import zipfile
from pathlib import Path
from urllib.request import Request, urlopen, urlretrieve

import cv2
import yaml


def load_yaml(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def save_yaml(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, default_flow_style=False, sort_keys=False)


def _remote_size(url: str, timeout: int = 60) -> int:
    headers = {"User-Agent": "Mozilla/5.0 (DrishtiGuard/1.0)"}
    req = Request(url, headers=headers, method="HEAD")
    try:
        with urlopen(req, timeout=timeout) as resp:
            return int(resp.headers.get("Content-Length", 0) or 0)
    except Exception:
        return 0


def download_file(url: str, dest: Path, timeout: int = 300) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    total = _remote_size(url, timeout=min(timeout, 60))
    if dest.exists():
        local = dest.stat().st_size
        if total and local == total:
            return dest
        if total and local != total:
            dest.unlink(missing_ok=True)
        elif not total and local > 1024:
            return dest
    print(f"  Downloading {url[:80]}...")
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (DrishtiGuard/1.0)"})
    with urlopen(req, timeout=timeout) as resp:
        if not total:
            total = int(resp.headers.get("Content-Length", 0) or 0)
        chunk = 1024 * 256
        done = 0
        with dest.open("wb") as out:
            while True:
                block = resp.read(chunk)
                if not block:
                    break
                out.write(block)
                done += len(block)
                if total and done % (5 * 1024 * 1024) < chunk:
                    pct = 100 * done / total
                    print(f"    ... {done // (1024*1024)}MB / {total // (1024*1024)}MB ({pct:.0f}%)")
    size = dest.stat().st_size
    if size < 1024:
        dest.unlink(missing_ok=True)
        raise OSError(f"Download failed or empty: {url}")
    if total and size != total:
        dest.unlink(missing_ok=True)
        raise OSError(f"Incomplete download ({size} / {total} bytes): {url}")
    return dest


def extract_zip(zip_path: Path, dest: Path) -> Path:
    dest.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(dest)
    return dest


def extract_archive(archive: Path, dest: Path) -> Path:
    dest.mkdir(parents=True, exist_ok=True)
    name = archive.name.lower()
    if name.endswith(".zip"):
        return extract_zip(archive, dest)
    if name.endswith((".tar.bz2", ".tbz2", ".tar.gz", ".tgz", ".tar")):
        mode = "r:bz2" if ".bz" in name else ("r:gz" if name.endswith(".gz") else "r")
        with tarfile.open(archive, mode) as tf:
            tf.extractall(dest)
        return dest
    raise ValueError(f"Unsupported archive: {archive}")


def file_hash(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def is_valid_image(path: Path) -> bool:
    try:
        img = cv2.imread(str(path))
        return img is not None and img.size > 0
    except Exception:
        return False


def copy_tree_limited(src: Path, dst: Path, max_files: int | None = None) -> int:
    count = 0
    for p in src.rglob("*"):
        if not p.is_file():
            continue
        if max_files and count >= max_files:
            break
        rel = p.relative_to(src)
        out = dst / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, out)
        count += 1
    return count
