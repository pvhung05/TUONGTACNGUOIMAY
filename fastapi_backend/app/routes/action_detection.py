from pathlib import Path
import numpy as np

from fastapi import APIRouter
from fastapi import HTTPException

from app.schemas import (
    ActionDetectionDatasetSaveRequest,
    ActionDetectionDatasetSaveResponse,
    ActionDetectionDatasetSaveResult,
    ActionDetectionModelInfoResponse,
    ActionDetectionModelInfoResult,
    ActionDetectionRequest,
    ActionDetectionResponse,
    ActionDetectionResult,
    TextToSignRequest,
    TextToSignResponse,
    TextToSignResult,
)
from app.services.action_detection_predictor import ActionDetectionPredictor
from app.services.text_to_sign_translator import TextToSignTranslator
from training.action_detection.common import ACTIONS, DEFAULT_DATA_DIR, FEATURE_SIZE, next_sequence_index

router = APIRouter(prefix="/v1/action-detection", tags=["action-detection"])

model_dir = Path(__file__).resolve().parent.parent / "ml_models" / "action_detection"


def resolve_active_model_path() -> Path:
    for candidate_name in ("action-word10.h5", "action.h5"):
        candidate = model_dir / candidate_name
        if candidate.exists():
            return candidate

    raise RuntimeError("No action-detection model file was found.")


default_model = resolve_active_model_path()

_predictor = ActionDetectionPredictor(default_model)
_text_to_sign_translator = TextToSignTranslator()


@router.post("/sign-to-text", response_model=ActionDetectionResponse)
async def sign_to_text(request: ActionDetectionRequest) -> ActionDetectionResponse:
    result = _predictor.predict(request.sequence)
    return ActionDetectionResponse(result=ActionDetectionResult(**result))


@router.get("/model-info", response_model=ActionDetectionModelInfoResponse)
async def model_info() -> ActionDetectionModelInfoResponse:
    metadata = _predictor.metadata
    sample_count = metadata.get("samples")
    test_accuracy = metadata.get("test_accuracy")
    source_data_dir = metadata.get("source_data_dir")

    return ActionDetectionModelInfoResponse(
        result=ActionDetectionModelInfoResult(
            model_name=_predictor.model_path.name,
            labels=_predictor.actions,
            sequence_length=int(metadata.get("sequence_length", _predictor.SEQUENCE_LENGTH)),
            feature_size=int(metadata.get("feature_size", _predictor.FEATURE_SIZE)),
            sample_count=sample_count if isinstance(sample_count, int) else None,
            test_accuracy=float(test_accuracy) if isinstance(test_accuracy, (int, float)) else None,
            source_data_dir=source_data_dir if isinstance(source_data_dir, str) else None,
        )
    )


@router.post("/text-to-sign", response_model=TextToSignResponse)
async def text_to_sign(request: TextToSignRequest) -> TextToSignResponse:
    result = _text_to_sign_translator.translate(
        request.text,
        spoken_language=request.spoken_language,
        signed_language=request.signed_language,
    )
    return TextToSignResponse(result=TextToSignResult(**result))


@router.post("/dataset", response_model=ActionDetectionDatasetSaveResponse)
async def save_dataset_sequence(
    request: ActionDetectionDatasetSaveRequest,
) -> ActionDetectionDatasetSaveResponse:
    if request.action not in ACTIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported action '{request.action}'.")

    if len(request.sequence) != 30:
        raise HTTPException(status_code=400, detail="Expected exactly 30 frames per sequence.")

    frame_lengths = {len(frame) for frame in request.sequence}
    if frame_lengths != {FEATURE_SIZE}:
        raise HTTPException(
            status_code=400,
            detail=f"Expected every frame to contain {FEATURE_SIZE} values.",
        )

    sequence_index = next_sequence_index(DEFAULT_DATA_DIR, request.action)
    sequence_dir = DEFAULT_DATA_DIR / request.action / str(sequence_index)
    sequence_dir.mkdir(parents=True, exist_ok=True)

    for frame_num, frame in enumerate(request.sequence):
        np.save(sequence_dir / f"{frame_num}.npy", np.asarray(frame, dtype=np.float32))

    return ActionDetectionDatasetSaveResponse(
        result=ActionDetectionDatasetSaveResult(
            action=request.action,
            sequence_index=sequence_index,
            frame_count=len(request.sequence),
            saved_dir=str(sequence_dir),
        )
    )
