/**
 * AAROGYA SAATHI - FRONTEND APPLICATION CORE
 * Multilingual, Voice-First AI Healthcare Companion
 */

const STATE = {
  mode: 'simple', // 'simple' | 'advanced'
  language: 'hi-IN',
  voiceSpeed: 1.0,
  voiceState: 'idle', // 'idle' | 'listening' | 'processing' | 'speaking' | 'error'
  lastAudioBase64: null,
  currentAudio: null,
  mediaRecorder: null,
  audioChunks: [],
  isRecording: false,
  documents: [],
  medicines: null,
  appointments: [],
  timeline: [],
  family: []
};

// ============================================================================
// COMPREHENSIVE MULTILINGUAL LOCALIZATION (I18N)
// ============================================================================
const I18N = {
  'mr-IN': {
    brand_title: 'आरोग्य साथी',
    brand_subtitle: 'आरोग्य साथी • हेल्थकेअर एआय',
    mode_simple: 'सोपा मोड (Simple)',
    mode_advanced: 'प्रगत मोड (Advanced)',
    sos: 'आपत्कालीन (SOS)',
    greeting: 'नमस्कार, रमेशजी',
    subgreeting: 'आज तुम्हाला कसे वाटत आहे?',
    voice_state_idle: 'मदतनीस तयार आहे • Assistant Ready',
    voice_state_listening: 'ऐकत आहे... बोला • Listening...',
    voice_state_processing: 'विचार करत आहे... • Processing...',
    voice_state_speaking: 'उत्तर देत आहे... • Speaking',
    voice_state_error: 'पुन्हा प्रयत्न करा • Try Again',
    voice_prompt: 'टॅप करा आणि बोला',
    voice_hint: '"माझी आजची औषधे सांगा" किंवा "माझा रक्त तपासणी अहवाल समजावून सांगा"',
    repeat_audio: 'पुन्हा ऐका',
    slow_audio: 'हळू आवाज (0.8x)',
    normal_audio: 'सामान्य आवाज (1.0x)',
    stop_audio: 'थांबवा',
    card_meds_title: 'माझी औषधे (Medicines)',
    card_meds_summary_default: 'आज सकाळची २ औषधे घेतली, रात्रीची २ बाकी आहेत.',
    card_meds_badge: 'औषध यादी पहा >',
    card_reports_title: 'माझे अहवाल (Reports)',
    card_reports_summary: 'डॉ. अशोक मेहतांचे प्रिस्क्रिप्शन आणि 30 ऑक्टोबरची रक्त तपासणी.',
    card_reports_badge: 'सोप्या भाषेत समजून घ्या >',
    card_doctor_title: 'डॉक्टर भेट (Doctor)',
    card_doctor_summary: '18 नोव्हेंबरला डॉ. अशोक मेहता (फोर्टिस रुग्णालय).',
    card_doctor_badge: 'विचारायचे प्रश्न >',
    card_family_title: 'माझे कुटुंब (Family)',
    card_family_summary: 'प्रिया शर्मा (मुलगी) - तुमच्या आरोग्याची काळजी घेत आहेत.',
    card_family_badge: 'संपर्क करा >',
    nav_home: 'मुख्य पान',
    nav_meds: 'औषधे',
    nav_reports: 'अहवाल',
    nav_family: 'कुटुंब',
    modal_response_title: 'आरोग्य साथीचे उत्तर',
    modal_replay: '🔁 पुन्हा ऐका (Replay)',
    modal_close: 'ठीक आहे (Close)',
    chat_placeholder: 'तुमच्या अहवाल, औषधे किंवा डॉक्टरांच्या भेटीबद्दल प्रश्न विचारा...',
    doc_listen_summary: '🔊 सोपे स्पष्टीकरण ऐका (Listen in Marathi)',
    doc_summary_title: 'सोपा सारांश (Simplified Summary):',
    doc_findings_title: 'मुख्य तपासणी निकाल (Key Findings):',
    doc_questions_title: 'डॉक्टरांना विचारायचे प्रश्न (Questions to Ask Doctor):',
    upload_prompt: '📤 येथे टॅप करा किंवा वैद्यकीय कागदपत्रे अपलोड करा (PDF / फोटो)',
    tab_overview: '📊 आरोग्य सारांश',
    tab_documents: '📁 वैद्यकीय कागदपत्रे',
    tab_chat: '🤖 एआय चर्चा',
    tab_medicines: '💊 औषध व्यवस्थापक',
    tab_timeline: '📅 भेटी व प्रवास',
    tab_family: '👥 कुटुंब मंडळ'
  },
  'hi-IN': {
    brand_title: 'आरोग्य साथी',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'Simple Mode',
    mode_advanced: 'Advanced Mode',
    sos: 'SOS',
    greeting: 'नमस्ते, रमेश जी',
    subgreeting: 'आज आप कैसा महसूस कर रहे हैं?',
    voice_state_idle: 'सहायक तैयार है • Assistant Ready',
    voice_state_listening: 'सुन रहा हूँ... बोलिए • Listening...',
    voice_state_processing: 'विचार कर रहा हूँ... • Processing...',
    voice_state_speaking: 'बोल रहा हूँ... • Speaking',
    voice_state_error: 'पुनः प्रयास करें • Try Again',
    voice_prompt: 'टैप करें और बोलें',
    voice_hint: '"मेरी आज की दवाइयाँ बताओ" या "मेरी ब्लड रिपोर्ट समझाओ"',
    repeat_audio: 'फिर से सुनें',
    slow_audio: 'धीमी आवाज़ (0.8x)',
    normal_audio: 'सामान्य आवाज़ (1.0x)',
    stop_audio: 'रोकें',
    card_meds_title: 'मेरी दवाइयाँ (Medicines)',
    card_meds_summary_default: 'आज सुबह की 2 दवाइयाँ लीं, रात की 2 बाकी हैं।',
    card_meds_badge: 'दवा सूची देखें >',
    card_reports_title: 'मेरी रिपोर्ट्स (Reports)',
    card_reports_summary: 'डॉ. अशोक मेहता का पर्चा और 30 Oct की खून जांच।',
    card_reports_badge: 'सरल भाषा में समझें >',
    card_doctor_title: 'डॉक्टर अपॉइंटमेंट (Doctor)',
    card_doctor_summary: '18 नवम्बर को डॉ. अशोक मेहता (फोर्टिस अस्पताल)।',
    card_doctor_badge: 'पूछने योग्य सवाल >',
    card_family_title: 'मेरा परिवार (Family)',
    card_family_summary: 'प्रिया शर्मा (बेटी) - आपकी स्वास्थ्य देखभाल में जुड़ी हैं।',
    card_family_badge: 'संपर्क करें >',
    nav_home: 'Home',
    nav_meds: 'Medicines',
    nav_reports: 'Reports',
    nav_family: 'Family',
    modal_response_title: 'आरोग्य साथी का उत्तर',
    modal_replay: '🔁 फिर से सुनें (Replay)',
    modal_close: 'ठीक है (Close)',
    chat_placeholder: 'Ask a question about your reports, medicines, or appointments...',
    doc_listen_summary: '🔊 सरल व्याख्या सुनें (Listen in Native Voice)',
    doc_summary_title: 'सरल सारांश (Simplified Summary):',
    doc_findings_title: 'मुख्य जांच परिणाम (Key Findings):',
    doc_questions_title: 'डॉक्टर से पूछने योग्य सवाल (Questions to Ask Doctor):',
    upload_prompt: '📤 Tap here or drag medical records (PDF or Images)',
    tab_overview: '📊 Health Overview',
    tab_documents: '📁 Medical Documents',
    tab_chat: '🤖 Document AI Chat',
    tab_medicines: '💊 Medicine Manager',
    tab_timeline: '📅 Timeline & Visits',
    tab_family: '👥 Family Circle'
  },
  'en-IN': {
    brand_title: 'Aarogya Saathi',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'Simple Mode',
    mode_advanced: 'Advanced Mode',
    sos: 'SOS',
    greeting: 'Hello, Ramesh',
    subgreeting: 'How are you feeling today?',
    voice_state_idle: 'Assistant Ready',
    voice_state_listening: 'Listening... Please speak',
    voice_state_processing: 'Consulting medical records...',
    voice_state_speaking: 'Speaking response',
    voice_state_error: 'Voice error, please retry',
    voice_prompt: 'Tap and speak. I\'m here to help.',
    voice_hint: '"Tell me today\'s medicines" or "Explain my blood report"',
    repeat_audio: 'Listen Again',
    slow_audio: 'Slow Voice (0.8x)',
    normal_audio: 'Normal Voice (1.0x)',
    stop_audio: 'Stop',
    card_meds_title: 'My Medicines',
    card_meds_summary_default: 'Took 2 morning medicines, 2 night medicines pending.',
    card_meds_badge: 'View Schedule >',
    card_reports_title: 'My Reports',
    card_reports_summary: 'Dr. Ashok Mehta\'s prescription & Oct 30 blood panel.',
    card_reports_badge: 'Explain in Simple Words >',
    card_doctor_title: 'Doctor Appointment',
    card_doctor_summary: 'Nov 18 with Dr. Ashok Mehta (Fortis Hospital).',
    card_doctor_badge: 'Questions to Ask >',
    card_family_title: 'My Family',
    card_family_summary: 'Priya Sharma (Daughter) - Connected as your caregiver.',
    card_family_badge: 'Contact >',
    nav_home: 'Home',
    nav_meds: 'Medicines',
    nav_reports: 'Reports',
    nav_family: 'Family',
    modal_response_title: 'Aarogya Saathi\'s Response',
    modal_replay: '🔁 Listen Again (Replay)',
    modal_close: 'Close',
    chat_placeholder: 'Ask a question about your reports, medicines, or appointments...',
    doc_listen_summary: '🔊 Listen to Simple Explanation',
    doc_summary_title: 'Simplified Summary:',
    doc_findings_title: 'Key Findings:',
    doc_questions_title: 'Questions to Ask Doctor:',
    upload_prompt: '📤 Tap here or drag medical records (PDF or Images)',
    tab_overview: '📊 Health Overview',
    tab_documents: '📁 Medical Documents',
    tab_chat: '🤖 Document AI Chat',
    tab_medicines: '💊 Medicine Manager',
    tab_timeline: '📅 Timeline & Visits',
    tab_family: '👥 Family Circle'
  },
  'ta-IN': {
    brand_title: 'ஆரோக்ய சாதி',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'எளிய முறை (Simple)',
    mode_advanced: 'முழுமையான முறை (Advanced)',
    sos: 'அவசரம் (SOS)',
    greeting: 'வணக்கம், ரமேஷ் அவர்களே',
    subgreeting: 'இன்று உங்கள் உடல்நலம் எப்படி உள்ளது?',
    voice_state_idle: 'உதவியாளர் தயார் • Assistant Ready',
    voice_state_listening: 'கேட்கிறது... பேசுங்கள் • Listening...',
    voice_state_processing: 'ஆராய்கிறது... • Processing...',
    voice_state_speaking: 'பதில் கூறுகிறது... • Speaking',
    voice_state_error: 'மீண்டும் முயற்சிக்கவும் • Try Again',
    voice_prompt: 'தட்டிப் பேசுங்கள்',
    voice_hint: '"இன்றைய மருந்துகளைக் கூறு" அல்லது "என் இரத்த அறிக்கையை விளக்கு"',
    repeat_audio: 'மீண்டும் கேட்க',
    slow_audio: 'மெதுவான குரல் (0.8x)',
    normal_audio: 'சாதாரண குரல் (1.0x)',
    stop_audio: 'நிறுத்து',
    card_meds_title: 'என் மருந்துகள் (Medicines)',
    card_meds_summary_default: 'காலையில் 2 மருந்துகள் எடுக்கப்பட்டன, இரவில் 2 மீதமுள்ளன.',
    card_meds_badge: 'மருந்துப் பட்டியல் >',
    card_reports_title: 'என் மருத்துவ அறிக்கைகள் (Reports)',
    card_reports_summary: 'டாக்டர் அசோக் மேத்தாவின் மருந்துச் சீட்டு மற்றும் இரத்தப் பரிசோதனை.',
    card_reports_badge: 'எளிய மொழியில் புரிந்துகொள்ள >',
    card_doctor_title: 'மருத்துவர் சந்திப்பு (Doctor)',
    card_doctor_summary: 'நவம்பர் 18 அன்று டாக்டர் அசோக் மேத்தா (ஃபோர்டிஸ் மருத்துவமனை).',
    card_doctor_badge: 'கேட்க வேண்டிய கேள்விகள் >',
    card_family_title: 'என் குடும்பம் (Family)',
    card_family_summary: 'பிரியா சர்மா (மகள்) - உங்கள் பராமரிப்பாளர்.',
    card_family_badge: 'தொடர்புகொள்ள >',
    nav_home: 'முகப்பு',
    nav_meds: 'மருந்துகள்',
    nav_reports: 'அறிக்கைகள்',
    nav_family: 'குடும்பம்',
    modal_response_title: 'ஆரோக்ய சாதியின் பதில்',
    modal_replay: '🔁 மீண்டும் கேட்க (Replay)',
    modal_close: 'சரி (Close)',
    chat_placeholder: 'உங்கள் அறிக்கைகள் அல்லது மருந்துகள் பற்றி கேளுங்கள்...',
    doc_listen_summary: '🔊 எளிய விளக்கத்தைக் கேட்கவும்',
    doc_summary_title: 'எளிய சுருக்கம்:',
    doc_findings_title: 'முக்கிய பரிசோதனை முடிவுகள்:',
    doc_questions_title: 'மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்:',
    upload_prompt: '📤 மருத்துவ அறிக்கைகளை இங்கே பதிவேற்றவும் (PDF / புகைப்படம்)',
    tab_overview: '📊 கண்ணோட்டம்',
    tab_documents: '📁 ஆவணங்கள்',
    tab_chat: '🤖 AI உரையாடல்',
    tab_medicines: '💊 மருந்துகள்',
    tab_timeline: '📅 காலவரிசை',
    tab_family: '👥 குடும்ப வட்டம்'
  },
  'te-IN': {
    brand_title: 'ఆరోగ్య సాథి',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'సాధారణ మోడ్ (Simple)',
    mode_advanced: 'అధునాతన మోడ్ (Advanced)',
    sos: 'అత్యవసరం (SOS)',
    greeting: 'నమస్కారం, రమేష్ గారు',
    subgreeting: 'ఈరోజు మీ ఆరోగ్యం ఎలా ఉంది?',
    voice_state_idle: 'సహాయకుడు సిద్ధంగా ఉన్నారు • Assistant Ready',
    voice_state_listening: 'వింటున్నాను... మాట్లాడండి • Listening...',
    voice_state_processing: 'ఆలోచిస్తున్నాను... • Processing...',
    voice_state_speaking: 'సమాధానం చెబుతున్నాను... • Speaking',
    voice_state_error: 'మళ్లీ ప్రయత్నించండి • Try Again',
    voice_prompt: 'నొక్కండి మరియు మాట్లాడండి',
    voice_hint: '"ఈరోజు మందుల వివరాలు చెప్పు" లేదా "రక్త పరీక్ష రిపోర్టు వివరించు"',
    repeat_audio: 'మళ్లీ వినండి',
    slow_audio: 'నెమ్మది స్వరం (0.8x)',
    normal_audio: 'సాధారణ స్వరం (1.0x)',
    stop_audio: 'ఆపండి',
    card_meds_title: 'నా మందులు (Medicines)',
    card_meds_summary_default: 'ఉదయం 2 మందులు తీసుకున్నారు, రాత్రికి 2 మిగిలి ఉన్నాయి.',
    card_meds_badge: 'మందుల జాబితా >',
    card_reports_title: 'నా రిపోర్టులు (Reports)',
    card_reports_summary: 'డాక్టర్ అశోక్ మెహతా ప్రిస్క్రిప్షన్ మరియు అక్టోబర్ 30 రక్త పరీక్ష.',
    card_reports_badge: 'సులభంగా అర్థం చేసుకోండి >',
    card_doctor_title: 'డాక్టర్ అపాయింట్‌మెంట్ (Doctor)',
    card_doctor_summary: 'నవంబర్ 18న డాక్టర్ అశోక్ మెహతాతో అపాయింట్‌మెంట్.',
    card_doctor_badge: 'అడగాల్సిన ప్రశ్నలు >',
    card_family_title: 'నా కుటుంబం (Family)',
    card_family_summary: 'ప్రియా శర్మ (కుమార్తె) - మీ సంరక్షకురాలిగా ఉన్నారు.',
    card_family_badge: 'సంప్రదించండి >',
    nav_home: 'హోమ్',
    nav_meds: 'మందులు',
    nav_reports: 'రిపోర్టులు',
    nav_family: 'కుటుంబం',
    modal_response_title: 'ఆరోగ్య సాథి సమాధానం',
    modal_replay: '🔁 మళ్లీ వినండి (Replay)',
    modal_close: 'సరే (Close)',
    chat_placeholder: 'మీ రిపోర్టులు లేదా మందుల గురించి అడగండి...',
    doc_listen_summary: '🔊 సులభ వివరణ వినండి',
    doc_summary_title: 'సులభ సారాంశం:',
    doc_findings_title: 'ముఖ్యమైన ఫలితాలు:',
    doc_questions_title: 'డాక్టర్‌ను అడగాల్సిన ప్రశ్నలు:',
    upload_prompt: '📤 వైద్య పత్రాలను ఇక్కడ అప్‌లోడ్ చేయండి',
    tab_overview: '📊 సమీక్ష',
    tab_documents: '📁 పత్రాలు',
    tab_chat: '🤖 AI చాట్',
    tab_medicines: '💊 మందులు',
    tab_timeline: '📅 కాలక్రమం',
    tab_family: '👥 కుటుంబం'
  },
  'gu-IN': {
    brand_title: 'આરોગ્ય સાથી',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'સરળ મોડ (Simple)',
    mode_advanced: 'વિગતવાર મોડ (Advanced)',
    sos: 'ઇમરજન્સી (SOS)',
    greeting: 'નમસ્તે, રમેશભાઈ',
    subgreeting: 'આજે તમારી તબિયત કેવી છે?',
    voice_state_idle: 'સહાયક તૈયાર છે • Assistant Ready',
    voice_state_listening: 'સાંભળી રહ્યો છું... બોલો • Listening...',
    voice_state_processing: 'વિચારી રહ્યો છું... • Processing...',
    voice_state_speaking: 'જવાબ આપી રહ્યો છું... • Speaking',
    voice_state_error: 'ફરી પ્રયાસ કરો • Try Again',
    voice_prompt: 'ટેપ કરો અને બોલો',
    voice_hint: '"મારી આજની દવાઓ બતાવો" અથવા "મારો બ્લડ રિપોર્ટ સમજાવો"',
    repeat_audio: 'ફરી સાંભળો',
    slow_audio: 'ધીમો અવાજ (0.8x)',
    normal_audio: 'સામાન્ય અવાજ (1.0x)',
    stop_audio: 'રોકો',
    card_meds_title: 'મારી દવાઓ (Medicines)',
    card_meds_summary_default: 'સવારે 2 દવાઓ લીધી, રાત્રે 2 દવાઓ બાકી છે.',
    card_meds_badge: 'દવાઓની યાદી જુઓ >',
    card_reports_title: 'મારા રિપોર્ટ્સ (Reports)',
    card_reports_summary: 'ડૉ. અશોક મહેતાની ચિઠ્ઠી અને 30 ઓક્ટોબરનો બ્લડ રિપોર્ટ.',
    card_reports_badge: 'સરળ ભાષામાં સમજો >',
    card_doctor_title: 'ડૉક્ટર મુલાકાત (Doctor)',
    card_doctor_summary: '18 નવેમ્બરે ડૉ. અશોક મહેતા (ફોર્ટિસ હોસ્પિટલ).',
    card_doctor_badge: 'પૂછવા જેવા પ્રશ્નો >',
    card_family_title: 'મારો પરિવાર (Family)',
    card_family_summary: 'પ્રિયા શર્મા (પુત્રી) - તમારી સંભાળ રાખનાર.',
    card_family_badge: 'સંપર્ક કરો >',
    nav_home: 'હોમ',
    nav_meds: 'દવાઓ',
    nav_reports: 'રિપોર્ટ્સ',
    nav_family: 'પરિવાર',
    modal_response_title: 'આરોગ્ય સાથીનો જવાબ',
    modal_replay: '🔁 ફરી સાંભળો (Replay)',
    modal_close: 'બરાબર છે (Close)',
    chat_placeholder: 'તમારા રિપોર્ટ્સ અથવા દવાઓ વિશે પૂછો...',
    doc_listen_summary: '🔊 સરળ સમજૂતી સાંભળો',
    doc_summary_title: 'સરળ સારાંશ:',
    doc_findings_title: 'મુખ્ય તપાસ પરિણામો:',
    doc_questions_title: 'ડૉક્ટરને પૂછવાના પ્રશ્નો:',
    upload_prompt: '📤 મેડિકલ રિપોર્ટ્સ અહીં અપલોડ કરો',
    tab_overview: '📊 સમીક્ષા',
    tab_documents: '📁 દસ્તાવેજો',
    tab_chat: '🤖 AI ચેટ',
    tab_medicines: '💊 દવાઓ',
    tab_timeline: '📅 સમયરેખા',
    tab_family: '👥 પરિવાર'
  },
  'bn-IN': {
    brand_title: 'আরোগ্য সাথী',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'সহজ মোড (Simple)',
    mode_advanced: 'উন্নত মোড (Advanced)',
    sos: 'জরুরি (SOS)',
    greeting: 'নমস্কার, রমেশ বাবু',
    subgreeting: 'আজ আপনার শরীর কেমন আছে?',
    voice_state_idle: 'সহায়ক প্রস্তুত • Assistant Ready',
    voice_state_listening: 'শুনছি... বলুন • Listening...',
    voice_state_processing: 'ভাবছি... • Processing...',
    voice_state_speaking: 'উত্তর দিচ্ছি... • Speaking',
    voice_state_error: 'আবার চেষ্টা করুন • Try Again',
    voice_prompt: 'ট্যাপ করে কথা বলুন',
    voice_hint: '"আমার আজকের ওষুধগুলো বলো" অথবা "আমার রক্ত পরীক্ষার রিপোর্ট বোঝাও"',
    repeat_audio: 'আবার শুনুন',
    slow_audio: 'ধীর কণ্ঠ (0.8x)',
    normal_audio: 'স্বাভাবিক কণ্ঠ (1.0x)',
    stop_audio: 'থামুন',
    card_meds_title: 'আমার ওষুধ (Medicines)',
    card_meds_summary_default: 'সকালে ২টি ওষুধ নেওয়া হয়েছে, রাতে ২টি বাকি আছে।',
    card_meds_badge: 'ওষুধের তালিকা দেখুন >',
    card_reports_title: 'আমার রিপোর্ট (Reports)',
    card_reports_summary: 'ডা. অশোক মেহতার প্রেসক্রিপশন ও ৩০ অক্টোবরের রক্তের রিপোর্ট।',
    card_reports_badge: 'সহজ ভাষায় বুঝুন >',
    card_doctor_title: 'ডাক্তারের অ্যাপয়েন্টমেন্ট (Doctor)',
    card_doctor_summary: '১৮ নভেম্বর ডা. অশোক মেহতার সাথে দেখা করার তারিখ।',
    card_doctor_badge: 'জিজ্ঞাস্য প্রশ্নাবলি >',
    card_family_title: 'আমার পরিবার (Family)',
    card_family_summary: 'প্রিয়া শর্মা (মেয়ে) - আপনার স্বাস্থ্যসেবায় যুক্ত।',
    card_family_badge: 'যোগাযোগ করুন >',
    nav_home: 'হোম',
    nav_meds: 'ওষুধ',
    nav_reports: 'রিপোর্ট',
    nav_family: 'পরিবার',
    modal_response_title: 'আরোগ্য সাথীর উত্তর',
    modal_replay: '🔁 আবার শুনুন (Replay)',
    modal_close: 'ঠিক আছে (Close)',
    chat_placeholder: 'রিপোর্ট বা ওষুধ সম্পর্কে প্রশ্ন করুন...',
    doc_listen_summary: '🔊 সহজ ব্যাখ্যা শুনুন',
    doc_summary_title: 'সহজ সারসংক্ষেপ:',
    doc_findings_title: 'মূল পরীক্ষার ফলাফল:',
    doc_questions_title: 'ডাক্তারকে জিজ্ঞেস করার প্রশ্ন:',
    upload_prompt: '📤 মেডিকেল রিপোর্ট এখানে আপলোড করুন',
    tab_overview: '📊 পর্যালোচনা',
    tab_documents: '📁 নথিপত্র',
    tab_chat: '🤖 AI চ্যাট',
    tab_medicines: '💊 ওষুধ',
    tab_timeline: '📅 সময়রেখা',
    tab_family: '👥 পরিবার'
  },
  'kn-IN': {
    brand_title: 'ಆರೋಗ್ಯ ಸಾಥಿ',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'ಸರಳ ಮೋಡ್ (Simple)',
    mode_advanced: 'ಮುಂದುವರಿದ ಮೋಡ್ (Advanced)',
    sos: 'ತುರ್ತು (SOS)',
    greeting: 'ನಮಸ್ಕಾರ, ರಮೇಶ್ ಅವರೇ',
    subgreeting: 'ಇಂದು ನಿಮ್ಮ ಆರೋಗ್ಯ ಹೇಗಿದೆ?',
    voice_state_idle: 'ಸಹಾಯಕ ಸಿದ್ಧರಾಗಿದ್ದಾರೆ • Assistant Ready',
    voice_state_listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ • Listening...',
    voice_state_processing: 'ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೇನೆ... • Processing...',
    voice_state_speaking: 'ಉತ್ತರಿಸುತ್ತಿದ್ದೇನೆ... • Speaking',
    voice_state_error: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ • Try Again',
    voice_prompt: 'ಟ್ಯಾಪ್ ಮಾಡಿ ಮಾತನಾಡಿ',
    voice_hint: '"ನನ್ನ ಇಂದಿನ ಔಷಧಿಗಳನ್ನು ತಿಳಿಸಿ" ಅಥವಾ "ರಕ್ತ ಪರೀಕ್ಷಾ ವರದಿಯನ್ನು ವಿವರಿಸಿ"',
    repeat_audio: 'ಮತ್ತೊಮ್ಮೆ ಕೇಳಿ',
    slow_audio: 'ನಿಧಾನ ಧ್ವನಿ (0.8x)',
    normal_audio: 'ಸಾಮಾನ್ಯ ಧ್ವನಿ (1.0x)',
    stop_audio: 'ನಿಲ್ಲಿಸಿ',
    card_meds_title: 'ನನ್ನ ಔಷಧಿಗಳು (Medicines)',
    card_meds_summary_default: 'ಬೆಳಗ್ಗೆ ೨ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ, ರಾತ್ರಿ ೨ ಬಾಕಿ ಇವೆ.',
    card_meds_badge: 'ಔಷಧ ಪಟ್ಟಿ ನೋಡಿ >',
    card_reports_title: 'ನನ್ನ ವರದಿಗಳು (Reports)',
    card_reports_summary: 'ಡಾ. ಅಶೋಕ್ ಮೆಹ್ತಾ ಅವರ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಅಕ್ಟೋಬರ್ 30ರ ರಕ್ತ ಪರೀಕ್ಷೆ.',
    card_reports_badge: 'ಸರಳ ಭಾಷೆಯಲ್ಲಿ ತಿಳಿಯಿರಿ >',
    card_doctor_title: 'ವೈದ್ಯರ ಭೇಟಿ (Doctor)',
    card_doctor_summary: 'ನವೆಂಬರ್ 18 ರಂದು ಡಾ. ಅಶೋಕ್ ಮೆಹ್ತಾ ಭೇಟಿ.',
    card_doctor_badge: 'ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು >',
    card_family_title: 'ನನ್ನ ಕುಟುಂಬ (Family)',
    card_family_summary: 'ಪ್ರಿಯಾ ಶರ್ಮಾ (ಮಗಳು) - ನಿಮ್ಮ ಆರೈಕೆದಾರರು.',
    card_family_badge: 'ಸಂಪರ್ಕಿಸಿ >',
    nav_home: 'ಮುಖಪುಟ',
    nav_meds: 'ಔಷಧಿಗಳು',
    nav_reports: 'ವರದಿಗಳು',
    nav_family: 'ಕುಟುಂಬ',
    modal_response_title: 'ಆರೋಗ್ಯ ಸಾಥಿಯ ಉತ್ತರ',
    modal_replay: '🔁 ಮತ್ತೊಮ್ಮೆ ಕೇಳಿ (Replay)',
    modal_close: 'ಸರಿ (Close)',
    chat_placeholder: 'ವರದಿಗಳು ಅಥವಾ ಔಷಧಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    doc_listen_summary: '🔊 ಸರಳ ವಿವರಣೆ ಕೇಳಿ',
    doc_summary_title: 'ಸರಳ ಸಾರಾಂಶ:',
    doc_findings_title: 'ಪ್ರಮುಖ ಫಲಿತಾಂಶಗಳು:',
    doc_questions_title: 'ವೈದ್ಯರಿಗೆ ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು:',
    upload_prompt: '📤 ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಇಲ್ಲಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    tab_overview: '📊 ಅವಲೋಕನ',
    tab_documents: '📁 ದಾಖಲೆಗಳು',
    tab_chat: '🤖 AI ಚಾಟ್',
    tab_medicines: '💊 ಔಷಧಿಗಳು',
    tab_timeline: '📅 ದಿನಚರಿ',
    tab_family: '👥 ಕುಟುಂಬ'
  },
  'ml-IN': {
    brand_title: 'ആരോഗ്യ സാഥി',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'ലളിത മോഡ് (Simple)',
    mode_advanced: 'വിശദ മോഡ് (Advanced)',
    sos: 'അടിയന്തരം (SOS)',
    greeting: 'നമസ്കാരം, രമേഷ് ജീ',
    subgreeting: 'ഇന്ന് സുഖമാണോ?',
    voice_state_idle: 'സഹായി തയ്യാറാണ് • Assistant Ready',
    voice_state_listening: 'കേൾക്കുന്നു... പറയൂ • Listening...',
    voice_state_processing: 'പരിശോധിക്കുന്നു... • Processing...',
    voice_state_speaking: 'മറുപടി പറയുന്നു... • Speaking',
    voice_state_error: 'വീണ്ടും ശ്രമിക്കുക • Try Again',
    voice_prompt: 'ടാപ്പ് ചെയ്ത് സംസാരിക്കൂ',
    voice_hint: '"ഇന്നത്തെ മരുന്നുകൾ പറയൂ" അല്ലെങ്കിൽ "രക്ത പരിശോധനാ റിപ്പോർട്ട് വിശദീകരിക്കൂ"',
    repeat_audio: 'വീണ്ടും കേൾക്കുക',
    slow_audio: 'പതുക്കെയുള്ള ശബ്ദം (0.8x)',
    normal_audio: 'സാധാരണ ശബ്ദം (1.0x)',
    stop_audio: 'നിർത്തുക',
    card_meds_title: 'എന്റെ മരുന്നുകൾ (Medicines)',
    card_meds_summary_default: 'രാവിലെ 2 മരുന്നുകൾ കഴിച്ചു, രാത്രി 2 മരുന്നുകൾ ബാക്കിയുണ്ട്.',
    card_meds_badge: 'മരുന്ന് പട്ടിക കാണുക >',
    card_reports_title: 'എന്റെ റിപ്പോർട്ടുകൾ (Reports)',
    card_reports_summary: 'ഡോ. അശോക് മേത്തയുടെ കുറിപ്പടിയും ഒക്ടോബർ 30 ലെ രക്തപരിശോധനയും.',
    card_reports_badge: 'ലളിതമായി മനസ്സിലാക്കൂ >',
    card_doctor_title: 'ഡോക്ടർ കൂടിക്കാഴ്ച (Doctor)',
    card_doctor_summary: 'നവംബർ 18 ന് ഡോ. അശോക് മേത്തയുമായുള്ള കൂടിക്കാഴ്ച.',
    card_doctor_badge: 'ചോദിക്കേണ്ട ചോദ്യങ്ങൾ >',
    card_family_title: 'എന്റെ കുടുംബം (Family)',
    card_family_summary: 'പ്രിയ ശർമ്മ (മകൾ) - പരിചാരകയായി ഒപ്പമുണ്ട്.',
    card_family_badge: 'ബന്ധപ്പെടുക >',
    nav_home: 'ഹോം',
    nav_meds: 'മരുന്നുകൾ',
    nav_reports: 'റിപ്പോർട്ടുകൾ',
    nav_family: 'കുടുംബം',
    modal_response_title: 'ആരോഗ്യ സാഥിയുടെ മറുപടി',
    modal_replay: '🔁 വീണ്ടും കേൾക്കുക (Replay)',
    modal_close: 'ശരി (Close)',
    chat_placeholder: 'റിപ്പോർട്ടുകളെക്കുറിച്ചോ മരുന്നുകളെക്കുറിച്ചോ ചോദിക്കൂ...',
    doc_listen_summary: '🔊 ലളിതമായ വിവരണം കേൾക്കുക',
    doc_summary_title: 'ലളിതമായ സംഗ്രഹം:',
    doc_findings_title: 'പ്രധാന പരിശോധനാ ഫലങ്ങൾ:',
    doc_questions_title: 'ഡോക്ടറോട് ചോദിക്കേണ്ട ചോദ്യങ്ങൾ:',
    upload_prompt: '📤 മെഡിക്കൽ രേഖകൾ ഇവിടെ അപ്‌ലോഡ് ചെയ്യുക',
    tab_overview: '📊 അവലോകനം',
    tab_documents: '📁 രേഖകൾ',
    tab_chat: '🤖 AI ചാറ്റ്',
    tab_medicines: '💊 മരുന്നുകൾ',
    tab_timeline: '📅 നാൾവഴി',
    tab_family: '👥 കുടുംബം'
  },
  'pa-IN': {
    brand_title: 'ਆਰੋਗਿਆ ਸਾਥੀ',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'ਸਧਾਰਨ ਮੋਡ (Simple)',
    mode_advanced: 'ਵਿਸਤ੍ਰਿਤ ਮੋਡ (Advanced)',
    sos: 'ਐਮਰਜੈਂਸੀ (SOS)',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਰਮੇਸ਼ ਜੀ',
    subgreeting: 'ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?',
    voice_state_idle: 'ਸਹਾਇਕ ਤਿਆਰ ਹੈ • Assistant Ready',
    voice_state_listening: 'ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ • Listening...',
    voice_state_processing: 'ਸੋਚ ਰਿਹਾ ਹਾਂ... • Processing...',
    voice_state_speaking: 'ਜਵਾਬ ਦੇ ਰਿਹਾ ਹਾਂ... • Speaking',
    voice_state_error: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ • Try Again',
    voice_prompt: 'ਟੈਪ ਕਰੋ ਅਤੇ ਬੋਲੋ',
    voice_hint: '"ਮੇਰੀਆਂ ਅੱਜ ਦੀਆਂ ਦਵਾਈਆਂ ਦੱਸੋ" ਜਾਂ "ਮੇਰੀ ਖੂਨ ਦੀ ਰਿਪੋਰਟ ਸਮਝਾਓ"',
    repeat_audio: 'ਦੁਬਾਰਾ ਸੁਣੋ',
    slow_audio: 'ਹੌਲੀ ਆਵਾਜ਼ (0.8x)',
    normal_audio: 'ਆਮ ਆਵਾਜ਼ (1.0x)',
    stop_audio: 'ਰੋਕੋ',
    card_meds_title: 'ਮੇਰੀਆਂ ਦਵਾਈਆਂ (Medicines)',
    card_meds_summary_default: 'ਸਵੇਰੇ 2 ਦਵਾਈਆਂ ਲਈਆਂ, ਰਾਤ ਦੀਆਂ 2 ਬਾਕੀ ਹਨ।',
    card_meds_badge: 'ਦਵਾਈਆਂ ਦੀ ਸੂਚੀ ਦੇਖੋ >',
    card_reports_title: 'ਮੇਰੀਆਂ ਰਿਪੋਰਟਾਂ (Reports)',
    card_reports_summary: 'ਡਾ. ਅਸ਼ੋਕ ਮਹਿਤਾ ਦਾ ਪਰਚਾ ਅਤੇ 30 ਅਕਤੂਬਰ ਦੀ ਖੂਨ ਦੀ ਜਾਂਚ।',
    card_reports_badge: 'ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝੋ >',
    card_doctor_title: 'ਡਾਕਟਰ ਮੁਲਾਕਾਤ (Doctor)',
    card_doctor_summary: '18 ਨਵੰਬਰ ਨੂੰ ਡਾ. ਅਸ਼ੋਕ ਮਹਿਤਾ (ਫੋਰਟਿਸ ਹਸਪਤਾਲ)।',
    card_doctor_badge: 'ਪੁੱਛਣ ਵਾਲੇ ਸਵਾਲ >',
    card_family_title: 'ਮੇਰਾ ਪਰਿਵਾਰ (Family)',
    card_family_summary: 'ਪ੍ਰਿਆ ਸ਼ਰਮਾ (ਧੀ) - ਤੁਹਾਡੀ ਦੇਖਭਾਲ ਕਰਤਾ ਵਜੋਂ ਜੁੜੀ ਹੈ।',
    card_family_badge: 'ਸੰਪਰਕ ਕਰੋ >',
    nav_home: 'ਘਰ',
    nav_meds: 'ਦਵਾਈਆਂ',
    nav_reports: 'ਰਿਪੋਰਟਾਂ',
    nav_family: 'ਪਰਿਵਾਰ',
    modal_response_title: 'ਆਰੋਗਿਆ ਸਾਥੀ ਦਾ ਜਵਾਬ',
    modal_replay: '🔁 ਦੁਬਾਰਾ ਸੁਣੋ (Replay)',
    modal_close: 'ਠੀਕ ਹੈ (Close)',
    chat_placeholder: 'ਰਿਪੋਰਟਾਂ ਜਾਂ ਦਵਾਈਆਂ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੋ...',
    doc_listen_summary: '🔊 ਸੌਖੀ ਵਿਆਖਿਆ ਸੁਣੋ',
    doc_summary_title: 'ਸੌਖਾ ਸਾਰ:',
    doc_findings_title: 'ਮੁੱਖ ਜਾਂਚ ਨਤੀਜੇ:',
    doc_questions_title: 'ਡਾਕਟਰ ਨੂੰ ਪੁੱਛਣ ਵਾਲੇ ਸਵਾਲ:',
    upload_prompt: '📤 ਮੈਡੀਕਲ ਰਿਪੋਰਟਾਂ ਇੱਥੇ ਅੱਪਲੋਡ ਕਰੋ',
    tab_overview: '📊 ਸੰਖੇਪ',
    tab_documents: '📁 ਦਸਤਾਵੇਜ਼',
    tab_chat: '🤖 AI ਗੱਲਬਾਤ',
    tab_medicines: '💊 ਦਵਾਈਆਂ',
    tab_timeline: '📅 ਸਮਾਂ-ਰੇਖਾ',
    tab_family: '👥 ਪਰਿਵਾਰ'
  },
  'od-IN': {
    brand_title: 'ଆରୋଗ୍ୟ ସାଥୀ',
    brand_subtitle: 'Aarogya Saathi • Healthcare AI',
    mode_simple: 'ସରଳ ମୋଡ୍ (Simple)',
    mode_advanced: 'ଉନ୍ନତ ମୋଡ୍ (Advanced)',
    sos: 'ଜରୁରୀ (SOS)',
    greeting: 'ନମସ୍କାର, ରମେଶ ବାବୁ',
    subgreeting: 'ଆଜି ଆପଣ କିପରି ଅନୁଭବ କରୁଛନ୍ତି?',
    voice_state_idle: 'ସହାୟକ ପ୍ରସ୍ତୁତ • Assistant Ready',
    voice_state_listening: 'ଶୁଣୁଛି... କୁହନ୍ତୁ • Listening...',
    voice_state_processing: 'ଚିନ୍ତା କରୁଛି... • Processing...',
    voice_state_speaking: 'ଉତ୍ତର ଦେଉଛି... • Speaking',
    voice_state_error: 'ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ • Try Again',
    voice_prompt: 'ଟ୍ୟାପ୍ କରନ୍ତୁ ଏବଂ କୁହନ୍ତୁ',
    voice_hint: '"ମୋର ଆଜିର ଔଷଧ କୁହନ୍ତୁ" କିମ୍ବା "ରକ୍ତ ପରୀକ୍ଷା ରିପୋର୍ଟ ବୁଝାନ୍ତୁ"',
    repeat_audio: 'ପୁନର୍ବାର ଶୁଣନ୍ତୁ',
    slow_audio: 'ଧୀର ଶବ୍ଦ (0.8x)',
    normal_audio: 'ସାଧାରଣ ଶବ୍ଦ (1.0x)',
    stop_audio: 'ବନ୍ଦ କରନ୍ତୁ',
    card_meds_title: 'ମୋର ଔଷଧ (Medicines)',
    card_meds_summary_default: 'ସକାଳେ ୨ଟି ଔଷଧ ନିଆଯାଇଛି, ରାତିରେ ୨ଟି ବାକି ଅଛି।',
    card_meds_badge: 'ଔଷଧ ତାଲିକା ଦେଖନ୍ତୁ >',
    card_reports_title: 'ମୋର ରିପୋର୍ଟ (Reports)',
    card_reports_summary: 'ଡାକ୍ତର ଅଶୋକ ମେହେତାଙ୍କ ପ୍ରେସକ୍ରିପସନ୍ ଏବଂ ରକ୍ତ ପରୀକ୍ଷା।',
    card_reports_badge: 'ସରଳ ଭାଷାରେ ବୁଝନ୍ତୁ >',
    card_doctor_title: 'ଡାକ୍ତର ସାକ୍ଷାତ (Doctor)',
    card_doctor_summary: '୧୮ ନଭେମ୍ବରରେ ଡାକ୍ତର ଅଶୋକ ମେହେତା (ଫୋର୍ଟିସ୍ ହସ୍ପିଟାଲ୍)।',
    card_doctor_badge: 'ପଚାରିବାକୁ ଥିବା ପ୍ରଶ୍ନ >',
    card_family_title: 'ମୋର ପରିବାର (Family)',
    card_family_summary: 'ପ୍ରିୟା ଶର୍ମା (ଝିଅ) - ଆପଣଙ୍କ ଯତ୍ନ ନେଉଛନ୍ତି।',
    card_family_badge: 'ଯୋଗାଯୋଗ କରନ୍ତୁ >',
    nav_home: 'ମୂଳପୃଷ୍ଠା',
    nav_meds: 'ଔଷଧ',
    nav_reports: 'ରିପୋର୍ଟ',
    nav_family: 'ପରିବାର',
    modal_response_title: 'ଆରୋଗ୍ୟ ସାଥୀଙ୍କ ଉତ୍ତର',
    modal_replay: '🔁 ପୁନର୍ବାର ଶୁଣନ୍ତୁ (Replay)',
    modal_close: 'ଠିକ୍ ଅଛି (Close)',
    chat_placeholder: 'ରିପୋର୍ଟ କିମ୍ବା ଔଷଧ ବିଷୟରେ ପଚାରନ୍ତୁ...',
    doc_listen_summary: '🔊 ସରଳ ବ୍ୟାଖ୍ୟା ଶୁଣନ୍ତୁ',
    doc_summary_title: 'ସରଳ ସାରାଂଶ:',
    doc_findings_title: 'ମୁଖ୍ୟ ପରୀକ୍ଷା ଫଳାଫଳ:',
    doc_questions_title: 'ଡାକ୍ତରଙ୍କୁ ପଚାରିବା ପ୍ରଶ୍ନ:',
    upload_prompt: '📤 ଡାକ୍ତରୀ କାଗଜପତ୍ର ଏଠାରେ ଅପଲୋଡ୍ କରନ୍ତୁ',
    tab_overview: '📊 ସମୀକ୍ଷା',
    tab_documents: '📁 ଦଲିଲ',
    tab_chat: '🤖 AI ଚାଟ୍',
    tab_medicines: '💊 ଔଷଧ',
    tab_timeline: '📅 ସମୟରେଖା',
    tab_family: '👥 ପରିବାର'
  }
};

