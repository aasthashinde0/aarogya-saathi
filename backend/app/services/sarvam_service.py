import os
import base64
import logging
from typing import Optional, List, Dict, Any
from sarvamai import SarvamAI
from backend.app.config import settings

logger = logging.getLogger(__name__)

class SarvamService:
    def __init__(self):
        self.api_key = settings.SARVAM_API_KEY
        self.client = None
        if self.api_key:
            try:
                self.client = SarvamAI(api_subscription_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize SarvamAI client: {e}")

    def text_to_speech(
        self,
        text: str,
        language_code: str = "hi-IN",
        speaker: Optional[str] = None,
        pace: float = 1.0
    ) -> Optional[str]:
        """
        Converts text to speech using Sarvam bulbul:v3 model.
        Returns base64 encoded audio string (WAV/MP3).
        """
        if not self.client:
            logger.warning("Sarvam client not initialized, skipping TTS")
            return None
        
        # Validate/fallback language
        if language_code not in settings.SUPPORTED_LANGUAGES:
            language_code = "hi-IN"
            
        if not speaker:
            speaker = settings.SUPPORTED_LANGUAGES[language_code].get("default_speaker", "aditya")

        # Clean text for speech
        clean_text = text.replace("*", "").replace("#", "").strip()
        if not clean_text:
            return None
        
        # Max text chunking for TTS safety
        truncated_text = clean_text[:450]

        try:
            response = self.client.text_to_speech.convert(
                text=truncated_text,
                language_code=language_code,
                speaker=speaker,
                pace=pace,
                model=settings.SARVAM_TTS_MODEL
            )
            if response and response.audios and len(response.audios) > 0:
                return response.audios[0]
        except Exception as e:
            logger.error(f"Sarvam TTS Error for lang {language_code}: {e}")
            # Try fallback speaker if speaker error
            try:
                fallback_speaker = "aditya" if language_code == "hi-IN" else "simran"
                fallback_res = self.client.text_to_speech.convert(
                    text=truncated_text,
                    language_code=language_code if language_code in ["hi-IN", "en-IN"] else "hi-IN",
                    speaker=fallback_speaker,
                    model=settings.SARVAM_TTS_MODEL
                )
                if fallback_res and fallback_res.audios:
                    return fallback_res.audios[0]
            except Exception as ex2:
                logger.error(f"Fallback TTS failed: {ex2}")
        return None

    def speech_to_text(self, file_bytes: bytes, language_code: str = "hi-IN") -> Dict[str, Any]:
        """
        Transcribes audio bytes to text using Sarvam saaras:v3 model.
        """
        if not self.client:
            return {"transcript": "", "language_code": language_code, "error": "API key missing"}

        try:
            # saaras:v3 supports wav, mp3, aac, etc.
            response = self.client.speech_to_text.transcribe(
                file=file_bytes,
                model=settings.SARVAM_STT_MODEL,
                language_code=language_code if language_code != "unknown" else "hi-IN",
                mode="transcribe"
            )
            return {
                "transcript": getattr(response, "transcript", "") or str(response),
                "language_code": getattr(response, "language_code", language_code)
            }
        except Exception as e:
            logger.error(f"Sarvam STT Error: {e}")
            return {"transcript": "", "error": str(e)}

    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translates text across Indian languages using Sarvam translate.
        """
        if not self.client or not text:
            return text
        try:
            response = self.client.text.translate(
                input=text,
                source_language_code=source_lang,
                target_language_code=target_lang,
                model=settings.SARVAM_TRANSLATE_MODEL
            )
            return getattr(response, "translated_text", text)
        except Exception as e:
            logger.error(f"Sarvam Translation Error: {e}")
            return text

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3
    ) -> str:
        """
        Chat completion using sarvam-105b-conversations model.
        """
        if not self.client:
            return "Sarvam AI client is not configured. Please verify your SARVAM_API_KEY."

        try:
            response = self.client.chat.completions(
                model=settings.SARVAM_CHAT_MODEL,
                messages=messages,
                temperature=temperature
            )
            if response and response.choices and len(response.choices) > 0:
                return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"Sarvam Chat Completion Error: {e}")
            return f"Error communicating with Sarvam AI: {str(e)}"
        return "No response received."

    def answer_health_query(
        self,
        query: str,
        retrieved_contexts: List[Dict[str, str]],
        patient_name: str = "Ramesh Sharma",
        language_code: str = "hi-IN",
        interface_mode: str = "simple"
    ) -> Dict[str, Any]:
        """
        RAG Document-grounded healthcare assistant reasoning.
        Enforces medical safety rules:
        - Never invent lab results or dosages
        - Grounded exclusively in retrieved documents
        - Simple everyday language for elderly users
        - Clear doctor consultation reminders
        """
        lang_info = settings.SUPPORTED_LANGUAGES.get(language_code, {"name": "Hindi", "native": "हिन्दी"})
        target_lang_name = lang_info["name"]

        system_prompt = f"""You are Aarogya Saathi (आरोग्य साथी), a compassionate, highly accurate multilingual AI Healthcare Accessibility Companion.
You are assisting patient {patient_name}.
Current interface mode: {interface_mode.upper()}.

CRITICAL MEDICAL SAFETY & ETHICAL RULES:
1. Ground your answer ONLY in the provided Document Evidence below.
2. NEVER diagnose diseases, invent laboratory figures, or infer/change medication dosages.
3. If the user's question asks for medical details not found in the documents, explicitly state that this information is not present in their uploaded records and advise them to consult their doctor.
4. Language Requirement: Respond in natural, warm, easy-to-understand {target_lang_name}.
5. For SIMPLE MODE: Use short sentences, warm tone, avoid dense medical jargon (e.g., explain what 'HbA1c' or 'BP' means in simple daily words).
6. Always include a brief reminder that this is for educational understanding and not a substitute for professional medical advice.
"""

        context_text = ""
        cited_docs = []
        if retrieved_contexts:
            context_text = "\n\nDOCUMENT EVIDENCE FROM PATIENT'S MEDICAL RECORDS:\n"
            for idx, c in enumerate(retrieved_contexts):
                doc_title = c.get("title", f"Doc {idx+1}")
                section = c.get("section", "General")
                text = c.get("text", "")
                context_text += f"[Document {idx+1}: {doc_title} | Section: {section}]\n{text}\n\n"
                if doc_title not in cited_docs:
                    cited_docs.append(doc_title)
        else:
            context_text = "\nNo relevant medical records were found for this query.\n"

        user_content = f"{context_text}\nPATIENT QUESTION: {query}\n\nPlease provide a clear, helpful, grounded explanation in {target_lang_name}."

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]

        reply_text = self.chat_completion(messages, temperature=0.2)

        # Generate audio TTS for the reply
        audio_b64 = self.text_to_speech(reply_text, language_code=language_code)

        return {
            "answer": reply_text,
            "audio_base64": audio_b64,
            "cited_documents": cited_docs,
            "language_code": language_code,
            "mode": interface_mode
        }

sarvam_service = SarvamService()
