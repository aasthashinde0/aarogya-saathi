// Aarogya Saathi - TypeScript Interfaces and Types

export type InterfaceMode = 'simple' | 'advanced';

export type SupportedLanguage = 
  | 'hi-IN' // Hindi
  | 'en-IN' // English (India)
  | 'mr-IN' // Marathi
  | 'ta-IN' // Tamil
  | 'te-IN' // Telugu
  | 'bn-IN' // Bengali
  | 'gu-IN' // Gujarati
  | 'kn-IN' // Kannada
  | 'ml-IN' // Malayalam
  | 'pa-IN' // Punjabi
  | 'od-IN'; // Odia

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'paused' | 'error' | 'offline';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  language: SupportedLanguage;
  interface_mode: InterfaceMode;
  voice_speed: number;
  voice_speaker: string;
  emergency_contact_phone?: string;
  created_at: string;
}

export interface MedicalDocument {
  id: string;
  user_id: string;
  title: string;
  doc_type: 'prescription' | 'blood_report' | 'discharge_summary' | 'investigation';
  file_path: string;
  file_type: string;
  file_size: number;
  extracted_text?: string;
  structured_data?: {
    document_title?: string;
    doctor_or_lab?: string;
    date?: string;
    simple_explanation?: string;
    important_findings?: Array<{
      label: string;
      value: string;
      status: 'Normal' | 'High' | 'Low' | 'Routine';
      note?: string;
    }>;
    medical_terms_explained?: Array<{
      term: string;
      simple_meaning: string;
    }>;
    questions_for_doctor?: string[];
  };
  simplified_summary?: string;
  created_at: string;
}

export interface Medicine {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: 'Morning' | 'Afternoon' | 'Night' | 'Morning & Night';
  meal_relation?: 'Before Food' | 'After Food';
  instructions?: string;
  start_date?: string;
  end_date?: string;
  is_verified: boolean;
  refill_count: number;
  active: boolean;
}

export interface MedicineSlotGroup {
  morning: Medicine[];
  afternoon: Medicine[];
  night: Medicine[];
}

export interface TodayMedicineResponse {
  date: string;
  slots: MedicineSlotGroup;
  total_medicines: number;
  taken_count: number;
  pending_count: number;
  reminder_text: string;
  audio_base64?: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor_name: string;
  specialty?: string;
  clinic_name?: string;
  appointment_date: string;
  appointment_time?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  questions_checklist?: string[];
}

export interface FamilyCaregiver {
  id: string;
  user_id: string;
  caregiver_name: string;
  relationship: string;
  phone: string;
  email?: string;
  status: 'active' | 'pending' | 'revoked';
  permissions: {
    can_view_medicines: boolean;
    can_view_documents: boolean;
    can_view_appointments: boolean;
    is_emergency_contact: boolean;
  };
}

export interface VoiceAssistantResponse {
  transcript: string;
  answer: string;
  audio_base64?: string;
  cited_documents: string[];
  language_code: SupportedLanguage;
  mode: InterfaceMode;
}
