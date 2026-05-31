from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

from app.config import get_settings

_store: dict[str, dict[str, Any]] = {}
_mongo_client = None
_mongo_db = None


async def init_db() -> None:
    global _mongo_client, _mongo_db
    settings = get_settings()
    if settings.mongodb_url:
        try:
            from motor.motor_asyncio import AsyncIOMotorClient

            _mongo_client = AsyncIOMotorClient(settings.mongodb_url)
            _mongo_db = _mongo_client[settings.mongodb_db]
            await _mongo_db.command("ping")
        except Exception:
            _mongo_client = None
            _mongo_db = None


async def close_db() -> None:
    global _mongo_client
    if _mongo_client:
        _mongo_client.close()
        _mongo_client = None


def _json_path() -> Path:
    return get_settings().data_dir / "db_store.json"


def _load_json_store() -> None:
    global _store
    path = _json_path()
    if path.exists():
        _store = json.loads(path.read_text(encoding="utf-8"))


def _save_json_store() -> None:
    _json_path().write_text(json.dumps(_store, indent=2, default=str), encoding="utf-8")


async def save_upload(upload_id: str, data: dict[str, Any]) -> None:
    data["updated_at"] = datetime.utcnow().isoformat()
    if _mongo_db is not None:
        await _mongo_db.uploads.replace_one({"upload_id": upload_id}, data, upsert=True)
        return
    _load_json_store()
    _store[upload_id] = data
    _save_json_store()


async def get_upload(upload_id: str) -> Optional[dict[str, Any]]:
    if _mongo_db is not None:
        doc = await _mongo_db.uploads.find_one({"upload_id": upload_id})
        if doc:
            doc.pop("_id", None)
        return doc
    _load_json_store()
    return _store.get(upload_id)


async def update_upload(upload_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    doc = await get_upload(upload_id)
    if not doc:
        return None
    doc.update(patch)
    await save_upload(upload_id, doc)
    return doc