// UI Element Selectors
const DOM = {
  modeToggleBtn: document.getElementById('mode-toggle-btn'),
  modeLabel: document.getElementById('mode-label'),
  modeIcon: document.getElementById('mode-icon'),
  langSelector: document.getElementById('lang-selector'),
  simpleView: document.getElementById('simple-view'),
  advancedView: document.getElementById('advanced-view'),
  mainMicBtn: document.getElementById('main-mic-btn'),
  voiceStatusPill: document.getElementById('voice-status-pill'),
  voiceStateLabel: document.getElementById('voice-state-label'),
  voicePromptText: document.getElementById('voice-prompt-text'),
  repeatAudioBtn: document.getElementById('repeat-audio-btn'),
  slowAudioBtn: document.getElementById('slow-audio-btn'),
  stopAudioBtn: document.getElementById('stop-audio-btn'),
  sosBtn: document.getElementById('sos-btn'),
  sosModal: document.getElementById('sos-modal'),
  networkPill: document.getElementById('network-pill'),
  networkText: document.getElementById('network-text'),
  
  // Simple Action Cards
  cardSimpleMeds: document.getElementById('card-simple-meds'),
  cardSimpleReports: document.getElementById('card-simple-reports'),
  cardSimpleAppointment: document.getElementById('card-simple-appointment'),
  cardSimpleFamily: document.getElementById('card-simple-family'),
  simpleGreeting: document.getElementById('simple-greeting'),
  simpleMedsSummary: document.getElementById('simple-meds-summary'),
  
  // Advanced Tabs & Lists
  navTabBtns: document.querySelectorAll('.nav-tab-btn'),
  tabPanes: document.querySelectorAll('.tab-pane'),
  overviewDocsList: document.getElementById('overview-docs-list'),
  advancedDocsGrid: document.getElementById('advanced-docs-grid'),
  advancedMedsList: document.getElementById('advanced-meds-list'),
  timelineStream: document.getElementById('timeline-stream-container'),
  familyMembersList: document.getElementById('family-members-list'),
  familyAuditList: document.getElementById('family-audit-list'),
  docCountBadge: document.getElementById('doc-count-badge'),
  
  // Chat
  chatMessagesContainer: document.getElementById('chat-messages-container'),
  chatTextInput: document.getElementById('chat-text-input'),
  chatSendBtn: document.getElementById('chat-send-btn'),
  chatMicBtn: document.getElementById('chat-mic-btn'),
  overviewQuickAsk: document.getElementById('overview-quick-ask'),
  overviewQuickAskBtn: document.getElementById('overview-quick-ask-btn'),
  
  // Document Upload
  docUploadTrigger: document.getElementById('doc-upload-trigger'),
  docFileInput: document.getElementById('doc-file-input'),

  // Modals
  voiceResponseModal: document.getElementById('voice-response-modal'),
  modalResponseTitle: document.getElementById('modal-response-title'),
  modalUserQuery: document.getElementById('modal-user-query'),
  modalAiAnswer: document.getElementById('modal-ai-answer'),
  modalSourcesSection: document.getElementById('modal-sources-section'),
  modalSourcesList: document.getElementById('modal-sources-list'),
  modalReplayBtn: document.getElementById('modal-replay-btn'),
  
  docDetailModal: document.getElementById('doc-detail-modal'),
  docModalTitle: document.getElementById('doc-modal-title'),
  docModalSummary: document.getElementById('doc-modal-summary'),
  docModalFindings: document.getElementById('doc-modal-findings'),
  docModalQuestions: document.getElementById('doc-modal-questions'),
  docSpeakSummaryBtn: document.getElementById('doc-speak-summary-btn'),
  
  addMedModal: document.getElementById('add-med-modal'),
  addMedBtn: document.getElementById('add-med-btn'),
  addMedForm: document.getElementById('add-med-form'),
  
  bottomNavItems: document.querySelectorAll('.bottom-nav .nav-item')
};

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  setupNetworkMonitoring();
  await loadUserProfile();
  await loadAllData();
  registerServiceWorker();
});

