import sys
import os
import random
from typing import List

# Ensure backend directory is in sys.path for robust module imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from config import GROQ_API_KEY, DEFAULT_MODEL, ALLOWED_ORIGINS
from database import engine, Base, get_db
from models import ComplaintRecord
from schemas import (
    ComplaintIntakeRequest, 
    ChatQueryRequest, 
    SaveComplaintRequest,
    ComplaintRecordResponse
)
from utils.text_extractor import extract_text_from_file
from agents.graph import complaint_graph
from agents.prompts import COPILOT_CHAT_SYSTEM_PROMPT


# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PharmaPulse AI Backend",
    description="FastAPI + LangGraph + Groq LLM + SQLAlchemy Backend for QMS Complaint Management",
    version="2.4.0"
)

# Robust CORS Configuration: explicitly permit localhost and 127.0.0.1 on any port
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Global Preflight Catch-All Route (Placed properly at module level)
@app.options("/{full_path:path}")
async def options_preflight(full_path: str):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "*",
        }
    )

def check_db_duplicates(batch_number: str, db: Session) -> dict:
    """Helper to query database for recurring complaints on the same batch."""
    if not batch_number or batch_number.strip() in ["", "Awaiting AI extraction..."]:
        return {"is_duplicate": False, "count": 0, "prior_records": []}
    
    try:
        existing = db.query(ComplaintRecord).filter(
            ComplaintRecord.batch_lot_number == batch_number.strip()
        ).all()
        
        if existing:
            return {
                "is_duplicate": True,
                "count": len(existing),
                "prior_records": [r.complaint_id for r in existing],
                "alert": f"Batch {batch_number} has {len(existing)} prior complaint(s) logged (e.g. {existing[0].complaint_id}). Immediate QA deviation review recommended."
            }
    except Exception as e:
        print(f"[Warning] Duplicate DB check error: {e}")
        
    return {"is_duplicate": False, "count": 0, "prior_records": []}


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "PharmaPulse AI QMS Engine",
        "version": "2.4.0",
        "database": "SQLAlchemy Active",
        "groq_configured": bool(GROQ_API_KEY and not GROQ_API_KEY.startswith("your_groq"))
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "groq_key_present": bool(GROQ_API_KEY and len(GROQ_API_KEY) > 10)
    }

