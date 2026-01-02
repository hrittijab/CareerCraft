import pdfplumber
import docx2txt
from docx import Document
import pytesseract
from pdf2image import convert_from_bytes
import os


def extract_text_from_pdf_path(file_path: str) -> str:
    """Text-based PDFs"""
    with pdfplumber.open(file_path) as pdf:
        return " ".join(
            page.extract_text()
            for page in pdf.pages
            if page.extract_text()
        )


def extract_text_from_docx_path(file_path: str) -> str:
    """DOCX via path"""
    return docx2txt.process(file_path)


def extract_text_from_docx_file(file) -> str:
    """DOCX via file-like object"""
    doc = Document(file)
    return "\n".join(p.text for p in doc.paragraphs)


def ocr_pdf_bytes(file_bytes: bytes) -> str:
    """Scanned PDFs (OCR fallback)"""
    images = convert_from_bytes(file_bytes)
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img)
    return text
