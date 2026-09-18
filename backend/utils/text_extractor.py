import io
import docx
import pypdf
from fastapi import HTTPException, UploadFile


async def extract_text_from_file(file: UploadFile) -> str:
    filename = file.filename.lower()
    content = await file.read()
    extracted_text = ""

    try:
        if filename.endswith(".pdf"):
            reader = pypdf.PdfReader(io.BytesIO(content))
            pages_text = [p.extract_text() for p in reader.pages if p.extract_text()]
            extracted_text = "\n".join(pages_text)
        elif filename.endswith(".docx"):
            doc = docx.Document(io.BytesIO(content))
            paragraphs = [p.text for p in doc.paragraphs if p.text]
            extracted_text = "\n".join(paragraphs)
        else:
            extracted_text = content.decode("utf-8", errors="ignore")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to extract text from '{file.filename}': {e}"
        )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail=f"File '{file.filename}' contains no readable text content."
        )

    return extracted_text.strip()
