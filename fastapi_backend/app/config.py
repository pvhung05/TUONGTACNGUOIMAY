from typing import Set

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # OpenAPI docs
    OPENAPI_URL: str = "/openapi.json"

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"
    TEST_DATABASE_URL: str | None = None
    EXPIRE_ON_COMMIT: bool = False

    # CORS
    CORS_ORIGINS: Set[str] = {"http://localhost:3000", "http://127.0.0.1:3000"}

    # Sign MT
    SIGN_MT_BASE_URL: str = "https://us-central1-sign-mt.cloudfunctions.net"
    DEFAULT_SPOKEN_LANGUAGE: str = "en"
    DEFAULT_SIGNED_LANGUAGE: str = "ase"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
