from pydantic import BaseModel, Field


class ActionDetectionRequest(BaseModel):
    sequence: list[list[float]] = Field(
        ..., description="Sequence of 30 frames, each frame containing 1662 holistic keypoint values."
    )


class ActionDetectionResult(BaseModel):
    label: str
    confidence: float
    scores: dict[str, float]


class ActionDetectionResponse(BaseModel):
    success: bool = True
    result: ActionDetectionResult


class ActionDetectionModelInfoResult(BaseModel):
    model_name: str
    labels: list[str]
    sequence_length: int
    feature_size: int
    sample_count: int | None = None
    test_accuracy: float | None = None
    source_data_dir: str | None = None


class ActionDetectionModelInfoResponse(BaseModel):
    success: bool = True
    result: ActionDetectionModelInfoResult


class ActionDetectionDatasetSaveRequest(BaseModel):
    action: str = Field(..., description="Action label, for example hello, thanks, or iloveyou.")
    sequence: list[list[float]] = Field(
        ..., description="Sequence of 30 frames, each frame containing 1662 holistic keypoint values."
    )


class ActionDetectionDatasetSaveResult(BaseModel):
    action: str
    sequence_index: int
    frame_count: int
    saved_dir: str


class ActionDetectionDatasetSaveResponse(BaseModel):
    success: bool = True
    result: ActionDetectionDatasetSaveResult


class TextToSignRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Free-form English text to translate into sign video.")
    spoken_language: str | None = Field(default=None, description="Spoken language code, for example en.")
    signed_language: str | None = Field(default=None, description="Signed language code, for example ase.")


class TextToSignResult(BaseModel):
    input_text: str
    normalized_text: str
    spoken_language: str
    signed_language: str
    source: str
    video_url: str
    pose_url: str | None = None


class TextToSignResponse(BaseModel):
    success: bool = True
    result: TextToSignResult
