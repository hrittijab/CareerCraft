from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    auth,
    profile,
    llm,
    job_fit,
    skill_gap,
    ats,
    resume_optimizer,
    resume_parser,
    recommend_skills,
)

app = FastAPI(
    title="CareerCraft API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])

app.include_router(job_fit.router, prefix="/ai", tags=["AI/ML"])
app.include_router(skill_gap.router, prefix="/ai", tags=["AI/ML"])
app.include_router(ats.router, prefix="/ai", tags=["AI/ML"])
app.include_router(resume_optimizer.router, prefix="/ai", tags=["AI/ML"])
app.include_router(resume_parser.router, prefix="/ai", tags=["AI/ML"])
app.include_router(recommend_skills.router, prefix="/ai", tags=["AI/ML"])

app.include_router(llm.router, prefix="/llm", tags=["LLM"])

@app.get("/")
def root():
    return {"message": "CareerCraft backend is running"}
