from fastapi import APIRouter
from pydantic import BaseModel
from huggingface_hub import InferenceClient

MAX_CHARS = 2000
DEFAULT_TEMP = 0.6

router = APIRouter()

client = InferenceClient(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    timeout=60
)


def truncate(text: str, limit: int = MAX_CHARS) -> str:
    return text[:limit].strip()


def call_huggingface(prompt: str, max_tokens: int):
    try:
        response = client.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=DEFAULT_TEMP,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error generating response: {str(e)}"


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
    resume = truncate(data.resume)
    jd = truncate(data.job_description)

    prompt = f"""
Write a COMPLETE, professional cover letter with:
- 1 introduction
- 2 concise body paragraphs
- 1 closing paragraph
- a polite sign-off

Do not stop mid-sentence.

Resume:
{resume}

Job Description:
{jd}
"""

    text = call_huggingface(prompt, max_tokens=900)
    return {"cover_letter": text}


@router.post("/interview-questions")
def generate_interview_questions(data: JobDescriptionRequest):
    jd = truncate(data.job_description)

    prompt = f"""
Generate exactly 5 technical interview questions
based on this job description.

Return each question on a new line.

Job Description:
{jd}
"""

    text = call_huggingface(prompt, max_tokens=400)
    questions = [q.strip("-• ") for q in text.split("\n") if q.strip()]

    return {"questions": questions[:5]}


@router.post("/interview-questions-advanced")
def interview_questions_advanced(data: InterviewQuestionRequest):
    resume = truncate(data.resume, 1500)
    jd = truncate(data.job_description, 1500)

    prompt = f"""
You are an interviewer.

Generate:
- 3 technical questions
- 1 behavioral question
- 1 resume-specific follow-up

Resume:
{resume}

Job Description:
{jd}
"""

    text = call_huggingface(prompt, max_tokens=500)
    questions = [q.strip("-• ") for q in text.split("\n") if q.strip()]

    return {"questions": questions[:5]}


@router.post("/career-advice")
def generate_career_advice(data: AdviceRequest):
    resume = truncate(data.resume)
    jd = truncate(data.job_description)

    prompt = f"""
Provide concise, actionable career advice for a candidate.

Resume:
{resume}

Job Description:
{jd}
"""

    text = call_huggingface(prompt, max_tokens=500)
    return {"advice": text}


@router.post("/improve-bullet")
def improve_bullet(data: BulletRequest):
    prompt = f"""
Rewrite this resume bullet to be:
- achievement-focused
- quantified
- concise (1–2 lines)

Bullet:
{data.text}
"""

    text = call_huggingface(prompt, max_tokens=150)
    return {"improved_bullet": text}


@router.post("/resume-structure")
def resume_structure(data: ResumeTextRequest):
    text = truncate(data.text, 2500)

    prompt = f"""
Extract and return the following fields as VALID JSON:
- Skills
- Education
- Work Experience
- Projects
- Certifications

Resume:
{text}
"""

    structured = call_huggingface(prompt, max_tokens=400)
    return {"structured_resume": structured}
