-- Seed Data for Aarogya Saathi Supabase Instance
-- Patient: Ramesh Sharma (68/M)

INSERT INTO public.users (id, name, age, gender, phone, language, interface_mode, voice_speed, voice_speaker, emergency_contact_phone)
VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'Ramesh Sharma',
    68,
    'Male',
    '+91 98765 43210',
    'hi-IN',
    'simple',
    1.0,
    'aditya',
    '+91 98220 12345'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.documents (id, user_id, title, doc_type, file_path, file_type, file_size, extracted_text, structured_data, simplified_summary)
VALUES (
    'b2000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'डॉक्टर पर्चा - डॉ. अशोक मेहता (28 Oct 2026)',
    'prescription',
    'uploads/sample_prescription.txt',
    'text/plain',
    1240,
    'DR. ASHOK MEHTA, MD (Cardiology) - Fortis Hospital. Diagnosis: Type 2 Diabetes Mellitus, Essential Hypertension. Rx: 1. Tab Glycomet-GP 1 twice daily before food. 2. Tab Telma 40 once daily after breakfast. 3. Tab Atorva 10 once daily at night.',
    '{"doctor": "Dr. Ashok Mehta", "diagnosis": ["Type 2 Diabetes Mellitus", "Essential Hypertension"], "medications": [{"name": "Glycomet-GP 1", "dosage": "1 tablet twice daily"}, {"name": "Telma 40", "dosage": "1 tablet once daily"}]}'::jsonb,
    'डॉ. अशोक मेहता का पर्चा: शुगर और ब्लड प्रेशर के नियंत्रण के लिए 3 मुख्य दवाएं लिखी गई हैं। कम नमक खाने और रोजाना 30 मिनट टहलने की सलाह दी गई है।'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.medicines (id, user_id, name, dosage, frequency, timing, meal_relation, instructions, start_date, end_date, is_verified, refill_count, active)
VALUES 
(
    'c3000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'Glycomet-GP 1',
    '1 Tablet (500mg/1mg)',
    'Twice daily',
    'Morning & Night',
    'Before Food',
    'नाश्ते और रात के खाने से 15 मिनट पहले लें',
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '20 days',
    true,
    24,
    true
),
(
    'c3000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000001',
    'Telma 40',
    '1 Tablet (40mg)',
    'Once daily',
    'Morning',
    'After Food',
    'सुबह नाश्ते के बाद पानी के साथ लें',
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '20 days',
    true,
    26,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.family_members (id, user_id, caregiver_name, relationship, phone, email, status, permissions)
VALUES (
    'd4000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'Priya Sharma',
    'Daughter (बेटी)',
    '+91 98220 12345',
    'priya.sharma@example.com',
    'active',
    '{"can_view_medicines": true, "can_view_documents": true, "can_view_appointments": true, "is_emergency_contact": true}'::jsonb
) ON CONFLICT (id) DO NOTHING;
