from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    data_dir: Path = Path("./data")
    max_upload_mb: int = 10240

    mongodb_url: str = ""
    mongodb_db: str = "drishti_guard"

    yolo_model: str = "yolo11n.pt"
    custom_model_path: str = ""
    device: str = "cuda"
    frame_sample_rate: int = 2
    batch_size: int = 16
    confidence_threshold: float = 0.45
    use_gpu: bool = True
    simulation_mode: bool = False

    @property
    def uploads_dir(self) -> Path:
        return self.data_dir / "uploads"

    @property
    def screenshots_dir(self) -> Path:
        return self.data_dir / "screenshots"

    @property
    def reports_dir(self) -> Path:
        return self.data_dir / "reports"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    for d in (settings.data_dir, settings.uploads_dir, settings.screenshots_dir, settings.reports_dir):
        d.mkdir(parents=True, exist_ok=True)
    return settings
