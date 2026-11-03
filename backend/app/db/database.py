import sqlite3
import json
from contextlib import contextmanager
from backend.app.config import settings

def get_connection():
    conn = sqlite3.connect(str(settings.DATABASE_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

@contextmanager
def get_db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Users profile
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            phone TEXT,
            language TEXT DEFAULT 'hi-IN',
            interface_mode TEXT DEFAULT 'simple',
            voice_speed REAL DEFAULT 1.0,
            voice_speaker TEXT DEFAULT 'aditya',
            emergency_contact_phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Documents
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            doc_type TEXT NOT NULL, -- prescription, blood_report, discharge_summary, investigation
            file_path TEXT,
            file_type TEXT,
            file_size INTEGER,
            extracted_text TEXT,
            structured_data TEXT, -- JSON
            simplified_summary TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        """)

        # Document chunks for RAG
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS document_chunks (
            id TEXT PRIMARY KEY,
            document_id TEXT NOT NULL,
            chunk_index INTEGER NOT NULL,
            section_title TEXT,
            chunk_text TEXT NOT NULL,
            FOREIGN KEY (document_id) REFERENCES documents(id)
        );
        """)

        # Medicines
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS medicines (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            dosage TEXT NOT NULL,
            frequency TEXT NOT NULL, -- Once daily, Twice daily, etc.
            timing TEXT NOT NULL, -- Morning, Afternoon, Night
            meal_relation TEXT, -- Before Food, After Food
            instructions TEXT,
            start_date TEXT,
            end_date TEXT,
            is_verified INTEGER DEFAULT 1,
            refill_count INTEGER DEFAULT 10,
            active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        """)

        # Medicine logs
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS medicine_logs (
            id TEXT PRIMARY KEY,
            medicine_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            scheduled_date TEXT NOT NULL,
            scheduled_slot TEXT NOT NULL, -- morning, afternoon, night
            status TEXT NOT NULL DEFAULT 'pending', -- taken, missed, pending
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (medicine_id) REFERENCES medicines(id)
        );
        """)

        # Appointments
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            doctor_name TEXT NOT NULL,
            specialty TEXT,
            clinic_name TEXT,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT,
            status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
            notes TEXT,
            questions_checklist TEXT, -- JSON array of questions to ask
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        """)

        # Family members (Caregivers)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS family_members (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            caregiver_name TEXT NOT NULL,
            relationship TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            status TEXT DEFAULT 'active',
            permissions TEXT, -- JSON: {can_view_medicines: bool, can_view_documents: bool, can_view_appointments: bool, is_emergency_contact: bool}
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        """)

        # Caregiver audit logs
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS caregiver_audit_logs (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            family_member_id TEXT NOT NULL,
            caregiver_name TEXT,
            action TEXT NOT NULL,
            target_resource TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # AI Conversations
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS ai_conversations (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            role TEXT NOT NULL, -- user, assistant
            content TEXT NOT NULL,
            language_code TEXT,
            mode TEXT DEFAULT 'simple',
            source_docs TEXT, -- JSON array
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        """)

        # Health Vitals
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS health_vitals (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            vital_type TEXT NOT NULL, -- bp_systolic, bp_diastolic, blood_sugar, pulse, weight
            value REAL NOT NULL,
            unit TEXT,
            status TEXT DEFAULT 'normal', -- normal, high, low
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        """)
