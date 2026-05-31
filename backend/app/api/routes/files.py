from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.config import get_settings

router = APIRouter(prefix="/api/files", tags=["files"])


@router.get("/videos/{upload_id}")
async def serve_video(upload_id: str) -> FileResponse:
    settings = get_settings()
    folder = settings.uploads_dir / upload_id
    if not folder.exists():
        raise HTTPException(status_code=404, detail="Video not found")
    for path in folder.iterdir():
        if path.suffix.lower() in {".mp4", ".avi", ".mov", ".mkv", ".webm", ".m4v"}:
            return FileResponse(path, media_type="video/mp4")
    raise HTTPException(status_code=404, detail="Video not found")


@router.get("/screenshots/{upload_id}/{filename}")
async def serve_screenshot(upload_id: str, filename: str) -> FileResponse:
    settings = get_settings()
    path = settings.screenshots_dir / upload_id / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="Screenshot not found")
    return FileResponse(path, media_type="image/jpeg")
