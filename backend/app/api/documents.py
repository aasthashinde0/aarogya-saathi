import os
import uuid
import json
from pathlib import Path
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from backend.app.config import settings
from backend.app.db.database import get_db
from backend.app.services.document_service import document_service
from backend.app.services.rag_service import rag_service
from backend.app.services.sarvam_service import sarvam_service

router = APIRouter(prefix="/documents", tags=["Documents"])

class DocumentQARequest(BaseModel):
    query: str
    user_id: Optional[str] = "patient_ramesh_sharma_01"
    language_code: Optional[str] = "hi-IN"
    mode: Optional[str] = "advanced"

@router.get("")
def list_documents(user_id: str = "patient_ramesh_sharma_01"):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT id, title, doc_type, file_path, file_type, file_size, simplified_summary, created_at
        FROM documents
        WHERE user_id = ?
        ORDER BY created_at DESC
        """, (user_id,))
        rows = cursor.fetchall()
        return [dict(r) for r in rows]

@router.get("/{doc_id}")
def get_document(doc_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Document not found")
        data = dict(row)
        if data.get("structured_data"):
            try:
                data["structured_data"] = json.loads(data["structured_data"])
            except Exception:
                pass
        return data

@router.get("/{doc_id}/explain")
def explain_document(doc_id: str, language_code: str = "hi-IN"):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Document not found")
        
        doc = dict(row)
        summary = doc.get("simplified_summary") or "दस्तावेज़ की व्याख्या उपलब्ध है।"
        
        # Translate summary to requested language if different from Hindi
        if language_code != "hi-IN" and summary:
            try:
                translated_summary = sarvam_service.translate_text(summary, source_lang="hi-IN", target_lang=language_code)
                if translated_summary:
                    summary = translated_summary
            except Exception:
                pass

        # Generate audio for summary in target language
        audio_b64 = sarvam_service.text_to_speech(summary, language_code=language_code)
        
        structured = {}
        if doc.get("structured_data"):
            try:
                structured = json.loads(doc["structured_data"])
            except Exception:
                pass

        return {
            "document_id": doc_id,
            "title": doc["title"],
            "doc_type": doc["doc_type"],
            "summary": summary,
            "audio_base64": audio_b64,
            "structured_data": structured,
            "extracted_text": doc.get("extracted_text", "")
        }

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    doc_type: str = Form("prescription"), # prescription, blood_report, discharge_summary, investigation
    title: Optional[str] = Form(None),
    user_id: str = Form("patient_ramesh_sharma_01"),
    language_code: str = Form("hi-IN")
):
    """
    Uploads document, extracts text with OCR/PDF parser, runs Sarvam AI structured analysis,
    stores chunks for RAG, and generates plain-language summary.
    """
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    filename = f"{uuid.uuid4()}_{file.filename}"
    save_path = settings.UPLOAD_DIR / filename
    with open(save_path, "wb") as f:
        f.write(file_bytes)

    # 1. Extract text
    file_type = file.content_type or "application/octet-stream"
    extracted_text = document_service.extract_text(str(save_path), file_type)

    if not extracted_text:
        # If text is empty (e.g. image with no OCR yet), provide a fallback message
        extracted_text = f"Uploaded medical document: {file.filename}. Type: {doc_type}."

    # 2. AI Structured Analysis
    analysis = document_service.analyze_document_with_ai(extracted_text, doc_type, language_code=language_code)
    doc_title = title or analysis.get("document_title") or f"{doc_type.capitalize()} - {file.filename}"
    simple_summary = analysis.get("simple_explanation", "")

    doc_id = f"doc_{uuid.uuid4().hex[:8]}"

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO documents (id, user_id, title, doc_type, file_path, file_type, file_size, extracted_text, structured_data, simplified_summary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc_id, user_id, doc_title, doc_type, str(save_path), file_type,
            len(file_bytes), extracted_text, json.dumps(analysis, ensure_ascii=False), simple_summary
        ))

        # 3. Chunk and index for RAG
        chunks = document_service.chunk_text(extracted_text)
        for idx, chunk in enumerate(chunks):
            cursor.execute("""
            INSERT INTO document_chunks (id, document_id, chunk_index, section_title, chunk_text)
            VALUES (?, ?, ?, ?, ?)
            """, (str(uuid.uuid4()), doc_id, idx, chunk["section"], chunk["text"]))

    # Generate speech for summary
    audio_b64 = sarvam_service.text_to_speech(simple_summary, language_code=language_code)

    return {
        "id": doc_id,
        "title": doc_title,
        "doc_type": doc_type,
        "summary": simple_summary,
        "audio_base64": audio_b64,
        "structured_data": analysis
    }

@router.post("/qa")
def document_qa(req: DocumentQARequest):
    """
    RAG Question Answering grounded strictly in patient documents.
    """
    result = rag_service.answer_query(
        user_id=req.user_id or "patient_ramesh_sharma_01",
        query=req.query,
        language_code=req.language_code or "hi-IN",
        interface_mode=req.mode or "advanced"
    )
    return result
