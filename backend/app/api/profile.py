from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.config import settings
from backend.app.db.database import get_db

router = APIRouter(prefix="/profile", tags=["Profile & Settings"])

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    language: Optional[str] = None
    interface_mode: Optional[str] = None # simple or advanced
    voice_speed: Optional[float] = None
    voice_speaker: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

@router.get("")
def get_profile(user_id: str = "patient_ramesh_sharma_01"):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return dict(row)

@router.put("")
def update_profile(data: ProfileUpdate, user_id: str = "patient_ramesh_sharma_01"):
    with get_db() as conn:
        cursor = conn.cursor()
        
        fields = []
        values = []
        for k, v in data.dict(exclude_unset=True).items():
            if v is not None:
                fields.append(f"{k} = ?")
                values.append(v)
        
        if not fields:
            return {"message": "Nothing to update"}

        values.append(user_id)
        query = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"
        cursor.execute(query, tuple(values))

    return {"message": "Profile updated successfully"}

@router.get("/languages")
def get_languages():
    return [
        {"code": code, "name": meta["name"], "native": meta["native"], "default_speaker": meta["default_speaker"]}
        for code, meta in settings.SUPPORTED_LANGUAGES.items()
    ]
