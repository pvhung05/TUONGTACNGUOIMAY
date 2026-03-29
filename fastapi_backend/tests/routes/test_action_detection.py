from fastapi.testclient import TestClient

from app.main import app


def test_action_detection_route(monkeypatch):
    from app.routes import action_detection

    def fake_predict(sequence):
        assert len(sequence) == 30
        assert len(sequence[0]) == 1662
        return {
            "label": "hello",
            "confidence": 0.91,
            "scores": {"hello": 0.91, "thanks": 0.06, "iloveyou": 0.03},
        }

    monkeypatch.setattr(action_detection._predictor, "predict", fake_predict)

    client = TestClient(app)
    response = client.post(
        "/v1/action-detection/sign-to-text",
        json={"sequence": [[0.0] * 1662 for _ in range(30)]},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["result"]["label"] == "hello"


def test_action_detection_model_info_route(monkeypatch):
    from app.routes import action_detection

    monkeypatch.setattr(action_detection._predictor, "model_path", action_detection.Path("action-word10.h5"))
    monkeypatch.setattr(
        action_detection._predictor,
        "_actions",
        ["yes", "no", "help"],
    )
    monkeypatch.setattr(
        action_detection._predictor,
        "_metadata",
        {
            "sequence_length": 30,
            "feature_size": 1662,
            "samples": 88,
            "test_accuracy": 0.1538,
            "source_data_dir": "training/datasets/action_detection_word10",
        },
    )

    client = TestClient(app)
    response = client.get("/v1/action-detection/model-info")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["result"]["model_name"] == "action-word10.h5"
    assert payload["result"]["labels"] == ["yes", "no", "help"]
    assert payload["result"]["sample_count"] == 88


def test_action_detection_dataset_route(tmp_path, monkeypatch):
    from app.routes import action_detection

    monkeypatch.setattr(action_detection, "DEFAULT_DATA_DIR", tmp_path)

    client = TestClient(app)
    response = client.post(
        "/v1/action-detection/dataset",
        json={"action": "hello", "sequence": [[0.0] * 1662 for _ in range(30)]},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["result"]["action"] == "hello"
    assert payload["result"]["frame_count"] == 30
    assert (tmp_path / "hello" / "0" / "0.npy").exists()
