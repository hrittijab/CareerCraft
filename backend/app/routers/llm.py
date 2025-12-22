from fastapi import APIRouter
from pydantic import BaseModel
from huggingface_hub import InferenceClient

router = APIRouter()


client = InferenceClient(
    model="mistralai/Mistral-7B-Instruct-v0.2"
)

def call_huggingface(prompt: str, max_tokens: int = 300):
    try:
        response = client.chat_completion(
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=0.7
        )
        return {
            "text": response.choices[0].message.content.strip()
        }
    except Exception as e:
        return {"error": str(e)}


class CoverLetterRequest(BaseModel):
    resume: str
    job_description: str

class JobDescriptionRequest(BaseModel):
    job_description: str

class AdviceRequest(BaseModel):
    resume: str
    job_description: str

class InterviewQuestionRequest(BaseModel):
    resume: str
    job_description: str

class BulletRequest(BaseModel):
    text: str

class ResumeTextRequest(BaseModel):
    text: str



@router.post("/cover-letter")
def generate_cover_letter(data: CoverLetterRequest):
    prompt = f"""
Write a professional and concise cover letter.

Resume:
{data.resume}

Job Description:
{data.job_description}
"""
    result = call_huggingface(prompt)
    return {"cover_letter": result.get("text") or result}


@router.post("/interview-questions")
def generate_interview_questions(data: JobDescriptionRequest):
    prompt = f"""
Generate 5 technical interview questions for the following job description:

{data.job_description}
"""
    result = call_huggingface(prompt, max_tokens=200)

    if "text" in result:
        questions = [q.strip("-• ") for q in result["text"].split("\n") if q.strip()]
        return {"questions": questions[:5]}
    return result


@router.post("/interview-questions-advanced")
def interview_questions_advanced(data: InterviewQuestionRequest):
    prompt = f"""
You are an interviewer.

Based on the candidate's resume and the job description, generate:
- 3 technical interview questions
- 1 behavioral question
- 1 resume-specific follow-up question

Resume:
{data.resume}

Job Description:
{data.job_description}
"""
    result = call_huggingface(prompt, max_tokens=250)

    if "text" in result:
        questions = [q.strip("-• ") for q in result["text"].split("\n") if q.strip()]
        return {"questions": questions[:5]}
    return result


@router.post("/career-advice")
def generate_career_advice(data: AdviceRequest):
    prompt = f"""
Provide personalized career advice for a candidate with the following resume
who is applying for the given job.

Resume:
{data.resume}

Job Description:
{data.job_description}
"""
    result = call_huggingface(prompt)
    return {"advice": result.get("text") or result}


@router.post("/improve-bullet")
def improve_bullet(data: BulletRequest):
    prompt = f"""
Rewrite the following resume bullet point to be more achievement-focused,
quantified, and impact-driven.

Bullet point:
{data.text}
"""
    result = call_huggingface(prompt, max_tokens=150)
    return {"improved_bullet": result.get("text") or result}


@router.post("/resume-structure")
def resume_structure(data: ResumeTextRequest):
    prompt = f"""
Extract the following fields from this resume and return them as JSON:
- Skills
- Education
- Work Experience
- Projects
- Certifications

Resume:
{data.text}
"""
    result = call_huggingface(prompt, max_tokens=300)
    return {"structured_resume": result.get("text") or result}
