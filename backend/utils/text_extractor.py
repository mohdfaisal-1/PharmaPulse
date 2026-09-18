import io
import docx
import pypdf
from fastapi import UploadFile, HTTPException

async def extract_text_from_file(file: UploadFile) -> str:
    """
    Extract text content from uploaded PDF, DOCX, TXT, or EML files.
    """
    filename = file.filename.lower()
    content = await file.read()
    extracted_text = ""

    try:
        if filename.endswith(".pdf"):
            reader = pypdf.PdfReader(io.BytesIO(content))
            pages_text = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
            extracted_text = "\n".join(pages_text)

        elif filename.endswith(".docx"):
            doc = docx.Document(io.BytesIO(content))
            paragraphs = [p.text for p in doc.paragraphs if p.text]
            extracted_text = "\n".join(paragraphs)

        elif filename.endswith(".txt") or filename.endswith(".eml") or filename.endswith(".log"):
            extracted_text = content.decode("utf-8", errors="ignore")

        else:
            # Fallback text decoder
            extracted_text = content.decode("utf-8", errors="ignore")

    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Failed to extract text from file '{file.filename}': {str(e)}"
        )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail=f"File '{file.filename}' appears to be empty or contains unreadable content."
        )

    return extracted_text.strip()
