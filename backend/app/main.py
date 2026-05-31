from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import analyze, files, upload
from app.config import get_settings
from app.services.database import close_db, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="Drishti Guard API",
    description="AI surveillance video analysis backend",
    version="1.0.0",
    lifespan=lifespan,
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(files.router)

app.mount("/static", StaticFiles(directory=str(settings.data_dir)), name="static")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "drishti-guard-api"}
