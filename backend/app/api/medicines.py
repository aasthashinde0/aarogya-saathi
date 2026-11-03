import uuid
from datetime import date
from typing import Optional, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.db.database import get_db
from backend.app.services.sarvam_service import sarvam_service

router = APIRouter(prefix="/medicines", tags=["Medicines"])

class MedicineCreate(BaseModel):
    name: str
    dosage: str
    frequency: str
    timing: str # Morning, Afternoon, Night
    meal_relation: Optional[str] = "After Food"
    instructions: Optional[str] = ""
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_verified: Optional[int] = 1
    refill_count: Optional[int] = 30
    user_id: Optional[str] = "patient_ramesh_sharma_01"

class MedicineToggle(BaseModel):
    medicine_id: str
    slot: str # morning, afternoon, night
    status: str # taken, missed, pending
    user_id: Optional[str] = "patient_ramesh_sharma_01"

@router.get("")
def list_medicines(user_id: str = "patient_ramesh_sharma_01"):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT * FROM medicines WHERE user_id = ? AND active = 1 ORDER BY name ASC
        """, (user_id,))
        rows = cursor.fetchall()
        return [dict(r) for r in rows]

@router.get("/today")
def get_today_schedule(user_id: str = "patient_ramesh_sharma_01", language_code: str = "hi-IN"):
    """
    Returns today's medicines grouped by slot with current adherence status
    and an audio announcement of today's schedule.
    """
    today_str = str(date.today())
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT m.id, m.name, m.dosage, m.frequency, m.timing, m.meal_relation, m.instructions, m.is_verified, m.refill_count,
               l.id as log_id, l.scheduled_slot, l.status, l.logged_at
        FROM medicines m
        LEFT JOIN medicine_logs l ON m.id = l.medicine_id AND l.scheduled_date = ?
        WHERE m.user_id = ? AND m.active = 1
        """, (today_str, user_id))
        rows = cursor.fetchall()

    slots = {"morning": [], "afternoon": [], "night": []}
    pending_count = 0
    taken_count = 0

    for r in rows:
        med_dict = dict(r)
        timing_lower = (med_dict.get("timing") or "").lower()
        status = med_dict.get("status") or "pending"

        if status == "taken":
            taken_count += 1
        else:
            pending_count += 1

        if "morning" in timing_lower:
            slots["morning"].append(med_dict)
        if "afternoon" in timing_lower:
            slots["afternoon"].append(med_dict)
        if "night" in timing_lower:
            slots["night"].append(med_dict)

    LOCALIZED_REMINDERS = {
        "hi-IN": {
            "pending": "आज आपकी {count} दवाइयाँ बाकी हैं। कृपया समय पर लें।",
            "done": "शाबाश! आपने आज की सभी दवाइयाँ समय पर ले ली हैं।"
        },
        "mr-IN": {
            "pending": "आज तुमची {count} औषधे बाकी आहेत. कृपया वेळेवर घ्या.",
            "done": "छान! तुम्ही आजची सर्व औषधे वेळेवर घेतली आहेत."
        },
        "en-IN": {
            "pending": "You have {count} medicines remaining today. Please take them on time.",
            "done": "Great job! You have taken all your prescribed medicines for today."
        },
        "ta-IN": {
            "pending": "இன்று உங்களுக்கு {count} மருந்துகள் மீதமுள்ளன. தயவுசெய்து சரியான நேரத்தில் எடுத்துக்கொள்ளவும்.",
            "done": "மிக நன்று! இன்றைய மருந்துகள் அனைத்தையும் நீங்கள் எடுத்துக்கொண்டீர்கள்."
        },
        "te-IN": {
            "pending": "ఈరోజు మీకు {count} మందులు మిగిలి ఉన్నాయి. దయచేసి సమయానికి తీసుకోండి.",
            "done": "చాలా బాగుంది! మీరు ఈరోజు మందులన్నీ సమయానికి వేసుకున్నారు."
        },
        "bn-IN": {
            "pending": "আজ আপনার {count} টি ওষুধ বাকি আছে। অনুগ্রহ করে সময়মতো নিন।",
            "done": "দারুণ! আপনি আজকের সব ওষুধ সময়মতো নিয়েছেন।"
        },
        "gu-IN": {
            "pending": "આજે તમારી {count} દવાઓ બાકી છે. કૃપા કરીને સમયસર લો.",
            "done": "ખૂબ સરસ! તમે આજની બધી દવાઓ સમયસર લઈ લીધી છે."
        },
        "kn-IN": {
            "pending": "ಇಂದು ನಿಮ್ಮ {count} ಔಷಧಿಗಳು ಬಾಕಿ ಇವೆ. ದಯವಿಟ್ಟು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ತೆಗೆದುಕೊಳ್ಳಿ.",
            "done": "ಉತ್ತಮ! ನೀವು ಇಂದಿನ ಎಲ್ಲಾ ಔಷಧಿಗಳನ್ನು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ತೆಗೆದುಕೊಂಡಿದ್ದೀರಿ."
        },
        "ml-IN": {
            "pending": "ഇന്ന് നിങ്ങൾക്ക് {count} മരുന്നുകൾ ബാക്കിയുണ്ട്. കൃത്യസമയത്ത് കഴിക്കുക.",
            "done": "വളരെ നല്ലത്! ഇന്നത്തെ എല്ലാ മരുന്നുകളും നിങ്ങൾ കഴിച്ചു."
        },
        "pa-IN": {
            "pending": "ਅੱਜ ਤੁਹਾਡੀਆਂ {count} ਦਵਾਈਆਂ ਬਾਕੀ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਸਮੇਂ ਸਿਰ ਲਵੋ।",
            "done": "ਬਹੁਤ ਵਧੀਆ! ਤੁਸੀਂ ਅੱਜ ਦੀਆਂ ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਸਮੇਂ ਸਿਰ ਲੈ ਲਈਆਂ ਹਨ।"
        },
        "od-IN": {
            "pending": "ଆଜି ଆପଣଙ୍କର {count} ଟି ଔଷଧ ବାକି ଅଛି। ଦୟାକରି ଠିକ୍ ସମୟରେ ନିଅନ୍ତୁ।",
            "done": "ବହୁତ ଭଲ! ଆପଣ ଆଜିର ସମସ୍ତ ଔଷଧ ଠିକ୍ ସମୟରେ ନେଇଛନ୍ତି।"
        }
    }

    # Prepare speech summary in selected language
    lang_templates = LOCALIZED_REMINDERS.get(language_code, LOCALIZED_REMINDERS["hi-IN"])
    if pending_count > 0:
        speech_text = lang_templates["pending"].format(count=pending_count)
    else:
        speech_text = lang_templates["done"]

    audio_b64 = sarvam_service.text_to_speech(speech_text, language_code=language_code)

    return {
        "date": today_str,
        "slots": slots,
        "total_medicines": len(rows),
        "taken_count": taken_count,
        "pending_count": pending_count,
        "reminder_text": speech_text,
        "audio_base64": audio_b64
    }

