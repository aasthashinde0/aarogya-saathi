# Aarogya Saathi - System Architecture & Engineering Blueprint

A Multilingual, Voice-First AI Healthcare Accessibility Platform.

---

## 1. Core Architectural Principles

1. **Voice-First, Not Voice-Supported:** The voice interface (STT + TTS + LLM) is a primary citizen, not a decorative button. The entire elderly workflow is executable solely through spoken Indian languages.
2. **Explain, Don't Just Translate:** Rather than literal translation of medical Latin or dense medical terminology, the platform explains concepts in culturally appropriate, everyday vernacular.
3. **Document-Grounded Clinical AI (RAG):** Answers are grounded strictly in the patient's verified prescriptions, discharge summaries, and diagnostic reports using Sarvam AI.
4. **Family-Assisted Healthcare:** Caregivers receive permission-scoped read and verification access without compromising the patient's autonomy or privacy.
5. **One App, Two Modes:** Single unified data store with two purpose-built interfaces:
   - **Mode A (Simple Mode):** High contrast, large typography, minimal navigation, giant microphone touch target.
   - **Mode B (Advanced Mode):** Comprehensive clinical dashboard, vitals tracking, RAG Q&A console, detailed timeline, and caregiver audit trail.

---

## 2. Voice Pipeline Architecture

```
User Microphone (MediaRecorder)
      │
      ▼
FastAPI `/api/voice/process`
      │
      ▼
Sarvam STT (`saaras:v3`) ───> Language Identification & Transcription
      │
      ▼
Document Grounding / RAG Chunks Retrieval (from patient's records)
      │
      ▼
Clinical Safety Prompting + Sarvam AI Reasoning (`sarvam-105b-conversations`)
      │
      ▼
Sarvam TTS (`bulbul:v3`) ───> Native Indian Vernacular Voice Generation
      │
      ▼
Frontend Audio Playback + Interactive Grounded Citations Display
```

---

## 3. Supported Indian Languages (Sarvam AI)

| Language Code | Language | Native Script | Default Voice Speaker |
|---|---|---|---|
| `hi-IN` | Hindi | हिन्दी | `aditya` / `ritu_hi_medical` |
| `en-IN` | English (India) | English | `ishita_en_medical` |
| `mr-IN` | Marathi | मराठी | `ishita_mr_conversational` |
| `ta-IN` | Tamil | தமிழ் | `vijay_ta_narration` |
| `te-IN` | Telugu | తెలుగు | `pooja_te_conversation` |
| `bn-IN` | Bengali | বাংলা | `roopa_bn_conversational` |
| `gu-IN` | Gujarati | ગુજરાતી | `pooja_gu_conversational` |
| `kn-IN` | Kannada | ಕನ್ನಡ | `chaitra_kn_conversation` |
| `ml-IN` | Malayalam | മലയാളം | `vidya` |
| `pa-IN` | Punjabi | ਪੰਜਾਬੀ | `harpreet_pa_narration` |
| `od-IN` | Odia | ଓଡ଼ିଆ | `aditya` |

---

## 4. Medical Safety & Ethical Guardrails

- **Zero Diagnostic Invention:** The system does not diagnose conditions, invent dosages, or recommend stopping medications.
- **Verification Rule:** Dosage and timing extracted from uploaded prescriptions require explicit patient acknowledgement before reminders become active.
- **Uncertainty Transparency:** If an answer cannot be grounded in uploaded documents, the AI explicitly states that the information is absent from the patient's uploaded records and provides doctor consultation questions.
- **Emergency Escalation:** The platform features an Emergency SOS module linking to 108 (Ambulance), 112 (National Emergency), and verified emergency contacts.