// Setup Network Status Monitor
function setupNetworkMonitoring() {
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      DOM.networkPill.classList.remove('offline');
      DOM.networkText.textContent = 'Online';
    } else {
      DOM.networkPill.classList.add('offline');
      DOM.networkText.textContent = 'Offline (Cached)';
    }
  };
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

// Register PWA Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Aarogya Saathi Service Worker Registered'))
      .catch((err) => console.log('SW registration error:', err));
  }
}

// Load Profile from Server
async function loadUserProfile() {
  try {
    const res = await fetch('/api/profile');
    if (res.ok) {
      const profile = await res.json();
      STATE.mode = profile.interface_mode || 'simple';
      STATE.language = profile.language || 'hi-IN';
      STATE.voiceSpeed = profile.voice_speed || 1.0;
      
      DOM.langSelector.value = STATE.language;
      applyModeUI(STATE.mode);
      applyLanguage(STATE.language);
    }
  } catch (e) {
    console.warn('Using default local profile:', e);
    applyModeUI(STATE.mode);
    applyLanguage(STATE.language);
  }
}

// ============================================================================
// DYNAMIC MULTILINGUAL TRANSLATION HANDLER
// ============================================================================
function applyLanguage(langCode) {
  STATE.language = langCode;
  document.documentElement.lang = langCode.split('-')[0];
  const dict = I18N[langCode] || I18N['hi-IN'];

  // 1. Header & Brand
  const brandTitle = document.getElementById('brand-title');
  if (brandTitle) brandTitle.textContent = dict.brand_title;
  const brandSub = document.getElementById('brand-subtitle');
  if (brandSub) brandSub.textContent = dict.brand_subtitle;
  const modeLbl = document.getElementById('mode-label');
  if (modeLbl) modeLbl.textContent = STATE.mode === 'advanced' ? dict.mode_advanced : dict.mode_simple;
  const sosLbl = document.getElementById('sos-label');
  if (sosLbl) sosLbl.textContent = dict.sos;

  // 2. Greeting
  if (DOM.simpleGreeting) DOM.simpleGreeting.textContent = dict.greeting;
  const subGreeting = document.getElementById('simple-subgreeting');
  if (subGreeting) subGreeting.textContent = dict.subgreeting;

  // 3. Voice Hero Section
  setVoiceState('idle');
  if (DOM.voicePromptText) DOM.voicePromptText.textContent = dict.voice_prompt;
  const voiceHint = document.getElementById('voice-hint-text');
  if (voiceHint) voiceHint.textContent = dict.voice_hint;
  const repeatLbl = document.getElementById('repeat-audio-label');
  if (repeatLbl) repeatLbl.textContent = dict.repeat_audio;
  const slowLbl = document.getElementById('slow-audio-label');
  if (slowLbl) slowLbl.textContent = STATE.voiceSpeed === 0.8 ? dict.normal_audio : dict.slow_audio;
  const stopLbl = document.getElementById('stop-audio-label');
  if (stopLbl) stopLbl.textContent = dict.stop_audio;

  // 4. Action Cards (Simple Mode)
  const cardMedsTitle = document.getElementById('card-meds-title');
  if (cardMedsTitle) cardMedsTitle.textContent = dict.card_meds_title;
  const cardMedsBadge = document.getElementById('card-meds-badge');
  if (cardMedsBadge) cardMedsBadge.textContent = dict.card_meds_badge;

  const cardReportsTitle = document.getElementById('card-reports-title');
  if (cardReportsTitle) cardReportsTitle.textContent = dict.card_reports_title;
  const cardReportsSummary = document.getElementById('card-reports-summary');
  if (cardReportsSummary) cardReportsSummary.textContent = dict.card_reports_summary;
  const cardReportsBadge = document.getElementById('card-reports-badge');
  if (cardReportsBadge) cardReportsBadge.textContent = dict.card_reports_badge;

  const cardDoctorTitle = document.getElementById('card-doctor-title');
  if (cardDoctorTitle) cardDoctorTitle.textContent = dict.card_doctor_title;
  const cardDoctorSummary = document.getElementById('card-doctor-summary');
  if (cardDoctorSummary) cardDoctorSummary.textContent = dict.card_doctor_summary;
  const cardDoctorBadge = document.getElementById('card-doctor-badge');
  if (cardDoctorBadge) cardDoctorBadge.textContent = dict.card_doctor_badge;

  const cardFamilyTitle = document.getElementById('card-family-title');
  if (cardFamilyTitle) cardFamilyTitle.textContent = dict.card_family_title;
  const cardFamilySummary = document.getElementById('card-family-summary');
  if (cardFamilySummary) cardFamilySummary.textContent = dict.card_family_summary;
  const cardFamilyBadge = document.getElementById('card-family-badge');
  if (cardFamilyBadge) cardFamilyBadge.textContent = dict.card_family_badge;

  // 5. Bottom Navigation
  const navHome = document.getElementById('nav-label-home');
  if (navHome) navHome.textContent = dict.nav_home;
  const navMeds = document.getElementById('nav-label-meds');
  if (navMeds) navMeds.textContent = dict.nav_meds;
  const navReports = document.getElementById('nav-label-reports');
  if (navReports) navReports.textContent = dict.nav_reports;
  const navFamily = document.getElementById('nav-label-family');
  if (navFamily) navFamily.textContent = dict.nav_family;

  // 6. Advanced Tabs
  const tabOverview = document.getElementById('tab-label-overview');
  if (tabOverview) tabOverview.textContent = dict.tab_overview;
  const tabDocs = document.getElementById('tab-label-documents');
  if (tabDocs) tabDocs.textContent = dict.tab_documents;
  const tabChat = document.getElementById('tab-label-chat');
  if (tabChat) tabChat.textContent = dict.tab_chat;
  const tabMeds = document.getElementById('tab-label-medicines');
  if (tabMeds) tabMeds.textContent = dict.tab_medicines;
  const tabTimeline = document.getElementById('tab-label-timeline');
  if (tabTimeline) tabTimeline.textContent = dict.tab_timeline;
  const tabFamily = document.getElementById('tab-label-family');
  if (tabFamily) tabFamily.textContent = dict.tab_family;

  // 7. Inputs
  if (DOM.chatTextInput) DOM.chatTextInput.placeholder = dict.chat_placeholder;
  if (DOM.overviewQuickAsk) DOM.overviewQuickAsk.placeholder = dict.chat_placeholder;

  // 8. Modals
  if (DOM.modalResponseTitle) DOM.modalResponseTitle.textContent = dict.modal_response_title;
  if (DOM.modalReplayBtn) DOM.modalReplayBtn.textContent = dict.modal_replay;
  if (DOM.docSpeakSummaryBtn) DOM.docSpeakSummaryBtn.textContent = dict.doc_listen_summary;

  // 9. Refresh localized medicine reminder & voice audio
  loadMedicines();
}

