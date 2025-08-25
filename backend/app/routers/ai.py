from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# -----------------------------
# Job Fit (TF-IDF similarity)
# -----------------------------
class JobFitRequest(BaseModel):
    resume: str
    job_description: str

@router.post("/job-fit")
def job_fit(data: JobFitRequest):
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([data.resume, data.job_description])
    similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

    return {
        "similarity_score": round(float(similarity) * 100, 2),
        "message": "Higher score means a stronger match ✅"
    }

# -----------------------------
# Smart Skill Gap (Embeddings)
# -----------------------------
@router.post("/smart-skill-gap")
def smart_skill_gap(data: JobFitRequest):
    try:
        from sentence_transformers import SentenceTransformer, util

        model = SentenceTransformer("all-MiniLM-L6-v2")

        skills_list = [
            "python", "java", "c++", "javascript", "react", "angular",
            "fastapi", "flask", "django", "aws", "azure", "gcp",
            "docker", "kubernetes", "sql", "mongodb", "dynamodb",
            "tensorflow", "pytorch", "nlp", "machine learning", "deep learning"
        ]

        resume_embedding = model.encode(data.resume, convert_to_tensor=True)
        job_embedding = model.encode(data.job_description, convert_to_tensor=True)
        skills_embeddings = model.encode(skills_list, convert_to_tensor=True)

        resume_scores = util.cos_sim(resume_embedding, skills_embeddings)[0]
        job_scores = util.cos_sim(job_embedding, skills_embeddings)[0]

        resume_skills = [skills_list[i] for i, score in enumerate(resume_scores) if score > 0.3]
        job_skills = [skills_list[i] for i, score in enumerate(job_scores) if score > 0.3]

        matched = set(resume_skills) & set(job_skills)
        missing = set(job_skills) - set(resume_skills)
        match_percent = (len(matched) / len(job_skills) * 100) if job_skills else 0

        return {
            "resume_skills": resume_skills,
            "job_skills": job_skills,
            "matched_skills": list(matched),
            "missing_skills": list(missing),
            "match_percent": round(match_percent, 2)
        }
    except Exception as e:
        return {"error": str(e)}

# -----------------------------
# Recommendations
# -----------------------------
class RecommendationRequest(BaseModel):
    resume: str
    job_description: str

@router.post("/recommend-skills")
def recommend_skills(data: RecommendationRequest):
    try:
        from sentence_transformers import SentenceTransformer, util

        model = SentenceTransformer("all-MiniLM-L6-v2")

        skills_list = [
            "python", "java", "c++", "javascript", "react", "angular",
            "fastapi", "flask", "django", "aws", "azure", "gcp",
            "docker", "kubernetes", "sql", "mongodb", "dynamodb",
            "tensorflow", "pytorch", "nlp", "machine learning", "deep learning"
        ]

        resume_embedding = model.encode(data.resume, convert_to_tensor=True)
        job_embedding = model.encode(data.job_description, convert_to_tensor=True)
        skills_embeddings = model.encode(skills_list, convert_to_tensor=True)

        resume_scores = util.cos_sim(resume_embedding, skills_embeddings)[0]
        job_scores = util.cos_sim(job_embedding, skills_embeddings)[0]

        resume_skills = [skills_list[i] for i, score in enumerate(resume_scores) if score > 0.3]
        job_skills = [skills_list[i] for i, score in enumerate(job_scores) if score > 0.3]

        matched = set(resume_skills) & set(job_skills)
        missing = list(set(job_skills) - set(resume_skills))

        current_match_percent = (len(matched) / len(job_skills) * 100) if job_skills else 0

        ranked_missing = sorted(
            [(skill, float(job_scores[skills_list.index(skill)])) for skill in missing],
            key=lambda x: x[1],
            reverse=True
        )

        recommendations = []
        for skill, importance in ranked_missing[:3]:
            new_match_percent = ((len(matched) + 1) / len(job_skills)) * 100
            boost = new_match_percent - current_match_percent

            # Priority assignment (looser thresholds)
            if importance > 0.5:
                priority = "High Priority"
            elif importance > 0.3:
                priority = "Medium Priority"
            else:
                priority = "Low Priority"

            recommendations.append({
                "skill": skill,
                "boost_percent": round(boost, 2),
                "priority": priority
            })

        # Build message dynamically
        high_priority = [r["skill"] for r in recommendations if r["priority"] == "High Priority"]
        medium_priority = [r["skill"] for r in recommendations if r["priority"] == "Medium Priority"]

        if high_priority:
            message = f"High Priority skills to learn: {', '.join(high_priority)}"
        elif medium_priority:
            message = f"Medium Priority skills to learn: {', '.join(medium_priority)}"
        else:
            message = f"Low Priority skills to learn: {', '.join([r['skill'] for r in recommendations])}"
        career_report = (
            f"Your current job match score is {round(current_match_percent, 2)}%. "
            f"By learning {', '.join([r['skill'] for r in recommendations])}, "
            f"you could raise your score to approximately {round(current_match_percent + sum([r['boost_percent'] for r in recommendations]), 2)}%. "
            f"These skills are considered {', '.join(set([r['priority'] for r in recommendations]))} for this role."
        )

        return {
        "matched_skills": list(matched),
        "missing_skills": missing,
        "recommendations": recommendations,
        "current_match_percent": round(current_match_percent, 2),
        "message": message,
        "career_report": career_report
}

    except Exception as e:
        return {"error": str(e)}
