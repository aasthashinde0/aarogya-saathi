# Aarogya Saathi (आरोग्य साथी)
### *A Multilingual, Voice-First AI Healthcare Companion*

Aarogya Saathi is an accessibility-first healthcare platform that empowers patients—especially the elderly and non-English speakers—to understand medical documents, manage prescribed medications, and involve trusted family caregivers in their health journeys.

Built with **Sarvam AI** for Indian language understanding, natural speech synthesis, and document reasoning.

---

## 🌟 Core Product Philosophy

1. **Voice-First, Not Voice-Supported:** Microphone-first interactions designed so patients can speak and listen in 11 Indian languages without typing.
2. **Explain, Don't Just Translate:** Converts dense medical terminology (e.g. HbA1c, Creatinine, Stage 1 Hypertension) into understandable everyday language.
3. **Document-Grounded Clinical AI (RAG):** AI answers strictly reference verified prescriptions and diagnostic test reports. No hallucinations or invented figures.
4. **Family-Assisted Healthcare:** Granular, patient-authorized caregiver circle allowing family members to view medicine schedules and appointments without compromising patient dignity.
5. **Offline-Friendly Accessibility:** Built as a Progressive Web App (PWA) with Service Worker and IndexedDB caching for critical health schedules offline.

---

## ⚡ One App, Two Modes

Both modes share the exact same patient profile, uploaded documents, medicine schedules, appointments, and caregiver permissions:

- **Mode A: Simple Mode**
  - Designed for elderly users and those who prefer minimal technology interaction.
  - Giant pulsing microphone with clear visual state indicators (*Listening, Processing, Speaking*).
  - High-contrast, large touch targets (60px+), simplified language, and quick action cards (*My Medicines, My Reports, Appointments, Family*).
- **Mode B: Advanced Mode**
  - Full clinical dashboard with vital trends (*Blood Glucose, HbA1c, Blood Pressure, Pulse*).
  - Document Intelligence Library with OCR extraction and section breakdown.
  - Interactive RAG AI Chat console with source citations.
  - Caregiver permission manager and access audit trail.

---

## 🚀 Supported Indian Languages (Sarvam AI)

- **Hindi (हिन्दी)**
- **Marathi (मराठी)**
- **Tamil (தமிழ்)**
- **Telugu (తెలుగు)**
- **Bengali (বাংলা)**
- **Gujarati (ગુજરાતી)**
- **Kannada (ಕನ್ನಡ)**
- **Malayalam (മലയാളം)**
- **Punjabi (ਪੰਜਾਬੀ)**
- **Odia (ଓଡ଼ିଆ)**
- **English (India)**

---

## 🛠️ Technology Architecture

- **Backend:** FastAPI, Python 3.13, SQLite / Supabase (PostgreSQL + pgvector).
- **AI & Voice Services:**
  - `sarvam-105b-conversations`: Clinical explanation & multilingual healthcare reasoning.
  - `bulbul:v3`: High-fidelity vernacular Text-to-Speech (TTS).
  - `saaras:v3`: Multilingual Speech-to-Text (STT).
  - `mayura:v1`: Context-preserving Indian language translation.
- **Frontend:** Responsive Mobile-First PWA (HTML5, Accessible CSS Design System, Vanilla ES6, Service Worker).

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Verify `.env` in the project root:
```env
SARVAM_API_KEY=your_sarvam_api_key_here
```

### 3. Start the Platform
```bash
python run.py
```

Open `http://localhost:8000` in your browser.
API Documentation: `http://localhost:8000/docs`
