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

    # Gemini / RAG
    GEMINI_API_KEY: str = ""
    RAG_CHROMA_DIR: str = "rag_data/chroma_db"
    RAG_ASL_DIR: str = "../ASL_in_RAG"
    RAG_CHUNK_SIZE: int = 1000
    RAG_CHUNK_OVERLAP: int = 200
    RAG_TOP_K: int = 5

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