// Apply Mode (Simple Mode vs Advanced Mode)
function applyModeUI(mode) {
  STATE.mode = mode;
  const dict = I18N[STATE.language] || I18N['hi-IN'];
  if (mode === 'advanced') {
    DOM.simpleView.style.display = 'none';
    DOM.advancedView.style.display = 'flex';
    DOM.modeLabel.textContent = dict.mode_advanced;
    DOM.modeIcon.textContent = '🔬';
    DOM.modeToggleBtn.title = 'Switch to Simple Mode (Accessibility)';
  } else {
    DOM.simpleView.style.display = 'flex';
    DOM.advancedView.style.display = 'none';
    DOM.modeLabel.textContent = dict.mode_simple;
    DOM.modeIcon.textContent = '⚡';
    DOM.modeToggleBtn.title = 'Switch to Advanced Mode (Detailed Dashboard)';
  }
}

// Toggle Mode
async function toggleMode() {
  const newMode = STATE.mode === 'simple' ? 'advanced' : 'simple';
  applyModeUI(newMode);
  
  // Persist preference to backend
  try {
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interface_mode: newMode })
    });
  } catch (e) {
    console.error('Error saving mode:', e);
  }
}

// ============================================================================
// VOICE PIPELINE & ASSISTANT STATES
// ============================================================================
function setVoiceState(state, customMessage) {
  STATE.voiceState = state;
  DOM.mainMicBtn.className = 'mic-circle-btn ' + state;
  
  const dict = I18N[STATE.language] || I18N['hi-IN'];
  const labels = {
    idle: dict.voice_state_idle,
    listening: dict.voice_state_listening,
    processing: dict.voice_state_processing,
    speaking: dict.voice_state_speaking,
    error: dict.voice_state_error
  };

  DOM.voiceStateLabel.textContent = customMessage || labels[state] || dict.voice_state_idle;
}

