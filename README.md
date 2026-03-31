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
- Explain *why* a resume matches or doesn't
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
- Karma + Jasmine for unit testing
- Cypress for E2E testing

### Backend
- FastAPI
- Python 3.13
- scikit-learn
- Sentence Transformers
- TF-IDF + cosine similarity
- PyPDF2, python-docx, pytesseract

---

## Project Structure
```
careercraft/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   └── main.py
│   ├── tests/
│   │   └── test_ats.py
│   └── requirements.txt
│
├── frontend/
│   └── careercraft/
│       ├── src/app/pages/
│       ├── src/app/service/
│       ├── src/app/app.routes.ts
│       └── src/app/app.spec.ts
│
├── cypress/
│   ├── e2e/
│   │   ├── home.cy.js
│   │   ├── ats-score.cy.js
│   │   ├── cover-letter.cy.js
│   │   ├── job-fit.cy.js
│   │   ├── skill-gap.cy.js
│   │   ├── skill-recommendation.cy.js
│   │   ├── career-advice.cy.js
│   │   ├── interview-questions.cy.js
│   │   ├── improve-bullet.cy.js
│   │   ├── resume-parser.cy.js
│   │   └── history.cy.js
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── cypress.config.js
└── README.md
```

---

## How to Run the Project

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

---

### Frontend
```bash
cd frontend/careercraft
npm install
ng serve
```

Frontend runs at: `http://localhost:4200`

---

## Testing Philosophy

CareerCraft follows a **realistic, user-focused testing approach** across three layers:

| Layer | Framework | Focus |
|-------|-----------|-------|
| Backend unit tests | Pytest | Correctness, edge cases, safety |
| Frontend unit tests | Karma + Jasmine | Component logic, state, async |
| E2E tests | Cypress | Full user flows, API integration |

Core principles:
- Test what users can break
- Test edge cases before happy paths
- Avoid meaningless "always green" tests
- Each layer tests what it is best suited for

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
These tests ensure no crashes, no invalid scores, and predictable behavior under all conditions.

### Run Backend Tests
```bash
cd backend
.venv\Scripts\activate
python -m pytest -v
```

---

## Frontend Unit Tests (Karma + Jasmine)

Frontend unit tests focus on **component logic and UI behavior** in isolation.

### What Is Tested

- Component creation
- Input validation (empty fields)
- API calls triggered only when inputs are valid
- UI updates after API responses
- Error handling without crashes
- Standalone component behavior (no NgModules)

### Run Frontend Unit Tests
```bash
cd frontend/careercraft
npm test
```

---

## E2E Tests (Cypress)

E2E tests cover **full user flows** from the browser through to the API, testing every page of the application.

### E2E Coverage

| Page | What Is Tested |
|------|----------------|
| Home | Layout, navigation to all pages |
| ATS Score | Valid input, loading state, button disabled, error handling |
| Cover Letter | Valid input, loading state, button disabled, error handling |
| Job Fit | Valid input, loading state, button disabled, error handling |
| Skill Gap | Valid input, loading state, clear button, empty results |
| Skill Recommendations | Valid input, loading state, no recommendations state |
| Career Advice | Valid input, loading state, partial input validation |
| Interview Questions | Valid input, loading state, empty results state |
| Improve Bullet | Valid input, loading state, button disabled, error handling |
| Resume Parser | PDF/DOCX upload, loading state, unsupported file type, error handling |
| History | Empty state, populated after completed analysis |

### E2E Test Patterns

- **HTTP interception** — all API calls intercepted with `cy.intercept` to control responses
- **Loading state assertions** — button disabled and loading message visible during requests
- **Network delay simulation** — `res.setDelay()` forces async states to be testable
- **Error handling** — 500 responses verified to trigger correct user-facing alerts
- **Input validation** — empty and partial inputs verified to block submission
- **Edge cases** — unsupported file types, empty API result arrays, zero scores

### Run E2E Tests

Requires both the frontend and backend to be running first.
```bash
# Open Cypress interactive UI
npx cypress open

# Run all tests headless
npx cypress run

# Run a single spec
npx cypress run --spec "cypress/e2e/ats-score.cy.js"
```

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

All pages include input validation, loading states, error handling, and consistent UX patterns.

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
- Cypress tests integrated into CI/CD pipeline