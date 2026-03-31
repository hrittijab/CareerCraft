from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_cover_letter_valid_input():
    res = client.post("/llm/cover-letter", json={
        "resume": "Python developer with 3 years experience in FastAPI and AWS",
        "job_description": "Looking for a senior Python developer with FastAPI experience"
    })
    assert res.status_code == 200
    data = res.json()
    assert "cover_letter" in data
    assert isinstance(data["cover_letter"], str)
    assert len(data["cover_letter"]) > 0


def test_cover_letter_empty_resume():
    res = client.post("/llm/cover-letter", json={
        "resume": "",
        "job_description": "Looking for a Python developer"
    })
    assert res.status_code in [200, 422]


def test_cover_letter_empty_job_description():
    res = client.post("/llm/cover-letter", json={
        "resume": "Python developer with 3 years experience",
        "job_description": ""
    })
    assert res.status_code in [200, 422]


def test_cover_letter_both_empty():
    res = client.post("/llm/cover-letter", json={
        "resume": "",
        "job_description": ""
    })
    assert res.status_code in [200, 422]


def test_cover_letter_returns_string():
    res = client.post("/llm/cover-letter", json={
        "resume": "Python developer",
        "job_description": "Python developer role"
    })
    assert res.status_code == 200
    assert isinstance(res.json()["cover_letter"], str)


def test_cover_letter_long_input():
    long_text = "Python developer with FastAPI experience. " * 200
    res = client.post("/llm/cover-letter", json={
        "resume": long_text,
        "job_description": long_text
    })
    assert res.status_code == 200
    assert "cover_letter" in res.json()


def test_cover_letter_non_technical_jd():
    res = client.post("/llm/cover-letter", json={
        "resume": "Python developer with 3 years experience",
        "job_description": "Marketing manager with social media experience"
    })
    assert res.status_code == 200
    data = res.json()
    assert "cover_letter" in data
    assert len(data["cover_letter"]) > 0


def test_cover_letter_short_resume():
    res = client.post("/llm/cover-letter", json={
        "resume": "Student",
        "job_description": "Senior Software Engineer with Python and AWS"
    })
    assert res.status_code == 200
    assert "cover_letter" in res.json()