from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ats_valid_input():
    res = client.post("/ai/ats-score", json={
        "resume": "Python developer with FastAPI and AWS",
        "job_description": "Looking for a Python developer with FastAPI experience"
    })

    assert res.status_code == 200
    data = res.json()

    assert "ats_score" in data
    assert isinstance(data["ats_score"], (int, float))
    assert 0 <= data["ats_score"] <= 100


def test_ats_empty_resume():
    res = client.post("/ai/ats-score", json={
        "resume": "",
        "job_description": "Python developer"
    })

    assert res.status_code == 200
    assert 0 <= res.json()["ats_score"] <= 100


def test_ats_empty_job_description():
    res = client.post("/ai/ats-score", json={
        "resume": "Python developer",
        "job_description": ""
    })

    assert res.status_code == 200
    assert 0 <= res.json()["ats_score"] <= 100


def test_ats_both_empty():
    res = client.post("/ai/ats-score", json={
        "resume": "",
        "job_description": ""
    })

    assert res.status_code == 200
    assert 0 <= res.json()["ats_score"] <= 100


def test_ats_short_resume():
    res = client.post("/ai/ats-score", json={
        "resume": "Student",
        "job_description": "Senior Software Engineer with Python, AWS, Docker"
    })

    assert res.status_code == 200
    assert 0 <= res.json()["ats_score"] <= 100


def test_ats_non_technical_jd():
    res = client.post("/ai/ats-score", json={
        "resume": "Python developer",
        "job_description": "Marketing manager with social media experience"
    })

    assert res.status_code == 200
    assert 0 <= res.json()["ats_score"] <= 100


def test_ats_long_input_trimmed():
    long_text = "Python " * 5000

    res = client.post("/ai/ats-score", json={
        "resume": long_text,
        "job_description": long_text
    })

    assert res.status_code == 200
    assert 0 <= res.json()["ats_score"] <= 100


def test_ats_score_never_out_of_bounds():
    res = client.post("/ai/ats-score", json={
        "resume": "Java developer",
        "job_description": "Java developer"
    })

    score = res.json()["ats_score"]
    assert 0 <= score <= 100
