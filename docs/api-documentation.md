# Aarogya Saathi - API Specification

All endpoints are hosted under `/api`. Interactive OpenAPI/Swagger documentation is accessible at `http://localhost:8000/docs`.

---

## 1. Voice Endpoints (`/api/voice`)

### `POST /api/voice/process`
Complete Voice-First AI assistant orchestration pipeline.
- **Request (Multipart Form):**
  - `audio`: Audio file (WAV/MP3) [Optional if `query_text` provided]
  - `query_text`: String query [Optional if `audio` provided]
  - `language_code`: String (e.g. `hi-IN`, `en-IN`, `mr-IN`)
  - `mode`: Interface mode (`simple` or `advanced`)
  - `user_id`: Patient identifier
- **Response:**
  - `transcript`: Spoken or text query.
  - `answer`: Document-grounded explanation in chosen language.
  - `audio_base64`: Base64 audio synthesized via Sarvam `bulbul:v3`.
  - `cited_documents`: Array of document titles referenced.

### `POST /api/voice/tts`
Synthesize text into vernacular speech using Sarvam `bulbul:v3`.
- **Request Body (JSON):**
  - `text`: String
  - `language_code`: String (e.g. `hi-IN`)
  - `speaker`: Optional speaker voice
  - `pace`: Float (e.g. `1.0` or `0.8` for slower speech)
- **Response:**
  - `audio_base64`: Base64 audio string.

---

## 2. Document Intelligence Endpoints (`/api/documents`)

### `GET /api/documents`
List all uploaded medical documents for the patient.

### `POST /api/documents/upload`
Upload medical record (PDF or Image), extract text, run Sarvam AI analysis, and index for RAG.
- **Form Data:**
  - `file`: PDF / Image file
  - `doc_type`: `prescription`, `blood_report`, `discharge_summary`, `investigation`
  - `language_code`: Target language for summary

### `GET /api/documents/{doc_id}/explain`
Return structured clinical explanation:
- Simplified human summary
- Key laboratory findings with status flags (Normal / High / Low)
- Medical terms simplified
- Questions to ask the doctor
- Native vernacular audio summary

### `POST /api/documents/qa`
Execute document-grounded RAG retrieval for a specific question.

---

## 3. Medicine Manager Endpoints (`/api/medicines`)

### `GET /api/medicines/today`
Returns today's medicine schedule grouped by `morning`, `afternoon`, `night` along with current adherence status and spoken audio announcement.

### `POST /api/medicines/toggle`
Record dose taken or missed:
- `medicine_id`: String
- `slot`: `morning` | `afternoon` | `night`
- `status`: `taken` | `pending` | `missed`

---

## 4. Family Circle Endpoints (`/api/family`)

### `GET /api/family`
Returns authorized caregivers and their granular access permissions.

### `POST /api/family/invite`
Invite family member with role-based permissions (`can_view_medicines`, `can_view_documents`, `can_view_appointments`, `is_emergency_contact`).

### `DELETE /api/family/{member_id}`
Revoke caregiver access.

### `GET /api/family/audit`
Returns immutable audit trail of caregiver interactions with patient records.

---

## 5. Timeline & Appointments (`/api/timeline`, `/api/appointments`)

### `GET /api/timeline`
Chronological health events stream aggregating document uploads, doctor consultations, vitals, and medication changes.

### `POST /api/appointments`
Schedule consultation and store checklist of questions to discuss with the doctor.
