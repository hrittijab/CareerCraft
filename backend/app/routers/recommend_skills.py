from fastapi import APIRouter

from sentence_transformers import util

from app.models.requests import RecommendationRequest
from app.utils.ai_common import (
    MAX_CHARS,
    SKILLS_LIST,
    SKILLS_EMBEDDINGS,
    embed_text,
    skill_in_text,
)

router = APIRouter()

@router.post("/recommend-skills")
def recommend_skills(data: RecommendationRequest):
    try:
        resume = data.resume[:MAX_CHARS]
        jd = data.job_description[:MAX_CHARS]

        resume_skills = [s for s in SKILLS_LIST if skill_in_text(s, resume)]
        job_skills = [s for s in SKILLS_LIST if skill_in_text(s, jd)]

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