@router.post("")
def add_medicine(med: MedicineCreate):
    med_id = f"med_{uuid.uuid4().hex[:8]}"
    today_str = str(date.today())
    start = med.start_date or today_str

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO medicines (id, user_id, name, dosage, frequency, timing, meal_relation, instructions, start_date, end_date, is_verified, refill_count, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, (
            med_id, med.user_id, med.name, med.dosage, med.frequency,
            med.timing, med.meal_relation, med.instructions, start, med.end_date,
            med.is_verified, med.refill_count
        ))

    return {"id": med_id, "message": "Medicine added successfully"}

@router.post("/toggle")
def toggle_medicine_status(data: MedicineToggle):
    """
    Log or toggle medicine status (taken / pending).
    """
    today_str = str(date.today())
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT id FROM medicine_logs 
        WHERE medicine_id = ? AND scheduled_date = ? AND scheduled_slot = ?
        """, (data.medicine_id, today_str, data.slot))
        existing = cursor.fetchone()

        if existing:
            cursor.execute("""
            UPDATE medicine_logs SET status = ?, logged_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """, (data.status, existing["id"]))
        else:
            log_id = str(uuid.uuid4())
            cursor.execute("""
            INSERT INTO medicine_logs (id, medicine_id, user_id, scheduled_date, scheduled_slot, status)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (log_id, data.medicine_id, data.user_id, today_str, data.slot, data.status))

    return {"status": "success", "new_status": data.status}
