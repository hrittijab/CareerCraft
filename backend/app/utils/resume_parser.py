import pdfplumber
import docx2txt

def extract_text_from_pdf(file_path: str) -> str:
    with pdfplumber.open(file_path) as pdf:
        return " ".join(page.extract_text() for page in pdf.pages if page.extract_text())

def extract_text_from_docx(file_path: str) -> str:
    return docx2txt.process(file_path)
