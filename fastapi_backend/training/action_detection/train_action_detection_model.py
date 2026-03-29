from __future__ import annotations

import argparse
from dataclasses import asdict, dataclass
from pathlib import Path

import numpy as np
import tensorflow as tf

from training.action_detection.common import (
    ACTIONS,
    DEFAULT_DATA_DIR,
    DEFAULT_OUTPUT_MODEL,
    FEATURE_SIZE,
    SEQUENCE_LENGTH,
    ensure_directory,
    write_sidecar_files,
)


@dataclass
class DatasetSummary:
    samples: int
    actions: list[str]
    sequence_length: int
    feature_size: int
    train_samples: int
    validation_samples: int
    test_samples: int


def load_dataset(data_dir: Path, actions: list[str], sequence_length: int) -> tuple[np.ndarray, np.ndarray]:
    sequences: list[list[np.ndarray]] = []
    labels: list[int] = []

    for label_index, action in enumerate(actions):
        action_dir = data_dir / action
        if not action_dir.exists():
            continue

        sequence_dirs = sorted(
            [path for path in action_dir.iterdir() if path.is_dir()],
            key=lambda path: int(path.name),
        )

        for sequence_dir in sequence_dirs:
            frames: list[np.ndarray] = []
            for frame_num in range(sequence_length):
                frame_path = sequence_dir / f"{frame_num}.npy"
                if not frame_path.exists():
                    frames = []
                    break
                frame = np.load(frame_path)
                if frame.shape != (FEATURE_SIZE,):
                    raise ValueError(
                        f"Unexpected feature shape in {frame_path}: {frame.shape}, expected ({FEATURE_SIZE},)."
                    )
                frames.append(frame.astype(np.float32))

            if len(frames) == sequence_length:
                sequences.append(frames)
                labels.append(label_index)

    if not sequences:
        raise ValueError(f"No valid sequences found in {data_dir}.")

    x = np.asarray(sequences, dtype=np.float32)
    y = tf.keras.utils.to_categorical(labels).astype(np.float32)
    return x, y


