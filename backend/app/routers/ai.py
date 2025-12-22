from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import PyPDF2
from docx import Document
import pytesseract
from pdf2image import convert_from_bytes

router = APIRouter()



class JobFitRequest(BaseModel):
    resume: str
    job_description: str


class RecommendationRequest(BaseModel):
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
        "message": "Higher score means a stronger match "
    }




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

        resume_skills = [skills_list[i] for i, s in enumerate(resume_scores) if s > 0.3]
        job_skills = [skills_list[i] for i, s in enumerate(job_scores) if s > 0.3]

        matched = list(set(resume_skills) & set(job_skills))
        missing = list(set(job_skills) - set(resume_skills))
        match_percent = (len(matched) / len(job_skills) * 100) if job_skills else 0

        return {
            "resume_skills": resume_skills,
            "job_skills": job_skills,
            "matched_skills": matched,
            "missing_skills": missing,
            "match_percent": round(match_percent, 2)
        }

    except Exception as e:
        return {"error": str(e)}




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

        resume_skills = [skills_list[i] for i, s in enumerate(resume_scores) if s > 0.3]
        job_skills = [skills_list[i] for i, s in enumerate(job_scores) if s > 0.3]

        matched = set(resume_skills) & set(job_skills)
        missing = list(set(job_skills) - set(resume_skills))

        current_match = (len(matched) / len(job_skills) * 100) if job_skills else 0

        ranked_missing = sorted(
            [(skill, float(job_scores[skills_list.index(skill)])) for skill in missing],
            key=lambda x: x[1],
            reverse=True
        )

        recommendations = []
        for skill, importance in ranked_missing[:3]:
            boost = (1 / len(job_skills)) * 100 if job_skills else 0

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

        return {
            "matched_skills": list(matched),
            "missing_skills": missing,
            "recommendations": recommendations,
            "current_match_percent": round(current_match, 2),
            "message": "Skill recommendations generated successfully"
        }

    except Exception as e:
        return {"error": str(e)}




@router.post("/resume-optimizer")
def resume_optimizer(data: JobFitRequest):
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import re

    try:
        keywords = list(set(re.findall(r"\b[a-zA-Z]+\b", data.job_description.lower())))

        vectorizer = TfidfVectorizer(stop_words="english", vocabulary=keywords)
        vectors = vectorizer.fit_transform([data.resume, data.job_description])
        similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

        missing_keywords = [k for k in keywords if k not in data.resume.lower()]
        ats_score = round(similarity * 100, 2)

        return {
            "ats_score": ats_score,
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