// Play Audio from Base64 (Sarvam TTS output)
function playAudioBase64(base64Data, rate = 1.0) {
  if (!base64Data) return;
  
  stopAudio();
  try {
    const audioSrc = 'data:audio/wav;base64,' + base64Data;
    STATE.currentAudio = new Audio(audioSrc);
    STATE.currentAudio.playbackRate = rate;
    
    setVoiceState('speaking');
    DOM.stopAudioBtn.style.display = 'inline-flex';

    STATE.currentAudio.onended = () => {
      setVoiceState('idle');
      DOM.stopAudioBtn.style.display = 'none';
    };

    STATE.currentAudio.onerror = (err) => {
      console.error('Audio playback error:', err);
      setVoiceState('idle');
      DOM.stopAudioBtn.style.display = 'none';
    };

    STATE.currentAudio.play();
  } catch (err) {
    console.error('Failed to play audio:', err);
    setVoiceState('idle');
  }
}

function stopAudio() {
  if (STATE.currentAudio) {
    STATE.currentAudio.pause();
    STATE.currentAudio.currentTime = 0;
    STATE.currentAudio = null;
  }
  setVoiceState('idle');
  DOM.stopAudioBtn.style.display = 'none';
}

// Start / Stop Recording with Microphone
async function toggleVoiceRecording() {
  if (STATE.isRecording) {
    stopRecording();
    return;
  }
  startRecording();
}

