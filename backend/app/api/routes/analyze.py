from __future__ import annotations

import asyncio

from fastapi import APIRouter, BackgroundTasks, HTTPException

from app.models.schemas import (
    AnalysisProgress,
    AnalysisResultResponse,
    AnalysisStatus,
    AnalyzeStartResponse,
)
from app.services import database
from app.services.pipeline import run_analysis_background

router = APIRouter(prefix="/api", tags=["analyze"])


@router.post("/analyze/{upload_id}", response_model=AnalyzeStartResponse)
async def start_analysis(upload_id: str, background_tasks: BackgroundTasks) -> AnalyzeStartResponse:
    doc = await database.get_upload(upload_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Upload not found")

    if doc.get("status") == AnalysisStatus.PROCESSING.value:
        return AnalyzeStartResponse(
            upload_id=upload_id,
            status=AnalysisStatus.PROCESSING,
            message="Analysis already in progress",
        )

    await database.update_upload(
        upload_id,
        {
            "status": AnalysisStatus.PROCESSING.value,
            "progress": 0,
            "current_step": "starting",
            "message": "Analysis started",
            "error": None,
        },
    )
    background_tasks.add_task(run_analysis_background, upload_id)

    return AnalyzeStartResponse(
        upload_id=upload_id,
        status=AnalysisStatus.PROCESSING,
        message="Analysis started",
    )


@router.get("/analyze/{upload_id}/progress", response_model=AnalysisProgress)
async def get_progress(upload_id: str) -> AnalysisProgress:
    doc = await database.get_upload(upload_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Upload not found")

    return AnalysisProgress(
        upload_id=upload_id,
        status=AnalysisStatus(doc.get("status", AnalysisStatus.PENDING.value)),
        progress=int(doc.get("progress", 0)),
        current_step=doc.get("current_step", ""),
        message=doc.get("message", ""),
        error=doc.get("error"),
    )


@router.get("/analyze/{upload_id}/results", response_model=AnalysisResultResponse)
async def get_results(upload_id: str) -> AnalysisResultResponse:
    doc = await database.get_upload(upload_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Upload not found")

    if doc.get("status") != AnalysisStatus.COMPLETED.value:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Analysis not complete",
                "status": doc.get("status"),
                "progress": doc.get("progress", 0),
            },
        )

    result = doc.get("result")
    if not result:
        raise HTTPException(status_code=500, detail="Result missing")

    return AnalysisResultResponse(**result)


@router.get("/analytics/{upload_id}", response_model=AnalysisResultResponse)
async def get_analytics(upload_id: str) -> AnalysisResultResponse:
    """Full analytics payload for frontend."""
    return await get_results(upload_id)