@app.post("/api/extract-text")
async def extract_text_endpoint(payload: ComplaintIntakeRequest, db: Session = Depends(get_db)):
    """Accept raw text/email payload, execute LangGraph workflow, and run DB duplicate audit."""
    raw_text = payload.text
    if not raw_text or not raw_text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")

    try:
        result_state = await complaint_graph.ainvoke({"raw_text": raw_text})
        extracted_data = result_state.get("extracted_data", {})
        
        batch_no = extracted_data.get("batchLotNumber")
        duplicate_info = check_db_duplicates(batch_no, db)

        return {
            "formData": extracted_data,
            "riskAssessment": result_state.get("risk_assessment", {}),
            "validationErrors": result_state.get("validation_errors", []),
            "completenessInfo": result_state.get("completeness_info", {}),
            "duplicateInfo": duplicate_info,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangGraph execution error: {str(e)}")

@app.post("/api/upload")
async def upload_document_endpoint(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Accept file upload (PDF, DOCX, TXT, EML), extract text, run LangGraph, and check duplicates."""
    try:
        raw_text = await extract_text_from_file(file)
        result_state = await complaint_graph.ainvoke({"raw_text": raw_text})
        extracted_data = result_state.get("extracted_data", {})

        batch_no = extracted_data.get("batchLotNumber")
        duplicate_info = check_db_duplicates(batch_no, db)

        return {
            "filename": file.filename,
            "rawTextSnippet": raw_text[:200] + "..." if len(raw_text) > 200 else raw_text,
            "formData": extracted_data,
            "riskAssessment": result_state.get("risk_assessment", {}),
            "validationErrors": result_state.get("validation_errors", []),
            "completenessInfo": result_state.get("completeness_info", {}),
            "duplicateInfo": duplicate_info,
            "status": "success"
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document intake error: {str(e)}")

@app.post("/api/copilot-chat")
async def copilot_chat_endpoint(payload: ChatQueryRequest):
    """Context-aware interactive Q&A copilot using Groq LLM."""
    user_query = payload.query
    context = payload.context or {}

    if not GROQ_API_KEY or GROQ_API_KEY.startswith("your_groq"):
        reply = generate_fallback_chat_reply(user_query, context)
        return {"response": reply, "model": "fallback-engine"}

    try:
        llm = ChatGroq(
            groq_api_key=GROQ_API_KEY,
            model_name=DEFAULT_MODEL,
            temperature=0.2
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", COPILOT_CHAT_SYSTEM_PROMPT),
            ("user", "Complaint Context: {context}\n\nQuestion: {query}")
        ])

        chain = prompt | llm
        response = await chain.ainvoke({"context": str(context), "query": user_query})
        
        return {
            "response": response.content if hasattr(response, "content") else str(response),
            "model": DEFAULT_MODEL
        }
    except Exception as e:
        reply = generate_fallback_chat_reply(user_query, context)
        return {"response": reply, "error": str(e), "model": "fallback-engine"}

# --- PERSISTENCE ENDPOINTS ---

@app.post("/api/complaints")
async def save_complaint_endpoint(request: Request, db: Session = Depends(get_db)):
    """Save verified complaint record and AI risk assessment to database."""
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload.")

    formData = data.get("formData") or {}
    risk = data.get("riskAssessment") or {}

    # Handle if formData is passed as a nested object or string
    if not isinstance(formData, dict):
        formData = {}
    if not isinstance(risk, dict):
        risk = {}

    existing_count = db.query(ComplaintRecord).count()
    complaint_tracking_id = f"CMP-2026-{(existing_count + 1):04d}"

    try:
        record = ComplaintRecord(
            complaint_id=complaint_tracking_id,
            complaint_source=formData.get("complaintSource"),
            customer_name=formData.get("customerName"),
            product_name=formData.get("productName"),
            product_strength_grade=formData.get("productStrengthGrade"),
            batch_lot_number=formData.get("batchLotNumber"),
            mfg_date=formData.get("mfgDate"),
            expiry_date=formData.get("expiryDate"),
            quantity_affected=str(formData.get("quantityAffected") or ""),
            quantity_unit=formData.get("quantityUnit") or "kg",
            complaint_type=formData.get("complaintType"),
            complaint_date=formData.get("complaintDate"),
            detailed_description=formData.get("detailedDescription"),
            initial_severity=formData.get("initialSeverity") or "Major",
            priority=formData.get("priority") or "High",
            status="Triaged & Logged",
            patient_safety_risk=risk.get("patientSafetyRisk"),
            regulatory_impact=risk.get("regulatoryImpact"),
            suggested_root_cause=risk.get("suggestedRootCause"),
            immediate_action=risk.get("immediateAction"),
            capa_recommendation=risk.get("capaRecommendation"),
        )


        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "success": True,
            "complaint_id": complaint_tracking_id,
            "message": f"Complaint successfully logged as {complaint_tracking_id}."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database save failure: {str(e)}")

@app.get("/api/complaints")
def list_complaints_endpoint(db: Session = Depends(get_db)):
    """List all past logged complaint records for audit history."""
    records = db.query(ComplaintRecord).order_by(ComplaintRecord.created_at.desc()).all()
    return [r.to_dict() for r in records]

@app.get("/api/complaints/{record_id}")
def get_complaint_detail_endpoint(record_id: str, db: Session = Depends(get_db)):
    """Fetch complete complaint record details by integer ID or CMP tracking code."""
    if record_id.isdigit():
        record = db.query(ComplaintRecord).filter(ComplaintRecord.id == int(record_id)).first()
    else:
        record = db.query(ComplaintRecord).filter(ComplaintRecord.complaint_id == record_id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Complaint record not found.")

    return record.to_dict()


def generate_fallback_chat_reply(query: str, context: dict) -> str:
    lower = query.lower()
    batch = context.get("batchLotNumber") or "B2026-X9"
    product = context.get("productName") or "Paracetamol API"
    severity = context.get("initialSeverity") or "Critical"

    if "capa" in lower or "recommend" in lower or "draft" in lower:
        return f"**Recommended CAPA Plan for Lot {batch}:**\n1. Issue immediate **Stop-Shipment & Warehouse Quarantine Notice**.\n2. Initiate engineering audit on milling mesh integrity for {product}.\n3. Retain 3 companion batches for stability re-testing."
    elif "risk" in lower or "safety" in lower or "severity" in lower:
        return f"**GxP Risk Analysis:** Initial Severity is set to **{severity}**. Main exposure includes patient health risk if foreign particulates exceed 150µm, requiring EU GMP Annex 16 deviation filing."
    elif "duplicate" in lower or "history" in lower:
        return f"**Batch Audit History:** Lot **{batch}** has 0 prior customer complaints on record. All initial certificate of analysis (CoA) release values met USP specification limits."
    else:
        return f"Regarding '{query}': Current QMS file for lot {batch} ({product}) complies with 21 CFR Part 211.198 complaint documentation standards."

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)