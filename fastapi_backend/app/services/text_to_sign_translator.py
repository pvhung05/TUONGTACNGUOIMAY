from __future__ import annotations

import re
from urllib.parse import urlencode

from app.config import settings


class TextToSignTranslator:
    def __init__(self) -> None:
        self._base_url = settings.SIGN_MT_BASE_URL.rstrip("/")
        self._default_spoken_language = settings.DEFAULT_SPOKEN_LANGUAGE
        self._default_signed_language = settings.DEFAULT_SIGNED_LANGUAGE

    @staticmethod
    def _normalize_text(text: str) -> str:
        return re.sub(r"\s+", " ", text).strip()

    def _build_cloud_function_url(self, function_name: str, params: dict[str, str]) -> str:
        return f"{self._base_url}/{function_name}?{urlencode(params)}"

    def translate(
        self,
        text: str,
        spoken_language: str | None = None,
        signed_language: str | None = None,
    ) -> dict[str, object]:
        normalized_text = self._normalize_text(text)
        active_spoken_language = (spoken_language or self._default_spoken_language).strip() or self._default_spoken_language
        active_signed_language = (signed_language or self._default_signed_language).strip() or self._default_signed_language

        query_params = {
            "text": normalized_text,
            "spoken": active_spoken_language,
            "signed": active_signed_language,
        }

        return {
            "input_text": text,
            "normalized_text": normalized_text,
            "spoken_language": active_spoken_language,
            "signed_language": active_signed_language,
            "source": "sign-mt",
            "video_url": self._build_cloud_function_url(
                "spoken_text_to_signed_video",
                query_params,
            ),
            "pose_url": self._build_cloud_function_url(
                "spoken_text_to_signed_pose",
                query_params,
            ),
        }
