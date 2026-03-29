from __future__ import annotations

import json
from pathlib import Path

import numpy as np

ACTIONS = ("hello", "thanks", "iloveyou")
PILOT_ACTIONS = (
    "yes",
    "no",
    "help",
    "good",
    "bad",
    "family",
    "work",
    "go",
    "drink",
    "school",
)
SEQUENCE_LENGTH = 30
FEATURE_SIZE = 1662

TRAINING_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA_DIR = TRAINING_ROOT / "datasets" / "action_detection"
DEFAULT_PILOT_VIDEO_ROOT = Path(r"C:\Users\duong\Downloads\archive\dataset\SL")
DEFAULT_PILOT_DATA_DIR = TRAINING_ROOT / "datasets" / "action_detection_word10"
DEFAULT_HOLISTIC_MODEL_DIR = TRAINING_ROOT / "models"
DEFAULT_HOLISTIC_MODEL_PATH = DEFAULT_HOLISTIC_MODEL_DIR / "holistic_landmarker.task"
HOLISTIC_MODEL_URL = (
    "https://storage.googleapis.com/mediapipe-models/holistic_landmarker/"
    "holistic_landmarker/float16/1/holistic_landmarker.task"
)
DEFAULT_MODEL_DIR = Path(__file__).resolve().parents[2] / "app" / "ml_models" / "action_detection"
DEFAULT_OUTPUT_MODEL = DEFAULT_MODEL_DIR / "action-retrained.h5"
DEFAULT_PILOT_OUTPUT_MODEL = DEFAULT_MODEL_DIR / "action-word10.h5"


def ensure_directory(path: Path) -> Path:
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_sidecar_paths(model_path: Path) -> tuple[Path, Path]:
    return (
        model_path.with_suffix(".labels.json"),
        model_path.with_suffix(".training-metadata.json"),
    )


def get_sequence_directories(data_dir: Path, action: str) -> list[Path]:
    action_dir = data_dir / action

    if not action_dir.exists():
        return []

    directories = [path for path in action_dir.iterdir() if path.is_dir()]
    return sorted(directories, key=lambda path: int(path.name))


def next_sequence_index(data_dir: Path, action: str) -> int:
    directories = get_sequence_directories(data_dir, action)

    if not directories:
        return 0

    return max(int(path.name) for path in directories) + 1


def extract_keypoints(results) -> np.ndarray:
    pose_points = getattr(results, "pose_landmarks", None)
    face_points = getattr(results, "face_landmarks", None)
    left_hand_points = getattr(results, "left_hand_landmarks", None)
    right_hand_points = getattr(results, "right_hand_landmarks", None)

    if pose_points and hasattr(pose_points[0], "visibility"):
        pose = np.array(
            [[point.x, point.y, point.z, point.visibility] for point in pose_points],
            dtype=np.float32,
        ).flatten()
    else:
        pose = np.zeros(33 * 4, dtype=np.float32)

    if face_points:
        face = np.array(
            [[point.x, point.y, point.z] for point in face_points[:468]],
            dtype=np.float32,
        ).flatten()
        if face.size < 468 * 3:
            face = np.pad(face, (0, 468 * 3 - face.size))
    else:
        face = np.zeros(468 * 3, dtype=np.float32)

    if left_hand_points:
        left_hand = np.array(
            [[point.x, point.y, point.z] for point in left_hand_points],
            dtype=np.float32,
        ).flatten()
    else:
        left_hand = np.zeros(21 * 3, dtype=np.float32)

    if right_hand_points:
        right_hand = np.array(
            [[point.x, point.y, point.z] for point in right_hand_points],
            dtype=np.float32,
        ).flatten()
    else:
        right_hand = np.zeros(21 * 3, dtype=np.float32)

    return np.concatenate([pose, face, left_hand, right_hand])


def write_sidecar_files(
    actions: list[str],
    metadata: dict[str, object],
    model_path: Path = DEFAULT_OUTPUT_MODEL,
) -> None:
    ensure_directory(model_path.parent)
    labels_path, metadata_path = get_sidecar_paths(model_path)
    labels_path.write_text(json.dumps({"actions": actions}, indent=2), encoding="utf-8")
    metadata_path.write_text(
        json.dumps(metadata, indent=2),
        encoding="utf-8",
    )
