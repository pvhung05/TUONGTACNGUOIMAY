from __future__ import annotations

import argparse
import importlib
import json
from pathlib import Path
from urllib.request import urlretrieve

import cv2
import mediapipe as mp
import numpy as np

from training.action_detection.common import (
    DEFAULT_HOLISTIC_MODEL_PATH,
    DEFAULT_PILOT_DATA_DIR,
    DEFAULT_PILOT_VIDEO_ROOT,
    HOLISTIC_MODEL_URL,
    PILOT_ACTIONS,
    SEQUENCE_LENGTH,
    ensure_directory,
    extract_keypoints,
    next_sequence_index,
)


def ensure_holistic_model(model_path: Path) -> Path:
    if model_path.exists():
        return model_path

    ensure_directory(model_path.parent)
    urlretrieve(HOLISTIC_MODEL_URL, model_path)
    return model_path


def evenly_spaced_indices(total_frames: int, sequence_length: int) -> list[int]:
    if total_frames <= 0:
        return [0] * sequence_length

    return np.linspace(0, max(total_frames - 1, 0), sequence_length).round().astype(int).tolist()


def iter_action_videos(source_root: Path, action: str, max_videos: int | None) -> list[Path]:
    action_dir = source_root / action
    videos = sorted(action_dir.glob("*.mp4"))
    return videos[:max_videos] if max_videos is not None else videos


def read_selected_frames(video_path: Path, frame_indices: list[int]) -> list[np.ndarray]:
    cap = cv2.VideoCapture(str(video_path))
    frames: list[np.ndarray] = []

    if not cap.isOpened():
        raise RuntimeError(f"Could not open video {video_path}")

    try:
        for frame_index in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
            ok, frame = cap.read()
            if not ok or frame is None:
                raise RuntimeError(f"Failed to read frame {frame_index} from {video_path}")
            frames.append(frame)
    finally:
        cap.release()

    return frames


def create_holistic_landmarker(model_bytes: bytes):
    vision = importlib.import_module("mediapipe.tasks.python.vision")
    BaseOptions = importlib.import_module("mediapipe.tasks.python.core.base_options").BaseOptions
    options = vision.HolisticLandmarkerOptions(
        base_options=BaseOptions(model_asset_buffer=model_bytes),
        running_mode=vision.RunningMode.IMAGE,
        output_face_blendshapes=False,
        output_segmentation_mask=False,
    )
    return vision.HolisticLandmarker.create_from_options(options)


def ingest_videos(
    source_root: Path,
    output_dir: Path,
    actions: list[str],
    model_path: Path,
    sequence_length: int,
    max_videos_per_action: int | None,
) -> dict[str, int]:
    ensure_directory(output_dir)
    model_path = ensure_holistic_model(model_path)
    stats: dict[str, int] = {}
    model_bytes = model_path.read_bytes()

    for action in actions:
        videos = iter_action_videos(source_root, action, max_videos_per_action)
        saved_count = 0
        next_index = next_sequence_index(output_dir, action)

        if not videos:
            stats[action] = 0
            continue

        for video_path in videos:
            cap = cv2.VideoCapture(str(video_path))
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            cap.release()

            if total_frames <= 0:
                continue

            frame_indices = evenly_spaced_indices(total_frames, sequence_length)

            try:
                frames = read_selected_frames(video_path, frame_indices)
            except RuntimeError:
                continue

            sequence_dir = ensure_directory(output_dir / action / str(next_index))

            with create_holistic_landmarker(model_bytes) as landmarker:
                for output_frame_num, (frame_index, frame) in enumerate(zip(frame_indices, frames)):
                    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
                    results = landmarker.detect(image)
                    keypoints = extract_keypoints(results)
                    np.save(sequence_dir / f"{output_frame_num}.npy", keypoints)

            meta = {
                "source_video": str(video_path),
                "action": action,
                "frame_indices": frame_indices,
                "sequence_length": sequence_length,
            }
            (sequence_dir / "source.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
            next_index += 1
            saved_count += 1

        stats[action] = saved_count

    return stats


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest isolated sign videos into 30-frame action-detection sequences.")
    parser.add_argument("--source-root", type=Path, default=DEFAULT_PILOT_VIDEO_ROOT)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_PILOT_DATA_DIR)
    parser.add_argument("--model-path", type=Path, default=DEFAULT_HOLISTIC_MODEL_PATH)
    parser.add_argument("--actions", nargs="+", default=list(PILOT_ACTIONS))
    parser.add_argument("--sequence-length", type=int, default=SEQUENCE_LENGTH)
    parser.add_argument("--max-videos-per-action", type=int, default=None)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    stats = ingest_videos(
        source_root=args.source_root,
        output_dir=args.output_dir,
        actions=args.actions,
        model_path=args.model_path,
        sequence_length=args.sequence_length,
        max_videos_per_action=args.max_videos_per_action,
    )

    print("Ingestion completed.")
    for action, count in stats.items():
        print(f"{action}: {count} sequences")


if __name__ == "__main__":
    main()
