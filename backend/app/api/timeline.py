import uuid
import json
from typing import Optional, List
from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.db.database import get_db

router = APIRouter(tags=["Timeline & Appointments"])

class AppointmentCreate(BaseModel):
    doctor_name: str
    specialty: Optional[str] = "General Physician"
    clinic_name: Optional[str] = "Clinic"
    appointment_date: str
    appointment_time: Optional[str] = "10:00 AM"
    notes: Optional[str] = ""
    questions: Optional[List[str]] = []
    user_id: Optional[str] = "patient_ramesh_sharma_01"

@router.get("/appointments")
def list_appointments(user_id: str = "patient_ramesh_sharma_01"):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_date ASC
        """, (user_id,))
        rows = cursor.fetchall()
        appointments = []
        for r in rows:
            a = dict(r)
            if a.get("questions_checklist"):
                try:
                    a["questions_checklist"] = json.loads(a["questions_checklist"])
                except Exception:
                    pass
            appointments.append(a)
        return appointments

@router.post("/appointments")
def create_appointment(data: AppointmentCreate):
    apt_id = f"apt_{uuid.uuid4().hex[:8]}"
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO appointments (id, user_id, doctor_name, specialty, clinic_name, appointment_date, appointment_time, status, notes, questions_checklist)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, ?)
        """, (
            apt_id, data.user_id, data.doctor_name, data.specialty,
            data.clinic_name, data.appointment_date, data.appointment_time,
            data.notes, json.dumps(data.questions, ensure_ascii=False)
        ))
    return {"id": apt_id, "message": "Appointment scheduled"}

@router.get("/timeline")
def get_health_timeline(user_id: str = "patient_ramesh_sharma_01"):
    """
    Returns unified chronological events across documents, appointments, vitals, and medicines.
    """
    events = []
    with get_db() as conn:
        cursor = conn.cursor()

        # Documents
        cursor.execute("SELECT id, title, doc_type, created_at, simplified_summary FROM documents WHERE user_id = ?", (user_id,))
        for d in cursor.fetchall():
            events.append({
                "type": "document",
                "subtype": d["doc_type"],
                "title": d["title"],
                "description": d["simplified_summary"] or "Medical document added",
                "timestamp": d["created_at"],
                "id": d["id"]
            })

        # Appointments
        cursor.execute("SELECT id, doctor_name, specialty, appointment_date, appointment_time, status, clinic_name FROM appointments WHERE user_id = ?", (user_id,))
        for a in cursor.fetchall():
            events.append({
                "type": "appointment",
                "subtype": a["status"],
                "title": f"Consultation: {a['doctor_name']} ({a['specialty']})",
                "description": f"Location: {a['clinic_name']} at {a['appointment_time']}",
                "timestamp": f"{a['appointment_date']} {a['appointment_time'] or '00:00:00'}",
                "id": a["id"]
            })

        # Vitals
        cursor.execute("SELECT id, vital_type, value, unit, status, recorded_at FROM health_vitals WHERE user_id = ?", (user_id,))
        for v in cursor.fetchall():
            vital_label = v["vital_type"].replace("_", " ").title()
            events.append({
                "type": "vital",
                "subtype": v["status"],
                "title": f"Recorded {vital_label}: {v['value']} {v['unit']}",
                "description": f"Status: {v['status'].upper()}",
                "timestamp": v["recorded_at"],
                "id": v["id"]
            })

    # Sort descending by timestamp
    events.sort(key=lambda x: str(x["timestamp"]), reverse=True)
    return events