def split_dataset(
    x: np.ndarray,
    y: np.ndarray,
    validation_split: float,
    test_split: float,
    seed: int,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    if validation_split + test_split >= 1:
        raise ValueError("validation_split + test_split must be less than 1.")

    class_indices = np.argmax(y, axis=1)
    rng = np.random.default_rng(seed)

    train_indices: list[int] = []
    val_indices: list[int] = []
    test_indices: list[int] = []

    for class_index in sorted(set(class_indices.tolist())):
        indices = np.where(class_indices == class_index)[0]
        rng.shuffle(indices)

        total = len(indices)
        test_count = max(1, int(round(total * test_split)))
        val_count = max(1, int(round(total * validation_split)))

        if test_count + val_count >= total:
            overflow = test_count + val_count - (total - 1)
            if overflow > 0:
                if val_count >= test_count:
                    val_count = max(1, val_count - overflow)
                else:
                    test_count = max(1, test_count - overflow)

        train_count = total - test_count - val_count
        if train_count <= 0:
            raise ValueError(f"Not enough samples for class index {class_index} to split train/val/test.")

        test_indices.extend(indices[:test_count].tolist())
        val_indices.extend(indices[test_count : test_count + val_count].tolist())
        train_indices.extend(indices[test_count + val_count :].tolist())

    rng.shuffle(train_indices)
    rng.shuffle(val_indices)
    rng.shuffle(test_indices)

    x_train = x[train_indices]
    y_train = y[train_indices]
    x_val = x[val_indices]
    y_val = y[val_indices]
    x_test = x[test_indices]
    y_test = y[test_indices]

    return x_train, y_train, x_val, y_val, x_test, y_test


def normalize_datasets(
    x_train: np.ndarray,
    x_val: np.ndarray,
    x_test: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    mean = np.mean(x_train, axis=(0, 1), keepdims=True)
    std = np.std(x_train, axis=(0, 1), keepdims=True)
    std = np.where(std < 1e-6, 1.0, std)

    x_train = (x_train - mean) / std
    x_val = (x_val - mean) / std
    x_test = (x_test - mean) / std
    return x_train, x_val, x_test


def build_model(num_actions: int, learning_rate: float, recurrent_dropout: float) -> tf.keras.Model:
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(SEQUENCE_LENGTH, FEATURE_SIZE)),
            tf.keras.layers.LSTM(
                96,
                return_sequences=True,
                dropout=0.2,
                recurrent_dropout=recurrent_dropout,
            ),
            tf.keras.layers.LSTM(
                64,
                dropout=0.2,
                recurrent_dropout=recurrent_dropout,
            ),
            tf.keras.layers.Dense(64, activation="relu"),
            tf.keras.layers.Dropout(0.35),
            tf.keras.layers.Dense(32, activation="relu"),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(num_actions, activation="softmax"),
        ]
    )
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
        loss="categorical_crossentropy",
        metrics=["categorical_accuracy"],
    )
    return model


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Retrain the action detection LSTM model.")
    parser.add_argument("--actions", nargs="+", default=list(ACTIONS))
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--output-model", type=Path, default=DEFAULT_OUTPUT_MODEL)
    parser.add_argument("--epochs", type=int, default=200)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--validation-split", type=float, default=0.15)
    parser.add_argument("--test-split", type=float, default=0.15)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--learning-rate", type=float, default=3e-4)
    parser.add_argument("--recurrent-dropout", type=float, default=0.15)
    parser.add_argument("--quiet", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    x, y = load_dataset(args.data_dir, args.actions, SEQUENCE_LENGTH)
    x_train, y_train, x_val, y_val, x_test, y_test = split_dataset(
        x=x,
        y=y,
        validation_split=args.validation_split,
        test_split=args.test_split,
        seed=args.seed,
    )
    x_train, x_val, x_test = normalize_datasets(x_train, x_val, x_test)

    tf.keras.utils.set_random_seed(args.seed)
    model = build_model(
        len(args.actions),
        learning_rate=args.learning_rate,
        recurrent_dropout=args.recurrent_dropout,
    )
    ensure_directory(args.output_model.parent)

    checkpoint_path = args.output_model.with_suffix(".best.keras")
    callbacks: list[tf.keras.callbacks.Callback] = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_categorical_accuracy",
            patience=25,
            restore_best_weights=True,
            mode="max",
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=6,
            min_lr=1e-5,
        ),
        tf.keras.callbacks.ModelCheckpoint(
            filepath=checkpoint_path,
            monitor="val_categorical_accuracy",
            save_best_only=True,
            mode="max",
        ),
    ]

    model.fit(
        x_train,
        y_train,
        validation_data=(x_val, y_val),
        epochs=args.epochs,
        batch_size=args.batch_size,
        verbose=0 if args.quiet else 1,
        callbacks=callbacks,
    )

    if checkpoint_path.exists():
        model = tf.keras.models.load_model(checkpoint_path)

    test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)
    model.save(args.output_model)

    summary = DatasetSummary(
        samples=int(len(x)),
        actions=args.actions,
        sequence_length=SEQUENCE_LENGTH,
        feature_size=FEATURE_SIZE,
        train_samples=int(len(x_train)),
        validation_samples=int(len(x_val)),
        test_samples=int(len(x_test)),
    )
    metadata = {
        **asdict(summary),
        "test_loss": float(test_loss),
        "test_accuracy": float(test_accuracy),
        "output_model": str(args.output_model),
        "source_data_dir": str(args.data_dir),
    }
    write_sidecar_files(args.actions, metadata, model_path=args.output_model)

    print("Saved retrained model to:", args.output_model)
    print("Test accuracy:", f"{test_accuracy:.4f}")


if __name__ == "__main__":
    main()
