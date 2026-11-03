import uuid
import json
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from backend.app.services.sarvam_service import sarvam_service
from backend.app.services.rag_service import rag_service
from backend.app.db.database import get_db

router = APIRouter(prefix="/voice", tags=["Voice"])

class TTSRequest(BaseModel):
    text: str
    language_code: Optional[str] = "hi-IN"
    speaker: Optional[str] = None
    pace: Optional[float] = 1.0

class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = "patient_ramesh_sharma_01"
    language_code: Optional[str] = "hi-IN"
    mode: Optional[str] = "simple"

@router.post("/tts")
def text_to_speech(req: TTSRequest):
    """
    Generate speech audio using Sarvam bulbul:v3.
    """
    if not req.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    audio_b64 = sarvam_service.text_to_speech(
        text=req.text,
        language_code=req.language_code or "hi-IN",
        speaker=req.speaker,
        pace=req.pace or 1.0
    )
    if not audio_b64:
        raise HTTPException(status_code=500, detail="Failed to synthesize speech")

    return {"audio_base64": audio_b64, "language_code": req.language_code}

@router.post("/stt")
async def speech_to_text(
    audio: UploadFile = File(...),
    language_code: str = Form("hi-IN")
):
    """
    Transcribe audio file using Sarvam saaras:v3.
    """
    file_bytes = await audio.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty")

    result = sarvam_service.speech_to_text(file_bytes, language_code=language_code)
    return result

@router.post("/process")
async def process_voice_or_text(
    audio: Optional[UploadFile] = File(None),
    query_text: Optional[str] = Form(None),
    user_id: str = Form("patient_ramesh_sharma_01"),
    language_code: str = Form("hi-IN"),
    mode: str = Form("simple")
):
    """
    Complete Voice-first AI assistant pipeline:
    Microphone audio / text -> STT -> Document RAG & Context -> Sarvam 105B Reasoning -> TTS -> Reply.
    """
    transcript = ""
    if audio:
        file_bytes = await audio.read()
        if file_bytes:
            stt_result = sarvam_service.speech_to_text(file_bytes, language_code=language_code)
            transcript = stt_result.get("transcript", "")
    
    if not transcript and query_text:
        transcript = query_text.strip()

    if not transcript:
        raise HTTPException(status_code=400, detail="No voice or text input received")

    # Fetch patient name
    patient_name = "Ramesh Sharma"
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name, language, interface_mode FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if row:
            patient_name = row["name"]
            if not language_code:
                language_code = row["language"] or "hi-IN"

    # Run RAG Grounded answering
    rag_result = rag_service.answer_query(
        user_id=user_id,
        query=transcript,
        patient_name=patient_name,
        language_code=language_code,
        interface_mode=mode
    )

    answer_text = rag_result["answer"]
    audio_base64 = rag_result.get("audio_base64")
    cited_docs = rag_result.get("cited_documents", [])

    # Save conversation turn
    with get_db() as conn:
        cursor = conn.cursor()
        # Save user message
        cursor.execute("""
        INSERT INTO ai_conversations (id, user_id, role, content, language_code, mode, source_docs)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (str(uuid.uuid4()), user_id, "user", transcript, language_code, mode, "[]"))
        # Save assistant message
        cursor.execute("""
        INSERT INTO ai_conversations (id, user_id, role, content, language_code, mode, source_docs)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (str(uuid.uuid4()), user_id, "assistant", answer_text, language_code, mode, json.dumps(cited_docs)))

    return {
        "transcript": transcript,
        "answer": answer_text,
        "audio_base64": audio_base64,
        "cited_documents": cited_docs,
        "language_code": language_code,
        "mode": mode
    }
