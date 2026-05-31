from __future__ import annotations

import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import get_settings
from app.models.schemas import AnalysisStatus, UploadResponse, VideoMetadata
from app.services import database
from app.services.video_metadata import extract_video_metadata

router = APIRouter(prefix="/api", tags=["upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_video(file: UploadFile = File(...)) -> UploadResponse:
    settings = get_settings()
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in {".mp4", ".avi", ".mov", ".mkv", ".webm", ".m4v"}:
        raise HTTPException(status_code=400, detail="Unsupported video format")

    upload_id = str(uuid.uuid4())
    dest_dir = settings.uploads_dir / upload_id
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / f"video{ext}"

    max_bytes = settings.max_upload_mb * 1024 * 1024
    size = 0
    with dest_path.open("wb") as out:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > max_bytes:
                shutil.rmtree(dest_dir, ignore_errors=True)
                raise HTTPException(status_code=413, detail=f"File exceeds {settings.max_upload_mb}MB limit")
            out.write(chunk)

    try:
        metadata = extract_video_metadata(upload_id, dest_path, file.filename)
    except Exception as exc:
        shutil.rmtree(dest_dir, ignore_errors=True)
        raise HTTPException(status_code=400, detail=f"Invalid video file: {exc}") from exc

    await database.save_upload(
        upload_id,
        {
            "upload_id": upload_id,
            "video_path": str(dest_path),
            "file_name": file.filename,
            "metadata": metadata.model_dump(),
            "status": AnalysisStatus.PENDING.value,
            "progress": 0,
            "current_step": "uploaded",
            "message": "Video uploaded successfully",
        },
    )

    return UploadResponse(
        upload_id=upload_id,
        message="Video uploaded successfully",
        metadata=metadata,
    )
