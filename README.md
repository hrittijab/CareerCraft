# CareerCraft  
An AI-powered career assistant for resumes, ATS optimization, and interview preparation.

CareerCraft is a full-stack web application built to solve a real problem faced by students and early-career professionals: understanding how resumes are evaluated, how ATS systems work, and how to improve job readiness using AI in a practical, explainable way.

This project prioritizes **clarity, correctness, testing, and real-world usefulness** over flashy or opaque AI features.

---

## Why CareerCraft?

Many applicants struggle with:
- Low ATS scores without knowing why
- Overwhelming job descriptions
- Unclear skill expectations
- Weak resume bullet points
- Inefficient interview preparation

CareerCraft was created to:
- Explain *why* a resume matches or doesn’t
- Provide actionable, prioritized feedback
- Use AI responsibly and transparently
- Be beginner-friendly while technically sound

---

## What the App Does

### Resume & ATS Analysis
- Computes ATS match score (0–100)
- Compares resume and job description meaningfully
- Safely handles empty, short, or invalid inputs

### Skill Intelligence
- Identifies matched skills
- Detects missing skills
- Calculates skill match percentage
- Recommends high-impact skills to learn next

### Career Preparation
- Generates tailored cover letters
- Improves resume bullet points
- Creates interview questions from job descriptions
- Provides career advice based on resume + role

### Resume Utilities
- Parses PDF and DOCX resumes
- OCR fallback for scanned documents
- Extracts clean, usable text

### Management
- Tracks user history of actions and analyses

---

## Tech Stack

### Frontend
- Angular (standalone components)
- TypeScript
- RxJS
- Karma + Jasmine for testing

### Backend
- FastAPI
- Python 3.13
- scikit-learn
- Sentence Transformers
- TF-IDF + cosine similarity
- PyPDF2, python-docx, pytesseract

---

## Project Structure

careercraft/
├── backend/
│ ├── app/
│ │ ├── routers/
│ │ ├── services/
│ │ └── main.py
│ ├── tests/
│ │ └── test_ats.py
│ └── requirements.txt
│
├── frontend/
│ └── careercraft/
│ ├── src/app/pages/
│ ├── src/app/service/
│ ├── src/app/app.routes.ts
│ └── src/app/app.spec.ts
│
└── README.md



---

## How to Run the Project

### Backend

cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload



Backend runs at:
http://127.0.0.1:8000



---

### Frontend

cd frontend/careercraft
npm install
ng serve



Frontend runs at:
http://localhost:4200



---

## Testing Philosophy

CareerCraft follows a **realistic, user-focused testing approach**:
- Test what users can break
- Test edge cases before happy paths
- Avoid meaningless “always green” tests

Backend and frontend are tested independently and together.

---

## Backend Tests (Pytest)

Backend tests focus on **correctness, safety, and edge-case handling**.

### What Is Tested

- ATS score with valid input
- Empty resume handling
- Empty job description handling
- Both inputs empty (graceful handling)
- Very short resumes
- Non-technical job descriptions
- Extremely long inputs (trimmed safely)
- ATS score never exceeding 0–100

### Why This Matters

Real ATS systems often fail silently.  
These tests ensure:
- No crashes
- No invalid scores
- Predictable behavior under all conditions

### Run Backend Tests

cd backend
.venv\Scripts\activate
python -m pytest -v



---

## Frontend Tests (Angular)

Frontend tests focus on **user behavior and UI logic**, not internal implementation.

### What Is Tested

- Component creation
- Input validation (empty fields)
- API calls triggered only when inputs are valid
- UI updates after API responses
- Error handling without crashes
- Standalone component behavior (no NgModules)

### Why This Matters

Most frontend bugs come from:
- Incorrect state handling
- Uncontrolled API calls
- UI not updating after async operations

These tests prevent those failures.

### Run Frontend Tests

cd frontend/careercraft
npm test



---

## Pages Implemented

- Home Page
- ATS Score Page
- Career Advice Page
- Job Fit Page
- Skill Gap Analysis Page
- Skill Recommendation Page
- Cover Letter Generator
- Interview Questions Generator
- Resume Parser
- Resume Bullet Improvement
- History Page

All pages include:
- Input validation
- Loading states
- Error handling
- Consistent UX patterns

---

## Key Design Decisions

- Standalone Angular components for cleaner architecture
- Service-based API abstraction
- ML logic isolated in backend services
- No silent failures
- Human-readable AI output

---

## Future Improvements

- User authentication
- Persistent history storage (database)
- Export reports as PDF
- Skill learning roadmaps
- Cloud resume uploads

---