async function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    runSpeechRecognitionFallback();
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    STATE.audioChunks = [];
    STATE.mediaRecorder = new MediaRecorder(stream);

    STATE.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) STATE.audioChunks.push(e.data);
    };

    STATE.mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      const audioBlob = new Blob(STATE.audioChunks, { type: 'audio/wav' });
      await sendVoiceToServer(audioBlob);
    };

    STATE.mediaRecorder.start();
    STATE.isRecording = true;
    setVoiceState('listening');
  } catch (err) {
    console.warn('Microphone error or unavailable, trying browser speech:', err);
    runSpeechRecognitionFallback();
  }
}

function stopRecording() {
  if (STATE.mediaRecorder && STATE.isRecording) {
    STATE.mediaRecorder.stop();
    STATE.isRecording = false;
    setVoiceState('processing');
  }
}

// Web Speech fallback for instant browser dictation
function runSpeechRecognitionFallback() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice recording is not supported in this browser. Please type your question.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = STATE.language;
  recognition.interimResults = false;

  recognition.onstart = () => {
    STATE.isRecording = true;
    setVoiceState('listening');
  };

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    setVoiceState('processing');
    await sendQueryToServer(transcript);
  };

  recognition.onerror = () => {
    setVoiceState('idle');
    STATE.isRecording = false;
  };

  recognition.onend = () => {
    STATE.isRecording = false;
  };

  recognition.start();
}

