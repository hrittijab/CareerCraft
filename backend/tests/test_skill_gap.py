from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_skill_gap_basic():
    res = client.post("/ai/smart-skill-gap", json={
        "resume": "Python AWS Docker developer",
        "job_description": "Python AWS Kubernetes"
    })
    data = res.json()
    assert "matched_skills" in data
    assert "missing_skills" in data
    assert 0 <= data["match_percent"] <= 100


def test_skill_gap_no_skills_in_jd():
    res = client.post("/ai/smart-skill-gap", json={
        "resume": "Python developer",
        "job_description": "Team leadership role"
    })
    assert res.json()["match_percent"] == 0


def test_skill_gap_resume_has_more_skills():
    res = client.post("/ai/smart-skill-gap", json={
        "resume": "Python AWS Docker Kubernetes",
        "job_description": "Python"
    })
    assert res.json()["match_percent"] == 100


def test_skill_gap_empty_inputs():
    res = client.post("/ai/smart-skill-gap", json={
        "resume": "",
        "job_description": ""
    })
    assert res.json()["match_percent"] == 0
