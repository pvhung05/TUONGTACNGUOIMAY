from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np

from training.action_detection.common import (
    ACTIONS,
    DEFAULT_DATA_DIR,
    SEQUENCE_LENGTH,
    ensure_directory,
    extract_keypoints,
    next_sequence_index,
)


def draw_styled_landmarks(image, results) -> None:
    drawing = mp.solutions.drawing_utils
    holistic = mp.solutions.holistic

    drawing.draw_landmarks(
        image,
        results.face_landmarks,
        holistic.FACEMESH_TESSELATION,
        drawing.DrawingSpec(color=(80, 110, 10), thickness=1, circle_radius=1),
        drawing.DrawingSpec(color=(80, 200, 120), thickness=1, circle_radius=1),
    )
    drawing.draw_landmarks(
        image,
        results.pose_landmarks,
        holistic.POSE_CONNECTIONS,
        drawing.DrawingSpec(color=(80, 22, 10), thickness=2, circle_radius=4),
        drawing.DrawingSpec(color=(80, 44, 121), thickness=2, circle_radius=2),
    )
    drawing.draw_landmarks(
        image,
        results.left_hand_landmarks,
        holistic.HAND_CONNECTIONS,
        drawing.DrawingSpec(color=(121, 22, 76), thickness=2, circle_radius=4),
        drawing.DrawingSpec(color=(121, 44, 250), thickness=2, circle_radius=2),
    )
    drawing.draw_landmarks(
        image,
        results.right_hand_landmarks,
        holistic.HAND_CONNECTIONS,
        drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=4),
        drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2),
    )


def mediapipe_detection(frame, model):
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = model.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    return image, results


def collect_dataset(
    actions: list[str],
    data_dir: Path,
    sequences_per_action: int,
    sequence_length: int,
    warmup_ms: int,
) -> None:
    ensure_directory(data_dir)
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        raise RuntimeError("Could not open webcam for data collection.")

    start_indices = {action: next_sequence_index(data_dir, action) for action in actions}

    with mp.solutions.holistic.Holistic(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    ) as holistic:
        stop_requested = False

        for action in actions:
            for sequence_offset in range(sequences_per_action):
                sequence_index = start_indices[action] + sequence_offset
                sequence_dir = ensure_directory(data_dir / action / str(sequence_index))

                for frame_num in range(sequence_length):
                    ok, frame = cap.read()
                    if not ok:
                        raise RuntimeError("Failed to read a frame from the webcam.")

                    image, results = mediapipe_detection(frame, holistic)
                    draw_styled_landmarks(image, results)

                    if frame_num == 0:
                        cv2.putText(
                            image,
                            "STARTING COLLECTION",
                            (120, 200),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1,
                            (0, 255, 0),
                            4,
                            cv2.LINE_AA,
                        )
                        cv2.putText(
                            image,
                            f"Action: {action} Sequence: {sequence_index}",
                            (15, 30),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.7,
                            (255, 255, 255),
                            2,
                            cv2.LINE_AA,
                        )
                        cv2.imshow("Action Detection Collection", image)
                        cv2.waitKey(warmup_ms)
                    else:
                        cv2.putText(
                            image,
                            f"Collecting {action} Sequence {sequence_index} Frame {frame_num + 1}/{sequence_length}",
                            (15, 30),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.6,
                            (255, 255, 255),
                            2,
                            cv2.LINE_AA,
                        )
                        cv2.imshow("Action Detection Collection", image)

                    keypoints = extract_keypoints(results)
                    np.save(sequence_dir / f"{frame_num}.npy", keypoints)

                    if cv2.waitKey(10) & 0xFF == ord("q"):
                        stop_requested = True
                        break

                if stop_requested:
                    break

            if stop_requested:
                break

    cap.release()
    cv2.destroyAllWindows()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Collect webcam sequences for action detection retraining.")
    parser.add_argument("--actions", nargs="+", default=list(ACTIONS))
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--sequences-per-action", type=int, default=30)
    parser.add_argument("--sequence-length", type=int, default=SEQUENCE_LENGTH)
    parser.add_argument("--warmup-ms", type=int, default=500)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    collect_dataset(
        actions=args.actions,
        data_dir=args.data_dir,
        sequences_per_action=args.sequences_per_action,
        sequence_length=args.sequence_length,
        warmup_ms=args.warmup_ms,
    )