// Send Voice Audio to Backend Server
async function sendVoiceToServer(audioBlob) {
  setVoiceState('processing');
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  formData.append('language_code', STATE.language);
  formData.append('mode', STATE.mode);

  try {
    const res = await fetch('/api/voice/process', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      handleAssistantResponse(data);
    } else {
      setVoiceState('error', 'Unable to process audio');
    }
  } catch (e) {
    console.error('Error processing voice:', e);
    setVoiceState('error', 'Network error');
  }
}

// Send Text Query to Backend Server
async function sendQueryToServer(queryText) {
  if (!queryText || !queryText.trim()) return;

  setVoiceState('processing');
  const formData = new FormData();
  formData.append('query_text', queryText.trim());
  formData.append('language_code', STATE.language);
  formData.append('mode', STATE.mode);

  try {
    const res = await fetch('/api/voice/process', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      handleAssistantResponse(data);
    } else {
      setVoiceState('error');
    }
  } catch (e) {
    console.error('Error sending query:', e);
    setVoiceState('error');
  }
}

// Handle AI Assistant Response
function handleAssistantResponse(data) {
  STATE.lastAudioBase64 = data.audio_base64;

  // Append to Advanced Chat Tab
  appendChatMessage('user', data.transcript);
  appendChatMessage('assistant', data.answer, data.cited_documents, data.audio_base64);

  // If in Simple Mode, show large response modal
  if (STATE.mode === 'simple') {
    DOM.modalUserQuery.textContent = data.transcript;
    DOM.modalAiAnswer.textContent = data.answer;
    
    if (data.cited_documents && data.cited_documents.length > 0) {
      DOM.modalSourcesSection.style.display = 'block';
      DOM.modalSourcesList.innerHTML = data.cited_documents
        .map(src => `<span class="citation-pill">📄 ${src}</span>`)
        .join(' ');
    } else {
      DOM.modalSourcesSection.style.display = 'none';
    }

    DOM.voiceResponseModal.classList.add('active');
  }

  // Play audio response automatically
  if (data.audio_base64) {
    playAudioBase64(data.audio_base64, STATE.voiceSpeed);
  } else {
    setVoiceState('idle');
  }
}

// Append Message to Chat
function appendChatMessage(role, text, citations = [], audioB64 = null) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  
  let html = `<div>${text}</div>`;
  if (citations && citations.length > 0) {
    html += `<div style="margin-top: 6px;">` + citations.map(c => `<span class="citation-pill">📄 ${c}</span>`).join(' ') + `</div>`;
  }
  if (audioB64) {
    html += `<button class="audio-ctrl-btn" style="margin-top: 8px; padding: 4px 10px; font-size: 0.75rem;" onclick="playAudioBase64('${audioB64}', ${STATE.voiceSpeed})">🔊 Listen</button>`;
  }

  bubble.innerHTML = html;
  DOM.chatMessagesContainer.appendChild(bubble);
  DOM.chatMessagesContainer.scrollTop = DOM.chatMessagesContainer.scrollHeight;
}

// ============================================================================
// DATA LOADERS & RENDERERS
// ============================================================================
async function loadAllData() {
  await Promise.all([
    loadMedicines(),
    loadDocuments(),
    loadAppointments(),
    loadTimeline(),
    loadFamilyCircle()
  ]);
}

// 1. Medicines
async function loadMedicines() {
  try {
    const res = await fetch(`/api/medicines/today?language_code=${STATE.language}`);
    if (res.ok) {
      const data = await res.json();
      STATE.medicines = data;
      renderMedicines(data);
    }
  } catch (e) {
    console.error('Error loading medicines:', e);
  }
}

function renderMedicines(data) {
  // Format summary text in selected language
  if (STATE.language === 'mr-IN') {
    DOM.simpleMedsSummary.textContent = `${data.reminder_text} (आज घेतलेली: ${data.taken_count}, बाकी: ${data.pending_count})`;
  } else if (STATE.language === 'en-IN') {
    DOM.simpleMedsSummary.textContent = `${data.reminder_text} (Taken today: ${data.taken_count}, Remaining: ${data.pending_count})`;
  } else {
    DOM.simpleMedsSummary.textContent = `${data.reminder_text} (आज ली गई: ${data.taken_count}, बाकी: ${data.pending_count})`;
  }

  // Advanced Mode Medicine List
  const allMeds = [];
  ['morning', 'afternoon', 'night'].forEach(slot => {
    (data.slots[slot] || []).forEach(m => allMeds.push({ ...m, currentSlot: slot }));
  });

  if (allMeds.length === 0) {
    DOM.advancedMedsList.innerHTML = '<p style="color: var(--text-muted);">No active medicines configured.</p>';
    return;
  }

  DOM.advancedMedsList.innerHTML = allMeds.map(m => {
    const isTaken = m.status === 'taken';
    return `
      <div class="medicine-item">
        <div class="med-info">
          <h4>${m.name}</h4>
          <span class="med-dosage">${m.dosage} • ${m.frequency}</span>
          <div style="margin-top: 4px;">
            <span class="med-timing-badge">${m.timing} (${m.meal_relation || 'After Food'})</span>
            <span class="med-timing-badge" style="background: #FEF3C7; color: #B45309;">Refill: ${m.refill_count || 10} pills left</span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${m.instructions || ''}</p>
        </div>
        <button class="med-check-btn ${isTaken ? 'taken' : ''}" 
          title="${isTaken ? 'Mark as Pending' : 'Mark as Taken'}"
          onclick="toggleMedicineStatus('${m.id}', '${m.currentSlot}', '${isTaken ? 'pending' : 'taken'}')">
          ${isTaken ? '✓' : '○'}
        </button>
      </div>
    `;
  }).join('');
}

async function toggleMedicineStatus(medId, slot, newStatus) {
  try {
    const res = await fetch('/api/medicines/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicine_id: medId, slot: slot, status: newStatus })
    });
    if (res.ok) {
      await loadMedicines();
    }
  } catch (e) {
    console.error('Error toggling medicine:', e);
  }
}

// 2. Documents
async function loadDocuments() {
  try {
    const res = await fetch('/api/documents');
    if (res.ok) {
      const docs = await res.json();
      STATE.documents = docs;
      renderDocuments(docs);
    }
  } catch (e) {
    console.error('Error loading documents:', e);
  }
}

function renderDocuments(docs) {
  DOM.docCountBadge.textContent = `${docs.length} Verified Documents`;

  const btnLabel = STATE.language === 'mr-IN' ? '🔍 सोप्या भाषेत समजावून सांगा' : 
                   STATE.language === 'en-IN' ? '🔍 Explain in Simple Words' : '🔍 Explain (सरल व्याख्या)';

  const html = docs.map(d => `
    <div class="doc-card">
      <div>
        <span class="doc-badge">${d.doc_type}</span>
        <h4>${d.title}</h4>
        <p class="doc-summary">${d.simplified_summary ? d.simplified_summary.substring(0, 160) + '...' : 'Document uploaded and analyzed.'}</p>
      </div>
      <div class="doc-actions">
        <button class="btn-primary" onclick="openDocumentDetails('${d.id}')">${btnLabel}</button>
      </div>
    </div>
  `).join('');

  DOM.overviewDocsList.innerHTML = html;
  DOM.advancedDocsGrid.innerHTML = html;
}

async function openDocumentDetails(docId) {
  try {
    const res = await fetch(`/api/documents/${docId}/explain?language_code=${STATE.language}`);
    if (res.ok) {
      const data = await res.json();
      DOM.docModalTitle.textContent = data.title;
      DOM.docModalSummary.textContent = data.summary;

      // Key Findings
      const findings = data.structured_data?.important_findings || [];
      if (findings.length > 0) {
        DOM.docModalFindings.innerHTML = findings.map(f => `
          <div style="background: white; border: 1px solid var(--border-color); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.9rem;">
            <strong>${f.label}:</strong> ${f.value} 
            <span class="vital-status ${f.status && f.status.toLowerCase() === 'high' ? 'high' : 'normal'}">${f.status || 'Normal'}</span>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">${f.note || ''}</div>
          </div>
        `).join('');
      } else {
        DOM.docModalFindings.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted);">No abnormal laboratory flags noted.</p>';
      }

      // Questions for doctor
      const questions = data.structured_data?.questions_for_doctor || [];
      if (questions.length > 0) {
        DOM.docModalQuestions.innerHTML = questions.map(q => `<li>${q}</li>`).join('');
      } else {
        DOM.docModalQuestions.innerHTML = '<li>Confirm current dosages during your consultation.</li>';
      }

      // Audio summary button
      DOM.docSpeakSummaryBtn.onclick = () => {
        if (data.audio_base64) {
          playAudioBase64(data.audio_base64, STATE.voiceSpeed);
        }
      };

      DOM.docDetailModal.classList.add('active');
    }
  } catch (e) {
    console.error('Error explaining document:', e);
  }
}

