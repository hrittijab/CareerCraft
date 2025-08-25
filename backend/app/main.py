from fastapi import FastAPI
from app.routers import auth, profile, ai, llm

app = FastAPI(title="CareerCraft API", version="1.0")

# Register routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])
app.include_router(ai.router, prefix="/ai", tags=["AI/ML"])
app.include_router(llm.router, prefix="/llm", tags=["LLM"])

@app.get("/")
def root():
    return {"message": "CareerCraft backend is running 🚀"}
