import os
import re
import json
import uuid
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from pypdf import PdfReader
from backend.app.config import settings
from backend.app.services.sarvam_service import sarvam_service

logger = logging.getLogger(__name__)

MEDICAL_GLOSSARY = {
    "hba1c": "Glycated Haemoglobin: Measures average blood sugar levels over the past 2 to 3 months. Normal is below 5.7%; for diabetes, under 7.0% is generally good control.",
    "fasting blood glucose": "Blood sugar measured after not eating for at least 8 hours. Normal is 70 to 100 mg/dL.",
    "creatinine": "A waste product filtered by the kidneys. Normal levels (0.7-1.2 mg/dL) indicate healthy kidney filtration.",
    "haemoglobin": "The iron-rich protein in red blood cells that carries oxygen throughout the body. Normal is 13-17 g/dL in men, 12-15 g/dL in women.",
    "hypertension": "High blood pressure inside your arteries (systolic above 130 or diastolic above 80 mmHg).",
    "lipid profile": "Tests cholesterol and fat levels (Total Cholesterol, LDL 'bad' cholesterol, HDL 'good' cholesterol, Triglycerides).",
    "sgpt / alt": "Liver enzyme test; elevated levels can indicate liver stress or inflammation.",
    "metformin": "A first-line medication that helps the body use insulin more effectively to lower blood sugar.",
    "telmisartan": "A blood pressure medication that relaxes blood vessels to improve blood flow.",
    "atorvastatin": "A statin medication that lowers LDL (bad) cholesterol and reduces heart disease risk."
}

class DocumentService:
    def extract_text(self, file_path: str, file_type: str) -> str:
        """
        Extract text from PDF or text file.
        """
        path = Path(file_path)
        if not path.exists():
            return ""

        if "pdf" in file_type.lower() or path.suffix.lower() == ".pdf":
            try:
                reader = PdfReader(str(path))
                extracted_pages = []
                for i, page in enumerate(reader.pages):
                    text = page.extract_text()
                    if text:
                        extracted_pages.append(f"[Page {i+1}]\n{text}")
                return "\n\n".join(extracted_pages)
            except Exception as e:
                logger.error(f"Error reading PDF {file_path}: {e}")
                return ""
        else:
            try:
                with open(str(path), "r", encoding="utf-8", errors="ignore") as f:
                    return f.read()
            except Exception as e:
                logger.error(f"Error reading file {file_path}: {e}")
                return ""

    def analyze_document_with_ai(self, text: str, doc_type: str, language_code: str = "hi-IN") -> Dict[str, Any]:
        """
        Uses Sarvam-105b to extract structured medical sections, plain language explanation,
        jargon definitions, and doctor questions.
        """
        lang_name = settings.SUPPORTED_LANGUAGES.get(language_code, {}).get("name", "Hindi")
        prompt = f"""You are a specialized medical document interpreter for Indian patients.
Analyze this medical document text:
------------------
{text[:3000]}
------------------
Document Type: {doc_type}

Provide a JSON response with the following exact keys:
1. "document_title": A clear short title (e.g. "Doctor Prescription - Cardiology" or "Comprehensive Blood Report")
2. "date": Extracted date if found, or "Not specified"
3. "doctor_or_lab": Doctor name, hospital, or lab name
4. "simple_explanation": A warm, easy-to-understand explanation for an elderly patient in {lang_name}. Do NOT use scary or overly complex jargon.
5. "important_findings": Array of objects: [{{"label": "Parameter or Med name", "value": "value", "status": "Normal/High/Low/Routine", "note": "one sentence explanation"}}]
6. "medical_terms_explained": Array of objects: [{{"term": "Medical term", "simple_meaning": "What it means in daily life"}}]
7. "questions_for_doctor": Array of 3-4 sensible, respectful questions the patient should ask their doctor during their next visit.

Return STRICT JSON only, no markdown backticks, no markdown commentary.
"""
        messages = [
            {"role": "system", "content": "You are a medical document analyzer that outputs strict valid JSON without codeblocks."},
            {"role": "user", "content": prompt}
        ]
        
        reply = sarvam_service.chat_completion(messages, temperature=0.1)
        
        # Parse JSON
        parsed_data = {}
        try:
            # Strip code fences if present
            cleaned_reply = reply.strip()
            if cleaned_reply.startswith("```json"):
                cleaned_reply = cleaned_reply[7:]
            if cleaned_reply.startswith("```"):
                cleaned_reply = cleaned_reply[3:]
            if cleaned_reply.endswith("```"):
                cleaned_reply = cleaned_reply[:-3]
            parsed_data = json.loads(cleaned_reply.strip())
        except Exception as e:
            logger.warning(f"Could not parse AI response as JSON: {e}, creating fallback structure")
            parsed_data = {
                "document_title": f"Medical Document ({doc_type.capitalize()})",
                "date": "Extracted",
                "doctor_or_lab": "Healthcare Provider",
                "simple_explanation": reply if len(reply) < 500 else reply[:500] + "...",
                "important_findings": [],
                "medical_terms_explained": [],
                "questions_for_doctor": ["Can you explain these results in relation to my current medications?", "Are any lifestyle modifications recommended?"]
            }

        return parsed_data

    def chunk_text(self, text: str, max_chunk_size: int = 400) -> List[Dict[str, str]]:
        """
        Splits medical text into cohesive semantic chunks based on sections/paragraphs.
        """
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        chunks = []
        current_chunk = ""
        current_section = "General"

        for p in paragraphs:
            # Check for section header
            if re.match(r"^[A-Z0-9\s\-_:]{3,40}:", p):
                header_match = p.split(":")[0]
                current_section = header_match.strip()

            if len(current_chunk) + len(p) > max_chunk_size and current_chunk:
                chunks.append({"section": current_section, "text": current_chunk.strip()})
                current_chunk = p
            else:
                current_chunk += "\n" + p

        if current_chunk.strip():
            chunks.append({"section": current_section, "text": current_chunk.strip()})

        return chunks

document_service = DocumentService()