// 3. Timeline & Appointments
async function loadTimeline() {
  try {
    const res = await fetch('/api/timeline');
    if (res.ok) {
      const events = await res.json();
      STATE.timeline = events;
      renderTimeline(events);
    }
  } catch (e) {
    console.error('Error loading timeline:', e);
  }
}

function renderTimeline(events) {
  DOM.timelineStream.innerHTML = events.map(e => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <span class="timeline-date">${e.timestamp}</span>
      <h4 class="timeline-title">${e.title}</h4>
      <p style="font-size: 0.85rem; color: var(--text-muted);">${e.description}</p>
    </div>
  `).join('');
}

async function loadAppointments() {
  try {
    const res = await fetch('/api/appointments');
    if (res.ok) {
      STATE.appointments = await res.json();
    }
  } catch (e) {
    console.error('Error loading appointments:', e);
  }
}

// 4. Family Circle
async function loadFamilyCircle() {
  try {
    const res = await fetch('/api/family');
    const auditRes = await fetch('/api/family/audit');

    if (res.ok) {
      const family = await res.json();
      STATE.family = family;
      renderFamily(family);
    }
    if (auditRes.ok) {
      const logs = await auditRes.json();
      renderFamilyAudit(logs);
    }
  } catch (e) {
    console.error('Error loading family circle:', e);
  }
}

function renderFamily(family) {
  if (family.length === 0) {
    DOM.familyMembersList.innerHTML = '<p style="color: var(--text-muted);">No caregivers connected yet.</p>';
    return;
  }

  DOM.familyMembersList.innerHTML = family.map(f => `
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h4>${f.caregiver_name} (${f.relationship})</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${f.phone} • ${f.email || ''}</p>
        <div style="margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap;">
          <span class="card-action-badge">Medicines: ${f.permissions?.can_view_medicines ? '✓ Yes' : '✗ No'}</span>
          <span class="card-action-badge">Reports: ${f.permissions?.can_view_documents ? '✓ Yes' : '✗ No'}</span>
          <span class="card-action-badge" style="background: #FCE7F3; color: #BE185D;">Emergency: ${f.permissions?.is_emergency_contact ? '✓ Yes' : '✗ No'}</span>
        </div>
      </div>
      <button class="btn-secondary" style="color: var(--accent-rose); border-color: var(--accent-rose);" onclick="revokeCaregiver('${f.id}')">Revoke</button>
    </div>
  `).join('');
}

function renderFamilyAudit(logs) {
  if (logs.length === 0) {
    DOM.familyAuditList.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted);">No recent caregiver activity recorded.</p>';
    return;
  }

  DOM.familyAuditList.innerHTML = logs.map(l => `
    <div style="padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
      <span style="color: var(--text-muted); font-size: 0.75rem;">${l.timestamp}</span> • 
      <strong>${l.caregiver_name || 'Caregiver'}</strong>: ${l.action} (${l.target_resource})
    </div>
  `).join('');
}

async function revokeCaregiver(memberId) {
  if (!confirm("Are you sure you want to revoke this caregiver's access?")) return;
  try {
    const res = await fetch(`/api/family/${memberId}`, { method: 'DELETE' });
    if (res.ok) await loadFamilyCircle();
  } catch (e) {
    console.error('Error revoking caregiver:', e);
  }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================
function setupEventListeners() {
  // Mode toggle button
  DOM.modeToggleBtn.addEventListener('click', toggleMode);

  // Language selector - Instantly updates entire website into selected language!
  DOM.langSelector.addEventListener('change', async (e) => {
    const newLang = e.target.value;
    applyLanguage(newLang);
    
    // Save language preference in user profile
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: newLang })
    });
  });

  // Main Microphone button
  DOM.mainMicBtn.addEventListener('click', toggleVoiceRecording);

  // Repeat audio button
  DOM.repeatAudioBtn.addEventListener('click', () => {
    if (STATE.lastAudioBase64) {
      playAudioBase64(STATE.lastAudioBase64, STATE.voiceSpeed);
    } else {
      alert("No previous audio response to replay.");
    }
  });

  // Slow audio button (elderly-friendly)
  DOM.slowAudioBtn.addEventListener('click', () => {
    STATE.voiceSpeed = STATE.voiceSpeed === 1.0 ? 0.8 : 1.0;
    const dict = I18N[STATE.language] || I18N['hi-IN'];
    const slowLbl = document.getElementById('slow-audio-label');
    if (slowLbl) {
      slowLbl.textContent = STATE.voiceSpeed === 0.8 ? dict.normal_audio : dict.slow_audio;
    }
    if (STATE.lastAudioBase64) {
      playAudioBase64(STATE.lastAudioBase64, STATE.voiceSpeed);
    }
  });

  // Stop audio button
  DOM.stopAudioBtn.addEventListener('click', stopAudio);

  // Emergency SOS
  DOM.sosBtn.addEventListener('click', () => {
    DOM.sosModal.classList.add('active');
  });

  // Modal Closers
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('active');
    });
  });

  // Replay inside response modal
  DOM.modalReplayBtn.addEventListener('click', () => {
    if (STATE.lastAudioBase64) {
      playAudioBase64(STATE.lastAudioBase64, STATE.voiceSpeed);
    }
  });

  // Advanced Nav Tabs
  DOM.navTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.navTabBtns.forEach(b => b.classList.remove('active'));
      DOM.tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const pane = document.getElementById(tabId);
      if (pane) pane.classList.add('active');
    });
  });

  // Chat send button
  DOM.chatSendBtn.addEventListener('click', () => {
    const text = DOM.chatTextInput.value;
    DOM.chatTextInput.value = '';
    sendQueryToServer(text);
  });

  DOM.chatTextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = DOM.chatTextInput.value;
      DOM.chatTextInput.value = '';
      sendQueryToServer(text);
    }
  });

  DOM.chatMicBtn.addEventListener('click', toggleVoiceRecording);

  // Overview Quick Ask
  DOM.overviewQuickAskBtn.addEventListener('click', () => {
    const q = DOM.overviewQuickAsk.value;
    if (q) {
      DOM.overviewQuickAsk.value = '';
      const chatTabBtn = document.querySelector('[data-tab="tab-chat"]');
      if (chatTabBtn) chatTabBtn.click();
      sendQueryToServer(q);
    }
  });

  // Document Upload Dropzone & File Input
  DOM.docUploadTrigger.addEventListener('click', () => {
    DOM.docFileInput.click();
  });

  DOM.docFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', file.name.toLowerCase().includes('presc') ? 'prescription' : 'blood_report');
    formData.append('language_code', STATE.language);

    setVoiceState('processing', 'Analyzing medical document with Sarvam AI...');
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const doc = await res.json();
        setVoiceState('idle');
        await loadDocuments();
        await loadTimeline();
        openDocumentDetails(doc.id);
      } else {
        setVoiceState('error', 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setVoiceState('error', 'Network error during upload');
    }
  });

  // Simple Action Cards clicks
  DOM.cardSimpleMeds.addEventListener('click', () => {
    applyModeUI('advanced');
    const tab = document.querySelector('[data-tab="tab-medicines"]');
    if (tab) tab.click();
  });

  DOM.cardSimpleReports.addEventListener('click', () => {
    applyModeUI('advanced');
    const tab = document.querySelector('[data-tab="tab-documents"]');
    if (tab) tab.click();
  });

  DOM.cardSimpleAppointment.addEventListener('click', () => {
    applyModeUI('advanced');
    const tab = document.querySelector('[data-tab="tab-timeline"]');
    if (tab) tab.click();
  });

  DOM.cardSimpleFamily.addEventListener('click', () => {
    applyModeUI('advanced');
    const tab = document.querySelector('[data-tab="tab-family"]');
    if (tab) tab.click();
  });

  // Add Medicine Modal trigger
  DOM.addMedBtn.addEventListener('click', () => {
    DOM.addMedModal.classList.add('active');
  });

  DOM.addMedForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('new-med-name').value,
      dosage: document.getElementById('new-med-dosage').value,
      frequency: 'As Prescribed',
      timing: document.getElementById('new-med-timing').value,
      meal_relation: document.getElementById('new-med-meal').value,
      instructions: document.getElementById('new-med-instructions').value
    };

    try {
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        DOM.addMedModal.classList.remove('active');
        DOM.addMedForm.reset();
        await loadMedicines();
      }
    } catch (err) {
      console.error('Error adding medicine:', err);
    }
  });

  // Bottom Navigation tabs
  DOM.bottomNavItems.forEach(item => {
    item.addEventListener('click', () => {
      DOM.bottomNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const navTarget = item.getAttribute('data-nav');

      if (navTarget === 'home') {
        applyModeUI('simple');
      } else if (navTarget === 'medicines') {
        applyModeUI('advanced');
        const tab = document.querySelector('[data-tab="tab-medicines"]');
        if (tab) tab.click();
      } else if (navTarget === 'reports') {
        applyModeUI('advanced');
        const tab = document.querySelector('[data-tab="tab-documents"]');
        if (tab) tab.click();
      } else if (navTarget === 'family') {
        applyModeUI('advanced');
        const tab = document.querySelector('[data-tab="tab-family"]');
        if (tab) tab.click();
      }
    });
  });
}
