// Aarogya Saathi - Modular API Service Client

import { 
  UserProfile, 
  MedicalDocument, 
  TodayMedicineResponse, 
  Appointment, 
  FamilyCaregiver,
  VoiceAssistantResponse,
  SupportedLanguage,
  InterfaceMode
} from '../types';

const API_BASE = '/api';

export const AarogyaAPI = {
  // Profile
  getProfile: async (): Promise<UserProfile> => {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<void> => {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
  },

  // Voice Assistant
  processVoiceOrText: async (
    queryText?: string, 
    audioBlob?: Blob, 
    language: SupportedLanguage = 'hi-IN', 
    mode: InterfaceMode = 'simple'
  ): Promise<VoiceAssistantResponse> => {
    const formData = new FormData();
    if (audioBlob) formData.append('audio', audioBlob, 'recording.wav');
    if (queryText) formData.append('query_text', queryText);
    formData.append('language_code', language);
    formData.append('mode', mode);

    const res = await fetch(`${API_BASE}/voice/process`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to process voice query');
    return res.json();
  },

  textToSpeech: async (text: string, language: SupportedLanguage = 'hi-IN', pace: number = 1.0): Promise<string> => {
    const res = await fetch(`${API_BASE}/voice/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language_code: language, pace }),
    });
    if (!res.ok) throw new Error('TTS conversion failed');
    const data = await res.json();
    return data.audio_base64;
  },

  // Medicines
  getTodayMedicines: async (language: SupportedLanguage = 'hi-IN'): Promise<TodayMedicineResponse> => {
    const res = await fetch(`${API_BASE}/medicines/today?language_code=${language}`);
    if (!res.ok) throw new Error('Failed to fetch today medicines');
    return res.json();
  },

  toggleMedicine: async (medicineId: string, slot: string, status: 'taken' | 'pending'): Promise<void> => {
    const res = await fetch(`${API_BASE}/medicines/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicine_id: medicineId, slot, status }),
    });
    if (!res.ok) throw new Error('Failed to toggle medicine status');
  },

  // Documents
  getDocuments: async (): Promise<MedicalDocument[]> => {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  explainDocument: async (docId: string, language: SupportedLanguage = 'hi-IN'): Promise<any> => {
    const res = await fetch(`${API_BASE}/documents/${docId}/explain?language_code=${language}`);
    if (!res.ok) throw new Error('Failed to explain document');
    return res.json();
  },

  uploadDocument: async (file: File, docType: string, language: SupportedLanguage = 'hi-IN'): Promise<MedicalDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);
    formData.append('language_code', language);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  // Family Circle
  getFamilyMembers: async (): Promise<FamilyCaregiver[]> => {
    const res = await fetch(`${API_BASE}/family`);
    if (!res.ok) throw new Error('Failed to fetch family circle');
    return res.json();
  },

  // Timeline & Appointments
  getTimeline: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE}/timeline`);
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  },

  getAppointments: async (): Promise<Appointment[]> => {
    const res = await fetch(`${API_BASE}/appointments`);
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  }
};
