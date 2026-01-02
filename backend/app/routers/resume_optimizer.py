from fastapi import APIRouter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.models.requests import JobFitRequest
from app.utils.ai_common import MAX_CHARS

router = APIRouter()

@router.post("/resume-optimizer")
def resume_optimizer(data: JobFitRequest):
    try:
        resume = data.resume[:MAX_CHARS]
        jd = data.job_description[:MAX_CHARS]

        if not resume or not jd:
            return {
                "ats_score": 0,
                "missing_keywords": [],
                "suggestions": [],
                "message": "Resume or job description is empty"
            }

        keywords = list(set(jd.lower().split()))

        vectorizer = TfidfVectorizer(
            stop_words="english",
            vocabulary=keywords
        )

        vectors = vectorizer.fit_transform([resume, jd])
        similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

        missing_keywords = [k for k in keywords if k not in resume.lower()]
        ats = round(similarity * 100, 2)

        return {
            "ats_score": ats,
            "missing_keywords": missing_keywords[:10],
            "suggestions": [
                f"Add '{k}' naturally to improve keyword match."
                for k in missing_keywords[:5]
            ],
            "message": "Optimize your resume keywords for better ATS matching"
        }

    except Exception as e:
        return {"error": str(e)}
