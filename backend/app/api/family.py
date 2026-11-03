import uuid
import json
from typing import Optional, Dict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.db.database import get_db

router = APIRouter(prefix="/family", tags=["Family"])

class CaregiverInvite(BaseModel):
    caregiver_name: str
    relationship: str
    phone: str
    email: Optional[str] = ""
    can_view_medicines: bool = True
    can_view_documents: bool = False
    can_view_appointments: bool = True
    is_emergency_contact: bool = True
    user_id: Optional[str] = "patient_ramesh_sharma_01"

@router.get("")
def list_family_members(user_id: str = "patient_ramesh_sharma_01"):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM family_members WHERE user_id = ?", (user_id,))
        rows = cursor.fetchall()
        members = []
        for r in rows:
            m = dict(r)
            if m.get("permissions"):
                try:
                    m["permissions"] = json.loads(m["permissions"])
                except Exception:
                    pass
            members.append(m)
        return members

@router.post("/invite")
def invite_caregiver(data: CaregiverInvite):
    member_id = f"fam_{uuid.uuid4().hex[:8]}"
    permissions = {
        "can_view_medicines": data.can_view_medicines,
        "can_view_documents": data.can_view_documents,
        "can_view_appointments": data.can_view_appointments,
        "is_emergency_contact": data.is_emergency_contact
    }

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO family_members (id, user_id, caregiver_name, relationship, phone, email, status, permissions)
        VALUES (?, ?, ?, ?, ?, ?, 'active', ?)
        """, (
            member_id, data.user_id, data.caregiver_name, data.relationship,
            data.phone, data.email, json.dumps(permissions)
        ))

        # Add audit log
        cursor.execute("""
        INSERT INTO caregiver_audit_logs (id, user_id, family_member_id, caregiver_name, action, target_resource)
        VALUES (?, ?, ?, ?, 'INVITED_CAREGIVER', 'Caregiver joined family circle')
        """, (str(uuid.uuid4()), data.user_id, member_id, data.caregiver_name))

    return {"id": member_id, "message": f"{data.caregiver_name} has been added to your Family Circle"}

@router.delete("/{member_id}")
def revoke_caregiver(member_id: str, user_id: str = "patient_ramesh_sharma_01"):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT caregiver_name FROM family_members WHERE id = ? AND user_id = ?", (member_id, user_id))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Caregiver not found")

        name = row["caregiver_name"]
        cursor.execute("DELETE FROM family_members WHERE id = ? AND user_id = ?", (member_id, user_id))
        
        # Log revocation
        cursor.execute("""
        INSERT INTO caregiver_audit_logs (id, user_id, family_member_id, caregiver_name, action, target_resource)
        VALUES (?, ?, ?, ?, 'REVOKED_ACCESS', 'Caregiver access was revoked by patient')
        """, (str(uuid.uuid4()), user_id, member_id, name))

    return {"message": f"Access revoked for {name}"}

@router.get("/audit")
def get_audit_trail(user_id: str = "patient_ramesh_sharma_01"):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT * FROM caregiver_audit_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20
        """, (user_id,))
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
