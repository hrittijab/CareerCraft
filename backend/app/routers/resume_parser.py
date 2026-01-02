from fastapi import APIRouter, UploadFile, File
import tempfile
import os
import PyPDF2

from app.utils.resume_parser import (
    extract_text_from_pdf_path,
    extract_text_from_docx_path,
    extract_text_from_docx_file,
    ocr_pdf_bytes,
)

router = APIRouter()

@router.post("/parse-resume-advanced")
async def parse_resume_advanced(file: UploadFile = File(...)):
    content = await file.read()

    if not content:
        return {"error": "Empty file uploaded"}

    suffix = os.path.splitext(file.filename)[1].lower()

    if suffix not in [".pdf", ".docx"]:
        return {"error": "Unsupported file type"}

    # DOCX
    if suffix == ".docx":
        text = extract_text_from_docx_file(file.file)
        if not text.strip():
            return {"error": "Could not extract resume text"}
        return {"raw_text": text}

    # PDF
    try:
        reader = PyPDF2.PdfReader(file.file)
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text()

        if not text.strip():
            text = ocr_pdf_bytes(content)

    except Exception:
        text = ocr_pdf_bytes(content)

    if not text.strip():
        return {"error": "Could not extract resume text"}

    return {"raw_text": text}

