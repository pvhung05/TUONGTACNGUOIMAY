from fastapi.testclient import TestClient

from app.main import app


def test_text_to_sign_route_returns_sign_mt_video_and_pose_urls():
    client = TestClient(app)
    response = client.post(
        "/v1/action-detection/text-to-sign",
        json={"text": "Hello and thank you"},
    )

    assert response.status_code == 200
    payload = response.json()

    assert payload["success"] is True
    assert payload["result"]["source"] == "sign-mt"
    assert payload["result"]["spoken_language"] == "en"
    assert payload["result"]["signed_language"] == "ase"
    assert "spoken_text_to_signed_video" in payload["result"]["video_url"]
    assert "spoken_text_to_signed_pose" in payload["result"]["pose_url"]
    assert "text=Hello+and+thank+you" in payload["result"]["video_url"]


def test_text_to_sign_route_accepts_language_overrides():
    client = TestClient(app)
    response = client.post(
        "/v1/action-detection/text-to-sign",
        json={"text": "Nice to meet you", "spoken_language": "en", "signed_language": "bfi"},
    )

    assert response.status_code == 200
    payload = response.json()

    assert payload["result"]["spoken_language"] == "en"
    assert payload["result"]["signed_language"] == "bfi"
    assert "signed=bfi" in payload["result"]["video_url"]
