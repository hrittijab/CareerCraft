from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_resume_optimizer_valid():
    res = client.post("/ai/resume-optimizer", json={
        "resume": "Python developer",
        "job_description": "Python AWS Docker"
    })
    data = res.json()
    assert "ats_score" in data
    assert isinstance(data["missing_keywords"], list)
    assert 0 <= data["ats_score"] <= 100


def test_resume_optimizer_empty_resume():
    res = client.post("/ai/resume-optimizer", json={
        "resume": "",
        "job_description": "Python developer"
    })
    assert res.json()["ats_score"] == 0


def test_resume_optimizer_empty_job_description():
    res = client.post("/ai/resume-optimizer", json={
        "resume": "Python developer",
        "job_description": ""
    })
    assert res.json()["ats_score"] == 0
