from fastapi import APIRouter
from app.models.requests import JobFitRequest
from app.services.ats_scoring import ats_score
from app.utils.ai_common import MAX_CHARS, SKILLS_LIST

router = APIRouter()

@router.post("/ats-score")
def ats_score_endpoint(data: JobFitRequest):
    return ats_score(
        resume=data.resume[:MAX_CHARS],
        jd=data.job_description[:MAX_CHARS],
        skills_list=SKILLS_LIST
    )
