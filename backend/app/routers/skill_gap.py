from fastapi import APIRouter
from app.models.requests import JobFitRequest
from app.utils.ai_common import MAX_CHARS, SKILLS_LIST, skill_in_text

router = APIRouter()

@router.post("/smart-skill-gap")
def smart_skill_gap(data: JobFitRequest):
    resume = data.resume[:MAX_CHARS]
    jd = data.job_description[:MAX_CHARS]

    resume_skills = [s for s in SKILLS_LIST if skill_in_text(s, resume)]
    job_skills = [s for s in SKILLS_LIST if skill_in_text(s, jd)]

    matched = list(set(resume_skills) & set(job_skills))
    missing = list(set(job_skills) - set(resume_skills))

    match_percent = round(len(matched) / len(job_skills) * 100, 2) if job_skills else 0

    return {
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "matched_skills": matched,
        "missing_skills": missing,
        "match_percent": match_percent
    }
