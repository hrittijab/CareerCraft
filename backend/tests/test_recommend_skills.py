from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)



def test_recommend_skills_basic():
    res = client.post("/ai/recommend-skills", json={
        "resume": "Python developer",
        "job_description": "Python AWS Docker"
    })
    data = res.json()
    assert "recommendations" in data
    assert 0 <= data["current_match_percent"] <= 100


def test_recommend_skills_no_skills_in_jd():
    res = client.post("/ai/recommend-skills", json={
        "resume": "Python developer",
        "job_description": "Leadership role"
    })
    assert res.json()["current_match_percent"] == 0


def test_recommend_skills_all_skills_matched():
    res = client.post("/ai/recommend-skills", json={
        "resume": "Python AWS Docker",
        "job_description": "Python AWS Docker"
    })
    assert res.json()["current_match_percent"] == 100
