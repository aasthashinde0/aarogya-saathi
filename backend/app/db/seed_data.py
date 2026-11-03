import json
import uuid
from datetime import datetime, date
from backend.app.db.database import get_db

DEMO_USER_ID = "patient_ramesh_sharma_01"

def seed_demo_data():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if user already seeded
        cursor.execute("SELECT id FROM users WHERE id = ?", (DEMO_USER_ID,))
        if cursor.fetchone():
            return
        
        # 1. User Profile: Ramesh Sharma
        cursor.execute("""
        INSERT INTO users (id, name, age, gender, phone, language, interface_mode, voice_speed, voice_speaker, emergency_contact_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            DEMO_USER_ID,
            "Ramesh Sharma",
            68,
            "Male",
            "+91 98765 43210",
            "hi-IN",
            "simple",
            1.0,
            "aditya",
            "+91 98220 12345"
        ))

        # 2. Synthetic Documents
        doc_presc_id = "doc_presc_01"
        presc_text = """DR. ASHOK MEHTA, MD (Cardiology)
Fortis Hospital, New Delhi
Date: 28 October 2026
Patient: Ramesh Sharma, 68/M
Diagnosis: Type 2 Diabetes Mellitus, Essential Hypertension (Stage 1)

Rx (Prescription):
1. Tab. Glycomet-GP 1 (Metformin 500mg + Glimepiride 1mg)
   1 tablet twice daily, before meals (Morning & Night). Duration: 30 days.
2. Tab. Telma 40 (Telmisartan 40mg)
   1 tablet once daily, after breakfast (Morning). Duration: 30 days.
3. Tab. Atorva 10 (Atorvastatin 10mg)
   1 tablet once daily at night after dinner. Duration: 30 days.

Advice:
- Restrict salt intake (< 5g per day)
- 30 minutes brisk walking daily
- Regular blood sugar monitoring (Fasting & Post-Prandial)
- Review with HbA1c & Lipid Profile reports in 3 weeks.
"""
        presc_structured = {
            "doctor": "Dr. Ashok Mehta, MD (Cardiology)",
            "clinic": "Fortis Hospital, New Delhi",
            "date": "2026-10-28",
            "patient": "Ramesh Sharma, 68/M",
            "diagnosis": ["Type 2 Diabetes Mellitus", "Essential Hypertension (Stage 1)"],
            "medications": [
                {
                    "name": "Glycomet-GP 1 (Metformin 500mg + Glimepiride 1mg)",
                    "dosage": "1 tablet",
                    "frequency": "Twice daily",
                    "timing": "Morning & Night",
                    "instruction": "Take before meals to regulate blood glucose",
                    "verified": True
                },
                {
                    "name": "Telma 40 (Telmisartan 40mg)",
                    "dosage": "1 tablet",
                    "frequency": "Once daily",
                    "timing": "Morning",
                    "instruction": "Take after breakfast for blood pressure control",
                    "verified": True
                },
                {
                    "name": "Atorva 10 (Atorvastatin 10mg)",
                    "dosage": "1 tablet",
                    "frequency": "Once daily",
                    "timing": "Night",
                    "instruction": "Take after dinner for cholesterol management",
                    "verified": True
                }
            ],
            "lifestyle_advice": [
                "Salt restriction (< 5g/day)",
                "30 mins brisk walking daily",
                "Regular glucose checks"
            ],
            "followup": "Review in 3 weeks with HbA1c and Lipid Profile"
        }
        presc_summary = "डॉ. अशोक मेहता का पर्चा (28 अक्टूबर 2026): शुगर और ब्लड प्रेशर के नियंत्रण के लिए 3 मुख्य दवाएं (ग्लाइकोमेट-जीपी 1, टेलमा 40, एटोरवा 10) लिखी गई हैं। कम नमक खाने और रोजाना 30 मिनट टहलने की सलाह दी गई है।"

        cursor.execute("""
        INSERT INTO documents (id, user_id, title, doc_type, file_path, file_type, file_size, extracted_text, structured_data, simplified_summary, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc_presc_id,
            DEMO_USER_ID,
            "डॉक्टर पर्चा - डॉ. अशोक मेहता (28 Oct 2026)",
            "prescription",
            "uploads/sample_prescription.txt",
            "text/plain",
            1240,
            presc_text,
            json.dumps(presc_structured, ensure_ascii=False),
            presc_summary,
            "2026-10-28 10:30:00"
        ))

        # Document Chunks for Prescription
        cursor.execute("""
        INSERT INTO document_chunks (id, document_id, chunk_index, section_title, chunk_text)
        VALUES (?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), doc_presc_id, 0, "Doctor & Diagnosis",
            "Dr. Ashok Mehta (Cardiology) - Fortis Hospital. Diagnosis: Type 2 Diabetes Mellitus, Essential Hypertension. Patient: Ramesh Sharma, 68/M."
        ))
        cursor.execute("""
        INSERT INTO document_chunks (id, document_id, chunk_index, section_title, chunk_text)
        VALUES (?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), doc_presc_id, 1, "Prescribed Medications",
            "1. Tab Glycomet-GP 1 (Metformin 500mg + Glimepiride 1mg) twice daily before food. 2. Tab Telma 40 (Telmisartan 40mg) morning after breakfast. 3. Tab Atorva 10 (Atorvastatin 10mg) night after dinner."
        ))

        # Document 2: Blood Investigation Report
        doc_lab_id = "doc_blood_report_01"
        lab_text = """METROPOLIS HEALTHCARE LABS
Comprehensive Metabolic & Glycemic Profile
Date of Collection: 30 October 2026
Patient: Ramesh Sharma | Age/Gender: 68 Y / Male | Ref: Dr. Ashok Mehta

TEST PARAMETERS & RESULTS:
1. Fasting Blood Glucose (FBG):
   Result: 142 mg/dL | Normal Range: 70 - 100 mg/dL | Status: HIGH (Elevated)
2. Glycated Haemoglobin (HbA1c):
   Result: 7.8 % | Normal Range: < 5.7 %, Good Control in Diabetes: < 7.0 % | Status: HIGH (Sub-optimal Control)
   Estimated Average Glucose: 177 mg/dL
3. Complete Blood Count (CBC) - Haemoglobin:
   Result: 13.8 g/dL | Normal Range: 13.0 - 17.0 g/dL | Status: NORMAL
4. Kidney Function - Serum Creatinine:
   Result: 1.05 mg/dL | Normal Range: 0.7 - 1.2 mg/dL | Status: NORMAL
5. Lipid Profile - Total Cholesterol:
   Result: 195 mg/dL | Desirable: < 200 mg/dL | Status: NORMAL
   LDL Cholesterol: 118 mg/dL | Optimal: < 100 mg/dL | Status: BORDERLINE HIGH
"""
        lab_structured = {
            "lab": "Metropolis Healthcare Labs",
            "date": "2026-10-30",
            "patient": "Ramesh Sharma, 68 Y / Male",
            "parameters": [
                {
                    "name": "Fasting Blood Glucose",
                    "value": "142 mg/dL",
                    "normal_range": "70 - 100 mg/dL",
                    "status": "High",
                    "plain_explanation": "फास्टिंग ब्लड शुगर 142 है, जो सामान्य (70-100) से अधिक है। इसका मतलब है कि शुगर को और बेहतर नियंत्रित करने की जरूरत है।"
                },
                {
                    "name": "HbA1c (Glycated Haemoglobin)",
                    "value": "7.8 %",
                    "normal_range": "< 7.0 % for diabetes",
                    "status": "High",
                    "plain_explanation": "पिछले 3 महीनों की औसत शुगर 7.8% है। यह लक्ष्य (7.0% से कम) से थोड़ी ऊंची है।"
                },
                {
                    "name": "Haemoglobin (CBC)",
                    "value": "13.8 g/dL",
                    "normal_range": "13.0 - 17.0 g/dL",
                    "status": "Normal",
                    "plain_explanation": "खून की मात्रा (हीमोग्लोबिन) 13.8 ग्राम बिल्कुल स्वस्थ और सामान्य है।"
                },
                {
                    "name": "Serum Creatinine",
                    "value": "1.05 mg/dL",
                    "normal_range": "0.7 - 1.2 mg/dL",
                    "status": "Normal",
                    "plain_explanation": "किडनी का मुख्य टेस्ट (सीरम क्रिएटिनिन) 1.05 बिल्कुल सामान्य स्तर पर है।"
                }
            ],
            "questions_for_doctor": [
                "क्या मुझे शुगर की दवा (ग्लाइकोमेट-जीपी 1) की मात्रा में कोई बदलाव करना चाहिए?",
                "क्या मुझे सुबह नाश्ते से पहले टहलना चाहिए या बाद में?",
                "अगला HbA1c टेस्ट कितने महीनों बाद कराना चाहिए?"
            ]
        }
        lab_summary = "ब्लड रिपोर्ट (30 अक्टूबर 2026): हीमोग्लोबिन (13.8 g/dL) और किडनी फंक्शन (क्रिएटिनिन 1.05 mg/dL) बिल्कुल सामान्य हैं। फास्टिंग ब्लड शुगर 142 mg/dL और HbA1c 7.8% है, जो सामान्य से थोड़ा अधिक है। अपने डॉक्टर से शुगर नियंत्रण की समीक्षा करें।"

        cursor.execute("""
        INSERT INTO documents (id, user_id, title, doc_type, file_path, file_type, file_size, extracted_text, structured_data, simplified_summary, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc_lab_id,
            DEMO_USER_ID,
            "खून की जांच रिपोर्ट - Metropolis Labs (30 Oct 2026)",
            "blood_report",
            "uploads/sample_blood_report.txt",
            "text/plain",
            1450,
            lab_text,
            json.dumps(lab_structured, ensure_ascii=False),
            lab_summary,
            "2026-10-30 14:15:00"
        ))

        # Chunks for Blood Report
        cursor.execute("""
        INSERT INTO document_chunks (id, document_id, chunk_index, section_title, chunk_text)
        VALUES (?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), doc_lab_id, 0, "Glycemic Status (Sugar & HbA1c)",
            "Metropolis Labs 30 Oct 2026. Fasting Blood Glucose is 142 mg/dL (High, normal 70-100). Glycated Haemoglobin HbA1c is 7.8% (High, good diabetic control is under 7.0%). Average estimated glucose is 177 mg/dL."
        ))
        cursor.execute("""
        INSERT INTO document_chunks (id, document_id, chunk_index, section_title, chunk_text)
        VALUES (?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), doc_lab_id, 1, "Haemoglobin & Kidney Function",
            "Complete Blood Count Haemoglobin is 13.8 g/dL (Normal range 13-17 g/dL). Kidney function Serum Creatinine is 1.05 mg/dL (Normal range 0.7-1.2 mg/dL). Total Cholesterol is 195 mg/dL."
        ))

        # 3. Scheduled Medicines
        medicines = [
            (
                "med_01", DEMO_USER_ID, "Glycomet-GP 1", "1 Tablet (500mg/1mg)",
                "Twice daily", "Morning & Night", "Before Food",
                "नाश्ते और रात के खाने से 15 मिनट पहले लें (शुगर नियंत्रण)",
                "2026-10-28", "2026-11-28", 1, 24, 1
            ),
            (
                "med_02", DEMO_USER_ID, "Telma 40", "1 Tablet (40mg)",
                "Once daily", "Morning", "After Food",
                "सुबह नाश्ते के बाद पानी के साथ लें (ब्लड प्रेशर नियंत्रण)",
                "2026-10-28", "2026-11-28", 1, 26, 1
            ),
            (
                "med_03", DEMO_USER_ID, "Atorva 10", "1 Tablet (10mg)",
                "Once daily", "Night", "After Food",
                "रात को सोने से पहले खाने के बाद लें (कोलेस्ट्रॉल)",
                "2026-10-28", "2026-11-28", 1, 28, 1
            )
        ]
        cursor.executemany("""
        INSERT INTO medicines (id, user_id, name, dosage, frequency, timing, meal_relation, instructions, start_date, end_date, is_verified, refill_count, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, medicines)

        # Today's medicine logs
        today_str = str(date.today())
        logs = [
            (str(uuid.uuid4()), "med_01", DEMO_USER_ID, today_str, "morning", "taken", f"{today_str} 08:30:00"),
            (str(uuid.uuid4()), "med_02", DEMO_USER_ID, today_str, "morning", "taken", f"{today_str} 09:15:00"),
            (str(uuid.uuid4()), "med_01", DEMO_USER_ID, today_str, "night", "pending", None),
            (str(uuid.uuid4()), "med_03", DEMO_USER_ID, today_str, "night", "pending", None)
        ]
        cursor.executemany("""
        INSERT INTO medicine_logs (id, medicine_id, user_id, scheduled_date, scheduled_slot, status, logged_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, logs)

        # 4. Upcoming Appointment
        questions = [
            "क्या मेरी फास्टिंग शुगर 142 के लिए दवा बदलने की जरूरत है?",
            "क्या सुबह की सैर 45 मिनट कर सकता हूँ?",
            "पैरों में कभी-कभी हल्की झनझनाहट होती है, क्या यह शुगर से है?"
        ]
        cursor.execute("""
        INSERT INTO appointments (id, user_id, doctor_name, specialty, clinic_name, appointment_date, appointment_time, status, notes, questions_checklist)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "apt_01", DEMO_USER_ID, "Dr. Ashok Mehta", "Senior Cardiologist & Diabetologist",
            "Fortis Hospital OPD, Room 204", "2026-11-18", "11:30 AM", "scheduled",
            "3-week follow-up for blood sugar & hypertension review",
            json.dumps(questions, ensure_ascii=False)
        ))

        # 5. Family Circle (Caregiver: Daughter Priya)
        caregiver_perms = {
            "can_view_medicines": True,
            "can_view_documents": True,
            "can_view_appointments": True,
            "is_emergency_contact": True
        }
        cursor.execute("""
        INSERT INTO family_members (id, user_id, caregiver_name, relationship, phone, email, status, permissions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "fam_01", DEMO_USER_ID, "Priya Sharma", "Daughter (बेटी)",
            "+91 98220 12345", "priya.sharma@example.com", "active",
            json.dumps(caregiver_perms)
        ))

        # Audit logs
        cursor.execute("""
        INSERT INTO caregiver_audit_logs (id, user_id, family_member_id, caregiver_name, action, target_resource, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), DEMO_USER_ID, "fam_01", "Priya Sharma",
            "VIEWED_MEDICINE_SCHEDULE", "Today's morning medicines verified taken",
            f"{today_str} 09:30:00"
        ))

        # 6. Sample AI Conversations
        cursor.execute("""
        INSERT INTO ai_conversations (id, user_id, role, content, language_code, mode, source_docs, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), DEMO_USER_ID, "user",
            "मेरी रिपोर्ट में हीमोग्लोबिन कितना है और क्या यह ठीक है?",
            "hi-IN", "simple", "[]", f"{today_str} 10:00:00"
        ))
        cursor.execute("""
        INSERT INTO ai_conversations (id, user_id, role, content, language_code, mode, source_docs, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), DEMO_USER_ID, "assistant",
            "रमेश जी, आपकी 30 अक्टूबर की खून की जांच रिपोर्ट के अनुसार आपका हीमोग्लोबिन 13.8 g/dL है। सामान्य सीमा 13.0 से 17.0 g/dL होती है। इसलिए आपका हीमोग्लोबिन बिल्कुल सामान्य और अच्छा है।",
            "hi-IN", "simple", json.dumps(["doc_blood_report_01"]), f"{today_str} 10:00:05"
        ))

        # 7. Vitals
        vitals = [
            (str(uuid.uuid4()), DEMO_USER_ID, "blood_pressure", 132.0, "mmHg (Systolic)", "normal", f"{today_str} 08:00:00"),
            (str(uuid.uuid4()), DEMO_USER_ID, "fasting_sugar", 142.0, "mg/dL", "high", f"{today_str} 07:45:00"),
            (str(uuid.uuid4()), DEMO_USER_ID, "pulse", 74.0, "bpm", "normal", f"{today_str} 08:00:00"),
            (str(uuid.uuid4()), DEMO_USER_ID, "hba1c", 7.8, "%", "high", "2026-10-30 14:15:00")
        ]
        cursor.executemany("""
        INSERT INTO health_vitals (id, user_id, vital_type, value, unit, status, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, vitals)
