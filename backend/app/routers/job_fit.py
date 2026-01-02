from fastapi import APIRouter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.models.requests import JobFitRequest
from app.utils.ai_common import MAX_CHARS

router = APIRouter()

@router.post("/job-fit")
def job_fit(data: JobFitRequest):
    resume = data.resume[:MAX_CHARS]
    jd = data.job_description[:MAX_CHARS]

    if not resume or not jd:
        return {"similarity_score": 0, "message": "Empty input"}

    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume, jd])
    similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

    return {
        "similarity_score": round(float(similarity) * 100, 2),
        "message": "Higher score means a stronger match"
    }
