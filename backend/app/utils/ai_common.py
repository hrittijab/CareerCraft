from functools import lru_cache
from sentence_transformers import SentenceTransformer, util

MAX_CHARS = 2000

SKILLS_LIST = [
    "python", "java", "c++", "javascript", "react", "angular",
    "fastapi", "flask", "django", "aws", "azure", "gcp",
    "docker", "kubernetes", "sql", "mongodb", "dynamodb",
    "tensorflow", "pytorch", "nlp", "machine learning", "deep learning"
]

MODEL = SentenceTransformer("all-MiniLM-L6-v2")
SKILLS_EMBEDDINGS = MODEL.encode(SKILLS_LIST, convert_to_tensor=True)

@lru_cache(maxsize=128)
def embed_text(text: str):
    return MODEL.encode(text, convert_to_tensor=True)


def skill_in_text(skill: str, text: str) -> bool:
    return skill.lower() in text.lower()
