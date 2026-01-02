from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_job_fit_valid_input():
    res = client.post("/ai/job-fit", json={
        "resume": "Python developer with FastAPI",
        "job_description": "Looking for a Python developer"
    })
    assert res.status_code == 200
    score = res.json()["similarity_score"]
    assert 0 <= score <= 100


def test_job_fit_empty_resume():
    res = client.post("/ai/job-fit", json={
        "resume": "",
        "job_description": "Python developer"
    })
    assert res.json()["similarity_score"] == 0


def test_job_fit_empty_job_description():
    res = client.post("/ai/job-fit", json={
        "resume": "Python developer",
        "job_description": ""
    })
    assert res.json()["similarity_score"] == 0


def test_job_fit_both_empty():
    res = client.post("/ai/job-fit", json={
        "resume": "",
        "job_description": ""
    })
    assert res.json()["similarity_score"] == 0


def test_job_fit_long_input_trimmed():
    long_text = "Python " * 5000
    res = client.post("/ai/job-fit", json={
        "resume": long_text,
        "job_description": long_text
    })
    assert 0 <= res.json()["similarity_score"] <= 100
