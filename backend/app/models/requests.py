from pydantic import BaseModel

class JobFitRequest(BaseModel):
    resume: str
    job_description: str

class RecommendationRequest(BaseModel):
    resume: str
    job_description: str
