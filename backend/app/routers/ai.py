from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from functools import lru_cache

import PyPDF2
from docx import Document
import pytesseract
from pdf2image import convert_from_bytes

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from sentence_transformers import SentenceTransformer, util

from app.services.ats_scoring import ats_score


MAX_CHARS = 2000

SKILLS_LIST = [
    "python", "java", "c++", "javascript", "react", "angular",
    "fastapi", "flask", "django", "aws", "azure", "gcp",
    "docker", "kubernetes", "sql", "mongodb", "dynamodb",
    "tensorflow", "pytorch", "nlp", "machine learning", "deep learning"
]

MODEL = SentenceTransformer("all-MiniLM-L6-v2")
SKILLS_EMBEDDINGS = MODEL.encode(SKILLS_LIST, convert_to_tensor=True)


@lru_cache(maxsize=128)
def embed_text(text: str):
    return MODEL.encode(text, convert_to_tensor=True)


router = APIRouter()


class JobFitRequest(BaseModel):
    resume: str
    job_description: str


class RecommendationRequest(BaseModel):
    resume: str
    job_description: str


@router.post("/job-fit")
def job_fit(data: JobFitRequest):
    resume = data.resume[:MAX_CHARS]
    jd = data.job_description[:MAX_CHARS]

    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume, jd])
    similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

    return {
        "similarity_score": round(float(similarity) * 100, 2),
        "message": "Higher score means a stronger match"
    }



def skill_in_text(skill: str, text: str) -> bool:
    return skill.lower() in text.lower()

@router.post("/smart-skill-gap")
def smart_skill_gap(data: JobFitRequest):
    try:
        resume = data.resume[:MAX_CHARS]
        jd = data.job_description[:MAX_CHARS]

        resume_skills = [
            s for s in SKILLS_LIST
            if skill_in_text(s, resume)
        ]

        job_skills = [
            s for s in SKILLS_LIST
            if skill_in_text(s, jd)
        ]

        matched = list(set(resume_skills) & set(job_skills))
        missing = list(set(job_skills) - set(resume_skills))
        match_percent = (
            round(len(matched) / len(job_skills) * 100, 2)
            if job_skills else 0
        )

        return {
            "resume_skills": resume_skills,
            "job_skills": job_skills,
            "matched_skills": matched,
            "missing_skills": missing,
            "match_percent": match_percent
        }

    except Exception as e:
        return {"error": str(e)}


@router.post("/ats-score")
def ats_score_endpoint(data: JobFitRequest):
    return ats_score(
        resume=data.resume[:MAX_CHARS],
        jd=data.job_description[:MAX_CHARS],
        skills_list=SKILLS_LIST
    )


@router.post("/resume-optimizer")
def resume_optimizer(data: JobFitRequest):
    try:
        resume = data.resume[:MAX_CHARS]
        jd = data.job_description[:MAX_CHARS]

        keywords = list(set(jd.lower().split()))

        vectorizer = TfidfVectorizer(stop_words="english", vocabulary=keywords)
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


def extract_text_from_docx(file):
    doc = Document(file)
    return "\n".join(p.text for p in doc.paragraphs)


def ocr_pdf(file_bytes):
    images = convert_from_bytes(file_bytes)
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img)
    return text


@router.post("/parse-resume-advanced")
async def parse_resume_advanced(file: UploadFile = File(...)):
    content = await file.read()
    text = ""

    if file.filename.lower().endswith(".pdf"):
        try:
            reader = PyPDF2.PdfReader(file.file)
            for page in reader.pages:
                if page.extract_text():
                    text += page.extract_text()
        except Exception:
            text = ocr_pdf(content)

    elif file.filename.lower().endswith(".docx"):
        text = extract_text_from_docx(file.file)

    if not text.strip():
        return {"error": "Could not extract resume text"}

    return {"raw_text": text}

@router.post("/recommend-skills")
def recommend_skills(data: RecommendationRequest):
    try:
        resume = data.resume[:MAX_CHARS]
        jd = data.job_description[:MAX_CHARS]

        def skill_in_text(skill: str, text: str) -> bool:
            return skill.lower() in text.lower()

        resume_skills = [
            s for s in SKILLS_LIST
            if skill_in_text(s, resume)
        ]

        job_skills = [
            s for s in SKILLS_LIST
            if skill_in_text(s, jd)
        ]

        if not job_skills:
            return {
                "matched_skills": [],
                "missing_skills": [],
                "recommendations": [],
                "current_match_percent": 0,
                "message": "No technical skills detected in the job description."
            }

        matched = list(set(resume_skills) & set(job_skills))
        missing = list(set(job_skills) - set(resume_skills))
        current_match = round(len(matched) / len(job_skills) * 100, 2)

        job_embedding = embed_text(jd)
        job_scores = util.cos_sim(job_embedding, SKILLS_EMBEDDINGS)[0]

        ranked_missing = sorted(
            [(skill, float(job_scores[SKILLS_LIST.index(skill)])) for skill in missing],
            key=lambda x: x[1],
            reverse=True
        )

        recommendations = []
        for skill, importance in ranked_missing[:3]:
            priority = (
                "High Priority" if importance > 0.5
                else "Medium Priority" if importance > 0.3
                else "Low Priority"
            )

            recommendations.append({
                "skill": skill,
                "boost_percent": round((1 / len(job_skills)) * 100, 2),
                "priority": priority
            })

        return {
            "matched_skills": matched,
            "missing_skills": missing,
            "recommendations": recommendations,
            "current_match_percent": current_match,
            "message": "Skill recommendations generated successfully"
        }

    except Exception as e:
        return {
            "matched_skills": [],
            "missing_skills": [],
            "recommendations": [],
            "current_match_percent": 0,
            "message": f"Error generating recommendations: {str(e)}"
        }

