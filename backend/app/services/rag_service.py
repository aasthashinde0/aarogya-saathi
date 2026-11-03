import re
import math
from typing import List, Dict, Any
from backend.app.db.database import get_db
from backend.app.services.sarvam_service import sarvam_service

SYNONYMS = {
    "hemoglobin": ["haemoglobin", "cbc", "blood"],
    "haemoglobin": ["hemoglobin", "cbc", "blood"],
    "sugar": ["glucose", "hba1c", "glycemic", "fbg", "fasting"],
    "glucose": ["sugar", "hba1c", "glycemic", "fbg"],
    "bp": ["blood pressure", "hypertension", "telma", "telmisartan"],
    "hypertension": ["bp", "blood pressure", "telma"],
    "pressure": ["bp", "blood pressure", "hypertension"],
    "medicine": ["medications", "prescription", "tab", "tablet", "rx"],
    "medicines": ["medications", "prescription", "tab", "tablet", "rx"],
    "prescription": ["rx", "medicines", "doctor", "glycomet", "telma", "atorva"],
    "kidney": ["creatinine", "renal"],
    "cholesterol": ["lipid", "atorva", "atorvastatin", "ldl"]
}

class RAGService:
    def retrieve_relevant_chunks(self, user_id: str, query: str, top_k: int = 4, language_code: str = "hi-IN") -> List[Dict[str, str]]:
        """
        Retrieves top relevant chunks from patient's documents using weighted term scoring.
        Supports cross-lingual retrieval (translating Indian vernacular queries into English medical terms)
        and clinical synonym expansion.
        """
        def expand_terms(terms):
            expanded = set(terms)
            for t in terms:
                if t in SYNONYMS:
                    expanded.update(SYNONYMS[t])
            return list(expanded)

        def score_text(terms, rows):
            all_terms = expand_terms(terms)
            scored = []
            for r in rows:
                text = r["chunk_text"].lower()
                section = (r["section_title"] or "").lower()
                title = r["doc_title"].lower()

                score = 0.0
                for term in all_terms:
                    tf = text.count(term)
                    if tf > 0:
                        score += (1.0 + math.log(tf)) * 2.0
                    if term in section:
                        score += 3.5
                    if term in title:
                        score += 4.0

                if score > 0:
                    scored.append({
                        "score": score,
                        "chunk_id": r["id"],
                        "document_id": r["document_id"],
                        "title": r["doc_title"],
                        "section": r["section_title"] or "General",
                        "text": r["chunk_text"]
                    })
            scored.sort(key=lambda x: x["score"], reverse=True)
            return scored

        clean_query = re.sub(r"[^\w\s]", " ", query.lower())
        query_terms = [t for t in clean_query.split() if len(t) > 2]
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT c.id, c.document_id, c.section_title, c.chunk_text, d.title as doc_title, d.doc_type
            FROM document_chunks c
            JOIN documents d ON c.document_id = d.id
            WHERE d.user_id = ?
            """, (user_id,))
            rows = cursor.fetchall()

        matched = score_text(query_terms, rows)

        # Cross-lingual expansion: If few or no chunks found and language is not English,
        # translate vernacular query to English via Sarvam AI
        if len(matched) == 0 and language_code != "en-IN":
            try:
                en_query = sarvam_service.translate_text(query, source_lang=language_code, target_lang="en-IN")
                clean_en = re.sub(r"[^\w\s]", " ", en_query.lower())
                en_terms = [t for t in clean_en.split() if len(t) > 2]
                matched = score_text(en_terms, rows)
            except Exception:
                pass

        return matched[:top_k]

    def answer_query(
        self,
        user_id: str,
        query: str,
        patient_name: str = "Ramesh Sharma",
        language_code: str = "hi-IN",
        interface_mode: str = "simple"
    ) -> Dict[str, Any]:
        """
        Full RAG Pipeline: Retrieve -> Formulate grounded context -> Call Sarvam -> Generate Audio.
        """
        relevant_chunks = self.retrieve_relevant_chunks(user_id, query, language_code=language_code)
        
        result = sarvam_service.answer_health_query(
            query=query,
            retrieved_contexts=relevant_chunks,
            patient_name=patient_name,
            language_code=language_code,
            interface_mode=interface_mode
        )
        
        result["chunks_found"] = len(relevant_chunks)
        result["retrieved_sources"] = [
            {"title": c["title"], "section": c["section"]} for c in relevant_chunks
        ]
        return result

rag_service = RAGService()
