from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_resume_parser_invalid_file_type():
    res = client.post(
        "/ai/parse-resume-advanced",
        files={"file": ("resume.txt", b"hello")}
    )
    assert "error" in res.json()


def test_resume_parser_empty_file():
    res = client.post(
        "/ai/parse-resume-advanced",
        files={"file": ("resume.pdf", b"")}
    )
    assert "error" in res.json()
