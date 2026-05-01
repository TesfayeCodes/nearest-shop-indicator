import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "Nearest Shop API"
    PROJECT_VERSION: str = "1.0.0"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/nearest_shop"
    )
    DEFAULT_RADIUS_KM: float = 50.0
    MAX_RESULTS: int = 20


settings = Settings()
