from __future__ import annotations

from pathlib import Path
from threading import Lock
import json

import numpy as np


class ActionDetectionPredictor:
    ACTIONS = ["hello", "thanks", "iloveyou"]
    SEQUENCE_LENGTH = 30
    FEATURE_SIZE = 1662

    def __init__(self, model_path: str | Path):
        self.model_path = Path(model_path)
        self.labels_path = self.model_path.with_suffix(".labels.json")
        self.metadata_path = self.model_path.with_suffix(".training-metadata.json")
        self._model = None
        self._lock = Lock()
        self._actions = self._load_actions()
        self._metadata = self._load_metadata()

    def _load_actions(self) -> list[str]:
        if self.labels_path.exists():
            try:
                payload = json.loads(self.labels_path.read_text(encoding="utf-8"))
                labels = payload.get("actions")
                if isinstance(labels, list) and all(isinstance(item, str) for item in labels):
                    return labels
            except (OSError, json.JSONDecodeError):
                pass

        return list(self.ACTIONS)

    def _ensure_model(self):
        if self._model is None:
            with self._lock:
                if self._model is None:
                    import tensorflow as tf

                    class CompatibleLSTM(tf.keras.layers.LSTM):
                        @classmethod
                        def from_config(cls, config):
                            config.pop("time_major", None)
                            return super().from_config(config)

                    self._model = tf.keras.models.load_model(
                        self.model_path,
                        custom_objects={"LSTM": CompatibleLSTM},
                        compile=False,
                    )
                    self._actions = self._load_actions()

        return self._model

    def _load_metadata(self) -> dict[str, object]:
        if self.metadata_path.exists():
            try:
                payload = json.loads(self.metadata_path.read_text(encoding="utf-8"))
                if isinstance(payload, dict):
                    return payload
            except (OSError, json.JSONDecodeError):
                pass

        return {}

    def _prepare_sequence(self, sequence: list[list[float]]) -> np.ndarray:
        array = np.asarray(sequence, dtype=np.float32)

        if array.ndim != 2:
            raise ValueError("Expected a 2D sequence array.")

        if array.shape[1] != self.FEATURE_SIZE:
            raise ValueError(
                f"Expected each frame to contain {self.FEATURE_SIZE} values, got {array.shape[1]}."
            )

        if array.shape[0] < self.SEQUENCE_LENGTH:
            padding = np.zeros(
                (self.SEQUENCE_LENGTH - array.shape[0], self.FEATURE_SIZE), dtype=np.float32
            )
            array = np.vstack([padding, array])
        elif array.shape[0] > self.SEQUENCE_LENGTH:
            array = array[-self.SEQUENCE_LENGTH :]

        return np.expand_dims(array, axis=0)

    def predict(self, sequence: list[list[float]]) -> dict[str, object]:
        model = self._ensure_model()
        prepared = self._prepare_sequence(sequence)
        probabilities = model.predict(prepared, verbose=0)[0]
        best_index = int(np.argmax(probabilities))
        actions = self._actions[: len(probabilities)]

        return {
            "label": actions[best_index],
            "confidence": float(probabilities[best_index]),
            "scores": {
                action: float(probabilities[index]) for index, action in enumerate(actions)
            },
        }

    @property
    def actions(self) -> list[str]:
        return list(self._actions)

    @property
    def metadata(self) -> dict[str, object]:
        return dict(self._metadata)
