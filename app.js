/**
 * Health-Bridge: Rural Health Triage & Doctor-Patient Bridge
 * Core Prototype JavaScript Engine
 */

// ============================================================================
// 1. Initial State & Data Store (persisted in localStorage)
// ============================================================================

const STORAGE_KEY = 'health_bridge_state_v1';

const defaultState = {
  currentRole: 'patient', // 'patient' | 'doctor'
  selectedLang: 'en',     // 'en' | 'hi' | 'ta' | 'kn'
  patientProfile: {
    name: 'Ramesh Kumar',
    age: 58,
    gender: 'Male',
    abhaId: 'ABHA-91-4432-8819-01',
    village: 'Shivanasamudra, Mandya District, Karnataka',
    bloodGroup: 'B+',
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Dyslipidemia'],
    activeMedications: [
      { name: 'Aspirin', dose: '75mg OD', purpose: 'Antiplatelet / Blood thinner', warningIf: ['bleeding', 'black stool', 'melena', 'stomach pain', 'vomiting blood'] },
      { name: 'Metformin', dose: '500mg BD', purpose: 'Oral Hypoglycemic', warningIf: ['dehydration', 'severe diarrhea', 'lactic acidosis'] },
      { name: 'Atorvastatin', dose: '20mg HS', purpose: 'Lipid Lowering' },
      { name: 'Amlodipine', dose: '5mg OD', purpose: 'Antihypertensive' }
    ]
  },
  patientTimeline: [
    {
      id: 'vis-1',
      date: '12 Jun 2026',
      facility: 'Primary Health Centre, Malavalli',
      complaint: 'Routine T2DM checkup & mild fatigue. Fasting Blood Glucose 168 mg/dL.',
      doctor: 'Dr. K. Sharma (KMC-44912)',
      prescription: 'Tab Metformin 500mg BD, Tab Glimepiride 1mg OD',
      outcome: 'Controlled, lifestyle counseling provided'
    },
    {
      id: 'vis-2',
      date: '04 Mar 2026',
      facility: 'Mandya District Hospital (Tele-consult)',
      complaint: 'Spike in Blood Pressure (160/100 mmHg) with occipital morning headache.',
      doctor: 'Dr. Rajesh Verma (NMC-KA-84920)',
      prescription: 'Added Tab Amlodipine 5mg OD, Low sodium diet advised',
      outcome: 'BP stabilized to 132/84 within 2 weeks'
    },
    {
      id: 'vis-3',
      date: '20 Nov 2025',
      facility: 'Gram Panchayat Sub-Centre',
      complaint: 'Seasonal viral fever, myalgia, non-productive cough x 3 days.',
      doctor: 'Community Health Officer Sunita',
      prescription: 'Tab Paracetamol 650mg SOS, ORS packets, Steam inhalation',
      outcome: 'Full recovery within 4 days'
    }
  ],
  doctorProfile: {
    name: 'Dr. Rajesh Verma, MD, DM',
    credentials: 'MBBS, MD (Internal Med), DM (Cardiology, AIIMS)',
    nmcReg: 'NMC-KA-84920',
    stateCouncil: 'Karnataka Medical Council',
    verified: true,
    department: 'Cardiology',
    hospital: 'Victoria Hospital & Apex Tele-Triage Hub, Bengaluru',
    experience: '14 Years',
    avatar: 'RV',
    cmeCredits: 24.5,
    cmeTarget: 30.0,
    cmeCycleEnd: '31 Dec 2026',
    patientsHelped: 428,
    emergencyResolved: 39,
    avgResponseTime: '4.2 mins',
    diagnosticAgreement: '98.4%',
    cmeHistory: [
      { date: '10 Sep 2026', caseId: 'CASE-7821', action: 'Verified Rural STEMI Referral', credits: '+1.0' },
      { date: '08 Sep 2026', caseId: 'CASE-7814', action: 'Approved Diabetic Triage', credits: '+0.5' },
      { date: '04 Sep 2026', caseId: 'CASE-7798', action: 'Reviewed Asthma Exacerbation', credits: '+0.5' }
    ]
  },
  availableDoctors: [
    {
      id: 'doc-1',
      name: 'Dr. Rajesh Verma',
      degrees: 'MD (AIIMS), DM (Cardiology)',
      nmcId: 'NMC-KA-84920',
      dept: 'Cardiology',
      hospital: 'Victoria Hospital, Bengaluru',
      status: 'On-Duty Emergency Tele-Triage',
      response: '< 5 min',
      experience: '14 yrs'
    },
    {
      id: 'doc-2',
      name: 'Dr. Ananya Sen',
      degrees: 'MD (Pulmonary Medicine)',
      nmcId: 'NMC-DL-33412',
      dept: 'Pulmonology',
      hospital: 'VMMC & Safdarjung Hospital, New Delhi',
      status: 'Available',
      response: '< 10 min',
      experience: '9 yrs'
    },
    {
      id: 'doc-3',
      name: 'Dr. Suresh Hegde',
      degrees: 'MD (General Medicine)',
      nmcId: 'KMC-77219',
      dept: 'General Medicine',
      hospital: 'Mysore Medical College & Research Institute',
      status: 'Available',
      response: '< 8 min',
      experience: '16 yrs'
    },
    {
      id: 'doc-4',
      name: 'Dr. Preethi Rao',
      degrees: 'MD (Pediatrics), DCH',
      nmcId: 'KMC-90812',
      dept: 'Pediatrics',
      hospital: 'Indira Gandhi Institute of Child Health, Bengaluru',
      status: 'Available',
      response: '< 12 min',
      experience: '11 yrs'
    },
    {
      id: 'doc-5',
      name: 'Dr. Meenakshi Sundaram',
      degrees: 'MS (OBGYN), DGO',
      nmcId: 'TNMC-45129',
      dept: 'Obstetrics & Gynecology',
      hospital: 'Govt Maternity Hospital, Chennai',
      status: 'On-Duty',
      response: '< 7 min',
      experience: '15 yrs'
    }
  ],
  assignedCases: [
    {
      id: 'CASE-8824',
      patientName: 'Ramesh Kumar (58/M)',
      time: 'Just now',
      department: 'Cardiology',
      symptoms: 'Retrosternal chest tightness radiating to left arm & jaw x 3 hours, cold diaphoresis.',
      prescriptionSummary: 'Extract: Aspirin 75mg, Metformin 500mg, Atorvastatin 20mg.',
      severity: 'RED',
      confidence: 96,
      needsDoctorVerification: false,
      status: 'Pending', // 'Pending' | 'Approved' | 'Edited' | 'Overridden'
      aiCondition: 'Suspected Acute Coronary Syndrome (STEMI / NSTEMI)',
      aiAction: 'Immediate referral to nearest PCI-capable hospital; administer chewable Aspirin & Sorbitrate.',
      doctorNotes: ''
    },
    {
      id: 'CASE-8819',
      patientName: 'Gowramma (64/F)',
      time: '42 mins ago',
      department: 'General Medicine',
      symptoms: 'High fever x 4 days, severe epigastric burning, dark black tarry stools.',
      prescriptionSummary: 'Handwritten Rx illegible, possible NSAID / Diclofenac abuse.',
      severity: 'RED',
      confidence: 48,
      needsDoctorVerification: true,
      status: 'Pending',
      aiCondition: 'Suspected Upper GI Bleed secondary to NSAID gastropathy',
      aiAction: 'Hold all NSAIDs/Aspirin, arrange urgent primary health centre blood grouping & IV fluids.',
      doctorNotes: ''
    },
    {
      id: 'CASE-8805',
      patientName: 'Basavaraj (42/M)',
      time: '2 hours ago',
      department: 'Pulmonology',
      symptoms: 'Productive cough with yellowish sputum x 5 days, mild low-grade evening fever.',
      prescriptionSummary: 'None uploaded.',
      severity: 'YELLOW',
      confidence: 89,
      needsDoctorVerification: false,
      status: 'Approved',
      aiCondition: 'Acute Bronchitis vs Lower Respiratory Tract Infection',
      aiAction: 'Primary Health Centre visit within 24h, Sputum AFB test, Paracetamol & hydration.',
      doctorNotes: 'Approved with note: Check pulse oximetry at village sub-centre.'
    }
  ],
  communityFeed: [
    {
      id: 'post-1',
      author: 'Dr. Rajesh Verma',
      role: 'doctor',
      dept: 'Cardiology',
      avatar: 'RV',
      time: '3 hours ago',
      title: '🚨 Warning for Rural Field Workers: Differentiating Cardiac Angina vs Gas/Gastritis',
      content: 'In agricultural workers, retrosternal heaviness is frequently mistaken for "gas trouble" or acidity. If chest pressure radiates to the left shoulder, inner arm, or lower jaw and is accompanied by sudden cold sweating, DO NOT give antacids. Refer immediately for a 12-lead ECG. Timely golden-hour thrombolysis saves lives.',
      upvotes: 42,
      comments: [
        { author: 'Sunita (ASHA Worker, Mandya)', text: 'Thank you Doctor Saab! We had one patient saved last week because we checked for sweating.', time: '1 hr ago' }
      ]
    },
    {
      id: 'post-2',
      author: 'Dr. Ananya Sen',
      role: 'doctor',
      dept: 'Pulmonology',
      avatar: 'AS',
      time: '1 day ago',
      title: '🌾 Post-Harvest Dust Exposure & Asthmatic Flare-ups',
      content: 'Paddy harvesting generates high airborne particulate matter. Chronic lung and asthmatic patients must wear cotton cloth masks during threshing. If wheezing does not respond to Salbutamol inhaler within 20 minutes, report to Taluk hospital immediately.',
      upvotes: 28,
      comments: []
    },
    {
      id: 'post-3',
      author: 'Shankar Gowda (Farmer, Shivanasamudra)',
      role: 'patient',
      dept: 'General Medicine',
      avatar: 'SG',
      time: '2 days ago',
      title: 'Question: Swelling in both feet after starting new BP tablet',
      content: 'Namaskara doctors. My doctor prescribed a new small white BP tablet 10 days ago. Since 3 days both my ankles are swollen. No chest pain. Is this serious or normal?',
      upvotes: 14,
      comments: [
        {
          author: 'Dr. Suresh Hegde',
          role: 'doctor',
          verified: true,
          text: 'Verified Clinician Advice: If the tablet is Amlodipine (very common for BP), pedal ankle edema is a known benign side effect. However, please get your urine tested for protein and kidney function (Creatinine) at the PHC to rule out renal causes. Do not stop your BP pill abruptly.',
          time: '1 day ago'
        }
      ]
    }
  ],
  chatMessages: [
    {
      id: 'msg-1',
      sender: 'doctor',
      text: 'Namaste Ramesh ji. I am Dr. Rajesh Verma, Cardiologist on tele-triage duty. I received your urgent symptoms alert regarding chest tightness and left arm pain. How are you feeling right now?',
      time: '12:02 PM'
    },
    {
      id: 'msg-2',
      sender: 'patient',
      text: 'Namaste Doctor. Pain is heavy in middle of chest for 3 hours, also sweating a lot. Took one Paracetamol 1 hour ago but no relief.',
      time: '12:05 PM'
    }
  ]
};

// Load state from localStorage or initialize with defaults
let appState = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse localStorage state:', e);
  }
  return JSON.parse(JSON.stringify(defaultState));
})();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// ============================================================================
// 2. Multilingual Localization & Preset Clinical Scenarios
// ============================================================================

const LOCALIZED_PRESETS = {
  hi: {
    langName: 'हिन्दी (Hindi)',
    langCode: 'hi-IN',
    presets: [
      {
        title: 'सीने में दर्द व सांस फूलना (Critical / Red)',
        text: 'मुझे 3 दिन से सीने में तेज दर्द, भारीपन और बाएं हाथ में खिंचाव हो रहा है। पसीना आ रहा है और सांस लेने में बहुत तकलीफ हो रही है।',
        symptom: 'सीने में दर्द व भारीपन (Chest pain & heaviness radiating to left arm)',
        duration: '3 दिन (3 days)',
        severity: 'तेज / गंभीर (Severe)',
        keywords: ['सीने में दर्द', 'बाएं हाथ', 'पसीना', 'सांस फूलना']
      },
      {
        title: 'खांसी और बुखार (Moderate / Yellow)',
        text: 'मुझे 4 दिनों से लगातार बलगम वाली खांसी और हल्का बुखार है। रात में ठंड लगती है पर सीने में दर्द नहीं है।',
        symptom: 'बलगम वाली खांसी व बुखार (Productive cough & fever)',
        duration: '4 दिन (4 days)',
        severity: 'मध्यम (Moderate)',
        keywords: ['खांसी', 'बलगम', 'बुखार']
      },
      {
        title: 'पेट में जलन व सिरदर्द (Mild / Green)',
        text: 'कल रात से पेट में हल्का दर्द और खट्टी डकारें आ रही हैं। थोड़ा सिरदर्द भी है।',
        symptom: 'पेट में जलन व अपच (Epigastric acidity & mild headache)',
        duration: '1 दिन (1 day)',
        severity: 'हल्का (Mild)',
        keywords: ['पेट में जलन', 'खट्टी डकारें', 'सिरदर्द']
      }
    ],
    tts: {
      red: 'चेतावनी: यह एक गंभीर आपातकालीन स्थिति है। सीने में तेज दर्द दिल के दौरे का संकेत हो सकता है। तुरंत 108 एम्बुलेंस बुलाएं या नजदीकी बड़े अस्पताल जाएं। किसी भी काम से बचें और शांत बैठें।',
      yellow: 'सलाह: आपकी समस्या की निगरानी जरूरी है। अगले 24 से 48 घंटों में नजदीकी प्राथमिक स्वास्थ्य केंद्र में डॉक्टर से जांच करवाएं और पर्याप्त पानी पिएं।',
      green: 'सलाह: आपकी स्थिति सामान्य है। घर पर आराम करें, सादा भोजन लें और ओआरएस पिएं। यदि दो दिन में आराम न मिले तो स्वास्थ्य केंद्र जाएं।'
    }
  },
  ta: {
    langName: 'தமிழ் (Tamil)',
    langCode: 'ta-IN',
    presets: [
      {
        title: 'மார்பு வலி மற்றும் மூச்சுத்திணறல் (Critical / Red)',
        text: 'எனக்கு 3 மணி நேரமாக கடுமையான மார்பு வலி, இடது கைக்கு பரவும் வலி மற்றும் அதிக வியர்வை உள்ளது. மூச்சு விட சிரமமாக உள்ளது.',
        symptom: 'கடுமையான மார்பு வலி (Severe crushing chest pain)',
        duration: '3 மணி நேரம் (3 hours)',
        severity: 'கடுமையான (Severe/Critical)',
        keywords: ['மார்பு வலி', 'இடது கை', 'வியர்வை', 'மூச்சுத்திணறல்']
      },
      {
        title: 'தொடர் சளி மற்றும் இருமல் (Moderate / Yellow)',
        text: 'எனக்கு 5 நாட்களாக சளி, இருமல் மற்றும் மிதமான காய்ச்சல் உள்ளது. படுக்கையில் படுத்தால் இருமல் கூடுகிறது.',
        symptom: 'தொடர் சளி மற்றும் இருமல் (Persistent cough & fever)',
        duration: '5 நாட்கள் (5 days)',
        severity: 'மிதமான (Moderate)',
        keywords: ['சளி', 'இருமல்', 'காய்ச்சல்']
      },
      {
        title: 'வாயு தொல்லை மற்றும் லேசான தலைவலி (Mild / Green)',
        text: 'நேற்று முதல் லேசான அஜீரணம் மற்றும் வயிற்று உப்புசம் உள்ளது. பெரிய வலி ஏதும் இல்லை.',
        symptom: 'அஜீரணம் மற்றும் உப்புசம் (Mild dyspepsia)',
        duration: '1 நாள் (1 day)',
        severity: 'லேசான (Mild)',
        keywords: ['அஜீரணம்', 'வயிறு உப்புசம்']
      }
    ],
    tts: {
      red: 'எச்சரிக்கை: இது மிக அவசரமான நிலை. கடுமையான மார்பு வலி மாரடைப்பாக இருக்கலாம். உடனடியாக 108 ஆம்புலன்ஸை அழைத்து அவசர மருத்துவமனைக்குச் செல்லுங்கள். நடப்பதை தவிர்த்து ஓய்வெடுக்கவும்.',
      yellow: 'ஆலோசனை: உங்களது அறிகுறிகள் மருத்துவரால் கண்காணிக்கப்பட வேண்டும். 24 மணி நேரத்திற்குள் ஆரம்ப சுகாதார நிலையத்திற்கு சென்று பரிசோதனை செய்யவும்.',
      green: 'ஆலோசனை: கவலைப்பட தேவையில்லை. வீட்டில் ஓய்வெடுத்து நீர்ச்சத்து நிறைந்த உணவுகளை உட்கொள்ளுங்கள். அறிகுறிகள் தொடர்ந்தால் மருத்துவரை அணுகவும்.'
    }
  },
  kn: {
    langName: 'ಕನ್ನಡ (Kannada)',
    langCode: 'kn-IN',
    presets: [
      {
        title: 'ತೀವ್ರ ಎದೆ ನೋವು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆ (Critical / Red)',
        text: 'ನನಗೆ 3 ಗಂಟೆಗಳಿಂದ ಎದೆಯ ಮಧ್ಯದಲ್ಲಿ ತೀವ್ರವಾದ ನೋವು, ಎಡ ತೋಳಿಗೆ ಹರಡುವ ನೋವು ಮತ್ತು ಅತಿಯಾದ ಬೆವರು ಬರುತ್ತಿದೆ. ಉಸಿರಾಟ ಕಷ್ಟವಾಗಿದೆ.',
        symptom: 'ತೀವ್ರ ಎದೆ ನೋವು (Severe crushing chest pain)',
        duration: '3 ಗಂಟೆ (3 hours)',
        severity: 'ತೀವ್ರ ತುರ್ತು (Severe/Critical)',
        keywords: ['ಎದೆ ನೋವು', 'ಎಡ ತೋಳು', 'ಬೆವರು', 'ಉಸಿರಾಟ']
      },
      {
        title: 'ಕೆಮ್ಮು ಮತ್ತು ಮೈ ಬಿಸಿ (Moderate / Yellow)',
        text: 'ಕಳೆದ 4 ದಿನಗಳಿಂದ ಕಫದ ಕೆಮ್ಮು ಮತ್ತು ಸಂಜೆ ವೇಳೆ ಜ್ವರ ಬರುತ್ತಿದೆ. ಸುಸ್ತು ಜಾಸ್ತಿಯಾಗಿದೆ.',
        symptom: 'ಕಫದ ಕೆಮ್ಮು ಮತ್ತು ಜ್ವರ (Productive cough & fever)',
        duration: '4 ದಿನ (4 days)',
        severity: 'ಮಧ್ಯಮ (Moderate)',
        keywords: ['ಕೆಮ್ಮು', 'ಕಫ', 'ಜ್ವರ']
      },
      {
        title: 'ಹೊಟ್ಟೆ ಉರಿ ಮತ್ತು ತಲೆಸುತ್ತು (Mild / Green)',
        text: 'ಊಟ ಸರಿಯಾಗಿ ಜೀರ್ಣವಾಗಿಲ್ಲ, ಸ್ವಲ್ಪ ಹೊಟ್ಟೆ ಉರಿ ಮತ್ತು ಗ್ಯಾಸ್ಟ್ರಿಕ್ ಸಮಸ್ಯೆ ಇದೆ.',
        symptom: 'ಹೊಟ್ಟೆ ಉರಿ (Mild gastritis)',
        duration: '1 ದಿನ (1 day)',
        severity: 'ಸಾಮಾನ್ಯ (Mild)',
        keywords: ['ಹೊಟ್ಟೆ ಉರಿ', 'ಗ್ಯಾಸ್ಟ್ರಿಕ್']
      }
    ],
    tts: {
      red: 'ಎಚ್ಚರಿಕೆ: ಇದು ತೀವ್ರ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಾಗಿದೆ. ಎದೆ ನೋವು ಹೃದಯಾಘಾತದ ಲಕ್ಷಣವಾಗಿರಬಹುದು. ತಕ್ಷಣ 108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ ಅಥವಾ ಸಮೀಪದ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ. ಆತಂಕಪಡದೆ ಕುಳಿತುಕೊಳ್ಳಿ.',
      yellow: 'ಸಲಹೆ: ನಿಮ್ಮ ಆರೋಗ್ಯ ಸ್ಥಿತಿಯನ್ನು ಪರೀಕ್ಷಿಸಬೇಕಾಗಿದೆ. ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ಸಮೀಪದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.',
      green: 'ಸಲಹೆ: ಇದು ಸಾಮಾನ್ಯ ಸಮಸ್ಯೆಯಾಗಿದೆ. ಮನೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ, ಹಗುರ ಆಹಾರ ಸೇವಿಸಿ ಮತ್ತು ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.'
    }
  },
  en: {
    langName: 'English',
    langCode: 'en-US',
    presets: [
      {
        title: 'Acute Chest Tightness Radiating to Left Arm (Critical / Red)',
        text: 'Severe crushing chest pain radiating to left arm, neck and jaw for 3 hours with diaphoresis (cold sweats) and shortness of breath.',
        symptom: 'Severe retrosternal crushing chest pain with left arm radiation',
        duration: '3 hours',
        severity: 'Critical / Severe',
        keywords: ['chest pain', 'radiating', 'sweating', 'dyspnea', 'arm pain']
      },
      {
        title: 'Sub-acute Productive Cough & Low-grade Fever (Moderate / Yellow)',
        text: 'Productive cough with yellowish phlegm for 4 days, mild fever in evenings, and localized chest tightness when coughing.',
        symptom: 'Productive cough with yellow sputum and low-grade pyrexia',
        duration: '4 days',
        severity: 'Moderate',
        keywords: ['productive cough', 'yellow sputum', 'fever', 'tightness']
      },
      {
        title: 'Mild Post-Prandial Dyspepsia & Acidity (Mild / Green)',
        text: 'Mild upper abdominal bloating, sour belching and acidity since yesterday evening after oily food. No vomiting.',
        symptom: 'Mild dyspepsia and acid reflux',
        duration: '1 day',
        severity: 'Mild',
        keywords: ['bloating', 'sour belching', 'acidity', 'mild']
      }
    ],
    tts: {
      red: 'Urgent Medical Alert: You have critical symptoms indicative of Acute Coronary Syndrome or Cardiac Emergency. Dial 108 ambulance immediately or proceed to the nearest emergency referral center. Rest completely and do not exert yourself.',
      yellow: 'Medical Recommendation: Your symptoms require clinical evaluation and monitoring. Please visit your Primary Health Centre within 24 to 48 hours for laboratory check and doctor assessment.',
      green: 'Medical Guidance: Your condition appears mild and suitable for home management. Stay hydrated with clean water and ORS, eat light meals, and rest. If symptoms worsen, consult a healthcare worker.'
    }
  }
};

// ============================================================================
// 3. Sample Prescription Records for Vision Reader
// ============================================================================

const SAMPLE_PRESCRIPTIONS = {
  sample1: {
    id: 'rx-cardiac',
    name: 'Sample 1: Handwritten Rural Clinic Rx (Cardiac & Diabetic)',
    doctor: 'Dr. K. Sharma, MBBS',
    regNo: 'KMC-44912',
    facility: 'Primary Health Centre, Shivanasamudra',
    date: '14 August 2026',
    diagnosis: 'Type 2 Diabetes Mellitus, Essential HTN, Coronary Artery Disease (Stable)',
    confidence: 94,
    needsDoctorVerification: false,
    medicines: [
      { name: 'Tab Aspirin', dose: '75 mg', freq: '1-0-0 (Morning)', duration: 'Daily post meal' },
      { name: 'Tab Metformin', dose: '500 mg', freq: '1-0-1 (BD)', duration: 'Daily after meals' },
      { name: 'Tab Atorvastatin', dose: '20 mg', freq: '0-0-1 (Night)', duration: 'At bedtime' },
      { name: 'Tab Amlodipine', dose: '5 mg', freq: '1-0-0 (Morning)', duration: 'Daily' }
    ],
    clinicalNotes: 'Monitor fasting blood sugar monthly. Avoid NSAIDs without prescription.',
    svgThumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23fffdfa" stroke="%23cbd5e1"/><text x="15" y="25" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f766e">Govt PHC Clinic - Shivanasamudra</text><text x="15" y="45" font-family="sans-serif" font-size="10" fill="%2364748b">Date: 14/08/2026 | Pt: Ramesh Kumar (58/M)</text><path d="M15 55 L285 55" stroke="%230f766e" stroke-width="1.5"/><text x="15" y="75" font-family="cursive" font-size="16" fill="%231e293b">Rx:</text><text x="35" y="95" font-family="cursive" font-size="14" fill="%23334155">1. Tab Aspirin 75mg - 1 OD</text><text x="35" y="120" font-family="cursive" font-size="14" fill="%23334155">2. Tab Metformin 500mg - 1 BD</text><text x="35" y="145" font-family="cursive" font-size="14" fill="%23334155">3. Tab Atorva 20mg - 1 HS</text><text x="35" y="170" font-family="cursive" font-size="14" fill="%23334155">4. Tab Amlodipine 5mg - 1 OD</text><text x="200" y="190" font-family="cursive" font-size="12" fill="%230f766e">Dr. K. Sharma (KMC)</text></svg>`
  },
  sample2: {
    id: 'rx-messy',
    name: 'Sample 2: Messy Handwritten Note (Low Legibility - Low Confidence Edge Case)',
    doctor: 'Dr. [Unclear / Scribbled]',
    regNo: '[Unverified]',
    facility: 'Private Rural Clinic, Taluk Road',
    date: '02 Sept 2026 (?)',
    diagnosis: 'Abdominal pain / Pyrexia / Suspected Gastritis (?)',
    confidence: 48,
    needsDoctorVerification: true,
    medicines: [
      { name: 'Tab [Diclo... / Diclofenac?]', dose: '50mg (?)', freq: 'TDS (?)', duration: '5 days' },
      { name: 'Tab [Omep... / Pantop?]', dose: '40mg', freq: '1 OD', duration: '3 days' },
      { name: 'Syp [Antacid... Scribbled]', dose: '2 tsp', freq: 'SOS', duration: 'Unknown' }
    ],
    clinicalNotes: 'Handwriting heavily degraded. Dosages partially obscured. Patient on Aspirin; possible high risk NSAID co-prescription!',
    svgThumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23fef2f2" stroke="%23fca5a5"/><text x="15" y="25" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23991b1b">⚠️ Scribbled Private Clinic Slip</text><path d="M15 40 Q80 25 150 42 T285 38" stroke="%2394a3b8" stroke-width="1.5" fill="none"/><path d="M20 70 Q90 60 160 85 T280 75" stroke="%2364748b" stroke-width="2" fill="none"/><path d="M25 105 Q120 90 190 120 T270 100" stroke="%23475569" stroke-width="2.5" fill="none"/><path d="M20 140 Q100 135 180 155 T285 140" stroke="%23334155" stroke-width="2" fill="none"/><text x="20" y="180" font-family="sans-serif" font-size="10" fill="%23b91c1c">AI Flag: ⚠️ Confidence 48% (Needs Doctor Verification)</text></svg>`
  },
  sample3: {
    id: 'rx-lab',
    name: 'Sample 3: Emergency Lab & ECG Report (Elevated Troponin STEMI)',
    doctor: 'Apex Tele-Diagnostic Center',
    regNo: 'NMC-KA-84920',
    facility: 'District Emergency Diagnostic Lab',
    date: '11 Sept 2026',
    diagnosis: 'Acute Anteroseptal ST-Elevation Myocardial Infarction (STEMI)',
    confidence: 98,
    needsDoctorVerification: false,
    medicines: [
      { name: 'Serum Troponin I (High Sensitive)', dose: '1.85 ng/mL', freq: 'CRITICAL HIGH', duration: 'Normal < 0.04' },
      { name: '12-Lead ECG Findings', dose: 'ST Elevation V1-V4', freq: 'Hyperacute T waves', duration: 'Lead I, aVL reciprocal' },
      { name: 'Random Blood Glucose', dose: '210 mg/dL', freq: 'Elevated', duration: 'Pre-existing T2DM' }
    ],
    clinicalNotes: 'Urgent PCI or thrombolysis indicated within 90 minutes. Activate tele-cardiology team immediately.',
    svgThumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f0fdfa" stroke="%2399f6e4"/><text x="15" y="25" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f766e">Apex Diagnostics - ECG & Cardiac Enzymes</text><text x="15" y="45" font-family="sans-serif" font-size="10" fill="%23047857">12-Lead ECG: ST-Elevation V1-V4 (STEMI)</text><path d="M15 90 L40 90 L45 80 L52 110 L58 40 L65 95 L75 90 L100 90 L105 80 L112 110 L118 40 L125 95 L135 90 L160 90 L165 80 L172 110 L178 40 L185 95 L195 90 L220 90 L225 80 L232 110 L238 40 L245 95 L255 90 L285 90" stroke="%23dc2626" stroke-width="2" fill="none"/><text x="15" y="145" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23b91c1c">Troponin I: 1.85 ng/mL (Ref: &lt; 0.04) [CRITICAL]</text><text x="15" y="175" font-family="sans-serif" font-size="10" fill="%23334155">Action: Immediate transfer to Cath Lab; Call 108</text></svg>`
  }
};

// Current active session triage working object
let currentTriage = {
  rawTranscript: '',
  selectedLanguage: 'en',
  extractedEntities: {
    symptoms: [],
    duration: '',
    severityKeywords: [],
    anatomicalSystem: ''
  },
  prescriptionData: SAMPLE_PRESCRIPTIONS.sample1,
  severity: 'RED',
  urgencyReason: 'Crushing chest pain radiating to left arm with cold sweats indicates suspected Acute Coronary Syndrome.',
  predictedCondition: 'Acute Coronary Syndrome (STEMI / Severe Unstable Angina)',
  recommendedAction: 'REFER URGENTLY: Call 108 ambulance for immediate transfer to PCI-capable tertiary hospital.',
  reasoning: 'Patient is a 58yo male with known T2DM and CAD on Aspirin and Metformin. Acute substernal pain radiating to left arm with diaphoresis carries high cardiac ischemic probability.',
  department: 'Cardiology',
  suggestedInvestigations: ['12-Lead ECG immediately', 'Serum Troponin I / CK-MB', 'Random Blood Glucose', 'Continuous Pulse Oximetry'],
  confidence: 94,
  needsDoctorVerification: false,
  drugInteractionAlert: null,
  doctorReviewStatus: 'Pending',
  reviewedBy: null
};

// ============================================================================
// 4. Clinical Drug Interaction & Safety Rule Engine
// ============================================================================

function checkDrugInteractions(reportedText, activeMeds) {
  const lowerText = reportedText.toLowerCase();
  const alerts = [];

  // Check 1: Aspirin / NSAID + Bleeding / Black Stool / Gastric Pain
  const hasAspirin = activeMeds.some(m => m.name.toLowerCase().includes('aspirin'));
  const bleedingKeywords = ['blood', 'bleed', 'black stool', 'melena', 'vomit blood', 'खून', 'काला मल', 'रक्त', 'இரத்தம்', 'கருப்பு மலம்', 'ರಕ್ತ', 'ಕಪ್ಪು ಮಲ'];
  const hasBleeding = bleedingKeywords.some(kw => lowerText.includes(kw));

  if (hasAspirin && hasBleeding) {
    alerts.push({
      severity: 'CRITICAL',
      title: '🚨 CRITICAL SAFETY ALERT: Suspected Aspirin-Induced GI Bleeding',
      description: 'Patient is currently taking Aspirin 75mg and reports bleeding / black melena stools. Discontinue Aspirin immediately and refer for urgent endoscopic evaluation. Avoid all other NSAIDs (Diclofenac/Ibuprofen).'
    });
  }

  // Check 2: Metformin + Dehydration / Diarrhea
  const hasMetformin = activeMeds.some(m => m.name.toLowerCase().includes('metformin'));
  const diarrheaKeywords = ['diarrhea', 'dehydration', 'loose motion', 'दस्त', 'उल्टी', 'வயிற்றுப்போக்கு', 'ಭೇದಿ'];
  const hasDiarrhea = diarrheaKeywords.some(kw => lowerText.includes(kw));

  if (hasMetformin && hasDiarrhea) {
    alerts.push({
      severity: 'WARNING',
      title: '⚠️ PHARMACOLOGICAL ALERT: Risk of Metformin-Associated Lactic Acidosis (MALA)',
      description: 'Metformin combined with acute diarrhea and dehydration carries a severe risk of lactic acidosis. Withhold Metformin doses until hydration and renal parameters normalize.'
    });
  }

  // Check 3: Amlodipine + Ankle Swelling
  const hasAmlodipine = activeMeds.some(m => m.name.toLowerCase().includes('amlodipine'));
  const edemaKeywords = ['swelling', 'ankle', 'feet', 'सूजन', 'வீக்கம்', 'ಊತ'];
  const hasEdema = edemaKeywords.some(kw => lowerText.includes(kw));

  if (hasAmlodipine && hasEdema) {
    alerts.push({
      severity: 'INFO',
      title: 'ℹ️ DRUG SIDE-EFFECT NOTIFICATION: Calcium Channel Blocker Peripheral Edema',
      description: 'Bilateral ankle edema is a documented benign vasodilator effect of Amlodipine. Elevate legs when resting. Rule out congestive heart failure and nephrotic causes if swelling extends to pre-tibial area.'
    });
  }

  return alerts;
}

// ============================================================================
// 5. AI Triage & Entity Extraction Engine
// ============================================================================

function analyzeAndTriage(textInput, languageCode, selectedRx) {
  const text = (textInput || '').trim();
  const lower = text.toLowerCase();

  // Determine language preset config
  const langKey = languageCode || appState.selectedLang || 'en';
  const langConfig = LOCALIZED_PRESETS[langKey] || LOCALIZED_PRESETS.en;

  // 1. Entity Extraction
  const entities = {
    symptoms: [],
    duration: 'Not specified',
    severityKeywords: [],
    anatomicalSystem: 'General'
  };

  // Extract duration
  const durationMatch = text.match(/(\d+)\s*(days?|hours?|weeks?|दिन|घंटे|நாட்கள்|மணி|ದಿನ|ಗಂಟೆ)/i);
  if (durationMatch) {
    entities.duration = durationMatch[0];
  }

  // Detect severity & keywords
  const redKeywords = [
    'chest pain', 'radiating', 'heart', 'sweating', 'crushing', 'shortness of breath', 'dyspnea', 'unconscious',
    'सीने में दर्द', 'बाएं हाथ', 'पसीना', 'सांस फूलना', 'बेहोश',
    'மார்பு வலி', 'வியர்வை', 'மூச்சுத்திணறல்',
    'ಎದೆ ನೋವು', 'ತೀವ್ರ', 'ಉಸಿರಾಟ'
  ];

  const yellowKeywords = [
    'cough', 'fever', 'sputum', 'phlegm', 'vomiting', 'pain', 'swelling',
    'खांसी', 'बुखार', 'बलगम', 'उल्टी', 'दर्द',
    'இருமல்', 'காய்ச்சல்', 'சளி',
    'ಕೆಮ್ಮು', 'ಜ್ವರ', 'ಕಫ'
  ];

  let matchedRed = redKeywords.filter(k => lower.includes(k.toLowerCase()));
  let matchedYellow = yellowKeywords.filter(k => lower.includes(k.toLowerCase()));

  // 2. Department Matching
  let department = 'General Medicine';
  let predictedCondition = 'General Acute Illness';
  let recommendedAction = 'MONITOR & SCHEDULE PHC VISIT';
  let urgency = 'YELLOW';
  let urgencyReason = 'Clinical symptoms require medical evaluation.';
  let investigations = ['Vital signs monitoring', 'Complete Blood Count', 'Primary medical consultation'];

  if (matchedRed.length > 0 || (selectedRx && selectedRx.id === 'rx-lab')) {
    urgency = 'RED';
    department = 'Cardiology';
    predictedCondition = 'Acute Coronary Syndrome (STEMI / High-Risk Unstable Angina)';
    recommendedAction = 'REFER URGENTLY: Call 108 ambulance for immediate referral to Cardiac Care Unit (CCU).';
    urgencyReason = 'Crushing chest pain radiating to left arm with autonomic diaphoresis points to acute myocardial ischemia.';
    investigations = ['12-Lead ECG immediately (< 10 mins)', 'High-Sensitive Troponin I', 'Bedside Echocardiogram', 'Continuous telemetry'];
    entities.anatomicalSystem = 'Cardiovascular';
    entities.severityKeywords.push('Critical', 'Severe');
    entities.symptoms.push('Acute chest pain radiating to left arm', 'Diaphoresis / cold sweats', 'Exertional dyspnea');
  } else if (lower.includes('cough') || lower.includes('खांसी') || lower.includes('இருமல்') || lower.includes('ಕೆಮ್ಮು') || lower.includes('wheeze') || lower.includes('asthma')) {
    urgency = 'YELLOW';
    department = 'Pulmonology';
    predictedCondition = 'Acute Bronchitis / Asthmatic Exacerbation / Lower Respiratory Tract Infection';
    recommendedAction = 'OBSERVE & TREAT AT PHC: Visit Primary Health Centre within 24 hours. Start prescribed bronchodilator / steam inhalation.';
    urgencyReason = 'Productive cough with low-grade pyrexia indicates localized respiratory airway inflammation.';
    investigations = ['Chest X-Ray (PA View)', 'Pulse Oximetry (SpO2)', 'Sputum Gram Stain & AFB'];
    entities.anatomicalSystem = 'Respiratory';
    entities.severityKeywords.push('Moderate');
    entities.symptoms.push('Productive cough', 'Low-grade fever', 'Chest tightness on coughing');
  } else if (lower.includes('child') || lower.includes('baby') || lower.includes('infant') || lower.includes('बच्चा') || lower.includes('குழந்தை') || lower.includes('ಮಗು')) {
    urgency = 'YELLOW';
    department = 'Pediatrics';
    predictedCondition = 'Pediatric Febrile Illness';
    recommendedAction = 'SCHEDULE PEDIATRICIAN VISIT: Check temperature every 4 hours, oral rehydration.';
    urgencyReason = 'Pediatric fever requires weight-based dosing and pediatric clinical assessment.';
    investigations = ['Pediatric vitals', 'Urine routine', 'Peripheral blood smear'];
    entities.anatomicalSystem = 'Pediatrics';
    entities.severityKeywords.push('Moderate');
    entities.symptoms.push('Pediatric fever', 'Irritability');
  } else if (lower.includes('pregnancy') || lower.includes('cramp') || lower.includes('गर्भवती') || lower.includes('கர்ப்பிணி') || lower.includes('ಗರ್ಭಿಣಿ')) {
    urgency = 'YELLOW';
    department = 'Obstetrics & Gynecology';
    predictedCondition = 'Antenatal Consultation Required';
    recommendedAction = 'REFER TO MATERNITY CLINIC: Antenatal assessment by Medical Officer.';
    urgencyReason = 'Maternal symptoms during pregnancy require fetal heart sound check and obstetric exam.';
    investigations = ['Fetal Doppler Heart Rate', 'Obstetric Ultrasound', 'Urine Albumin'];
    entities.anatomicalSystem = 'Obstetric';
    entities.severityKeywords.push('Moderate');
  } else {
    urgency = 'GREEN';
    department = 'General Medicine';
    predictedCondition = 'Mild Functional Dyspepsia / Self-limiting Viral Malaise';
    recommendedAction = 'TREAT LOCALLY: Home hydration with ORS, rest, light bland diet, and symptom diary.';
    urgencyReason = 'Non-critical mild symptoms without red-flag indicators; safe for community-level management.';
    investigations = ['Hydration monitoring', 'Dietary modification'];
    entities.anatomicalSystem = 'Gastrointestinal / Constitutional';
    entities.severityKeywords.push('Mild');
    entities.symptoms.push('Mild stomach acidity / bloating', 'Mild fatigue');
  }

  // 3. Prescription & Confidence Integration
  let confidence = 94;
  let needsDoctorVerification = false;

  if (selectedRx) {
    confidence = selectedRx.confidence;
    needsDoctorVerification = selectedRx.needsDoctorVerification;
    if (selectedRx.id === 'rx-messy') {
      confidence = 48;
      needsDoctorVerification = true;
      predictedCondition += ' [⚠️ Handwriting Unclear]';
    }
  }

  // 4. Drug-Symptom Cross-Check
  const safetyAlerts = checkDrugInteractions(text, appState.patientProfile.activeMedications);
  if (safetyAlerts.length > 0 && safetyAlerts.some(a => a.severity === 'CRITICAL')) {
    urgency = 'RED';
    urgencyReason = 'CRITICAL PHARMACOLOGICAL RISK: ' + safetyAlerts[0].title;
  }

  // Update working object
  currentTriage = {
    rawTranscript: text,
    selectedLanguage: langKey,
    extractedEntities: entities,
    prescriptionData: selectedRx || currentTriage.prescriptionData,
    severity: urgency,
    urgencyReason: urgencyReason,
    predictedCondition: predictedCondition,
    recommendedAction: recommendedAction,
    reasoning: `AI Triage based on patient input, ${appState.patientProfile.age}yo male with past medical history (${appState.patientProfile.chronicConditions.join(', ')}). Cross-referenced with active medications.`,
    department: department,
    suggestedInvestigations: investigations,
    confidence: confidence,
    needsDoctorVerification: needsDoctorVerification,
    drugInteractionAlert: safetyAlerts.length > 0 ? safetyAlerts[0] : null,
    doctorReviewStatus: 'Pending',
    reviewedBy: null
  };

  return currentTriage;
}

// ============================================================================
// 6. Speech Recognition & Text-to-Speech (Multilingual)
// ============================================================================

let speechRecognizer = null;
let isRecording = false;

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('SpeechRecognition API not natively supported in this browser.');
    return null;
  }

  const recognizer = new SpeechRecognition();
  recognizer.continuous = false;
  recognizer.interimResults = true;

  recognizer.onstart = () => {
    isRecording = true;
    updateMicUI(true);
    showToast('Listening... Speak your symptoms now', 'info');
  };

  recognizer.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    const transcriptInput = document.getElementById('voiceTranscriptInput');
    if (transcriptInput) {
      transcriptInput.value = transcript;
    }
  };

  recognizer.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isRecording = false;
    updateMicUI(false);
    showToast('Microphone error: ' + event.error + '. Try using preset voice phrases.', 'warning');
  };

  recognizer.onend = () => {
    isRecording = false;
    updateMicUI(false);
    const transcriptInput = document.getElementById('voiceTranscriptInput');
    if (transcriptInput && transcriptInput.value.trim()) {
      handleTriageAnalysis(transcriptInput.value.trim());
    }
  };

  return recognizer;
}

function updateMicUI(recording) {
  const micBtn = document.getElementById('micButton');
  const soundwave = document.getElementById('voiceSoundwave');
  const recordStatus = document.getElementById('recordStatusText');
  const recorderBox = document.getElementById('voiceRecorderBox');

  if (micBtn) {
    if (recording) {
      micBtn.classList.add('recording');
      micBtn.innerHTML = '⏹';
    } else {
      micBtn.classList.remove('recording');
      micBtn.innerHTML = '🎙';
    }
  }

  if (soundwave) {
    if (recording) {
      soundwave.classList.add('active');
    } else {
      soundwave.classList.remove('active');
    }
  }

  if (recorderBox) {
    if (recording) {
      recorderBox.classList.add('recording');
    } else {
      recorderBox.classList.remove('recording');
    }
  }

  if (recordStatus) {
    recordStatus.innerText = recording
      ? 'Listening... Recording in ' + (LOCALIZED_PRESETS[appState.selectedLang]?.langName || 'English')
      : 'Click microphone to start voice intake in ' + (LOCALIZED_PRESETS[appState.selectedLang]?.langName || 'English');
  }
}

function toggleVoiceRecording() {
  if (!speechRecognizer) {
    speechRecognizer = initSpeechRecognition();
  }

  if (!speechRecognizer) {
    showToast('Speech Recognition not supported in this browser. Please use the quick preset phrases below or type your symptoms.', 'warning');
    return;
  }

  if (isRecording) {
    speechRecognizer.stop();
  } else {
    const langCode = LOCALIZED_PRESETS[appState.selectedLang]?.langCode || 'en-US';
    speechRecognizer.lang = langCode;
    try {
      speechRecognizer.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      showToast('Microphone permission needed. Use preset buttons below to test instantly.', 'warning');
    }
  }
}

// Text-to-Speech: Voice-Out in local language
let currentUtterance = null;
let isSpeaking = false;

function playTtsVoiceOut() {
  if (!window.speechSynthesis) {
    showToast('Text-to-speech not supported in this browser.', 'warning');
    return;
  }

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    updateTtsButton(false);
    return;
  }

  const langKey = appState.selectedLang || 'en';
  const langPreset = LOCALIZED_PRESETS[langKey] || LOCALIZED_PRESETS.en;
  const severityKey = currentTriage.severity.toLowerCase();
  const textToSpeak = langPreset.tts[severityKey] || langPreset.tts.yellow;

  window.speechSynthesis.cancel();
  currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
  currentUtterance.lang = langPreset.langCode;
  currentUtterance.rate = 0.9; // Slightly slower pace for clarity in rural health context

  currentUtterance.onstart = () => {
    isSpeaking = true;
    updateTtsButton(true);
    showToast('🔊 Playing spoken medical instructions in ' + langPreset.langName, 'info');
  };

  currentUtterance.onend = () => {
    isSpeaking = false;
    updateTtsButton(false);
  };

  currentUtterance.onerror = (e) => {
    console.error('Speech synthesis error:', e);
    isSpeaking = false;
    updateTtsButton(false);
  };

  window.speechSynthesis.speak(currentUtterance);
}

function updateTtsButton(speaking) {
  const ttsBtn = document.getElementById('playTtsBtn');
  if (ttsBtn) {
    if (speaking) {
      ttsBtn.innerHTML = `<span>⏹ Stop Voice-Out</span>`;
      ttsBtn.classList.add('btn-danger');
      ttsBtn.classList.remove('btn-secondary');
    } else {
      const langName = LOCALIZED_PRESETS[appState.selectedLang]?.langName.split(' ')[0] || 'English';
      ttsBtn.innerHTML = `<span>🔊 Listen in ${langName} (Voice-Out)</span>`;
      ttsBtn.classList.remove('btn-danger');
      ttsBtn.classList.add('btn-secondary');
    }
  }
}

// ============================================================================
// 7. UI Rendering Functions
// ============================================================================

function switchRole(newRole) {
  appState.currentRole = newRole;
  saveState();

  const patientRoleBtn = document.getElementById('rolePatientBtn');
  const doctorRoleBtn = document.getElementById('roleDoctorBtn');
  const patientNavTabs = document.getElementById('patientNavTabs');
  const doctorNavTabs = document.getElementById('doctorNavTabs');

  if (newRole === 'patient') {
    patientRoleBtn.classList.add('active');
    doctorRoleBtn.classList.remove('active');
    patientNavTabs.style.display = 'flex';
    doctorNavTabs.style.display = 'none';
    switchTab('tabTriage');
    showToast('Switched to Patient & ASHA Health Worker Mode', 'info');
  } else {
    patientRoleBtn.classList.remove('active');
    doctorRoleBtn.classList.add('active');
    patientNavTabs.style.display = 'none';
    doctorNavTabs.style.display = 'flex';
    switchTab('tabDoctorDashboard');
    showToast('Switched to Doctor Mode: Dr. Rajesh Verma (Cardiologist)', 'info');
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab-btn').forEach(el => el.classList.remove('active'));

  const targetPane = document.getElementById(tabId);
  const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);

  if (targetPane) targetPane.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  // Trigger relevant renders
  if (tabId === 'tabTriage') renderTriageView();
  if (tabId === 'tabHistory') renderPatientHistory();
  if (tabId === 'tabDoctors') renderDoctorDirectory();
  if (tabId === 'tabCommunity') renderCommunityFeed();
  if (tabId === 'tabDoctorDashboard') renderDoctorDashboard();
  if (tabId === 'tabCmeTracker') renderCmeTracker();
}

function setLanguage(langKey) {
  appState.selectedLang = langKey;
  saveState();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === langKey);
  });

  renderPresetChips();
  updateMicUI(isRecording);

  // Update TTS button label
  const langName = LOCALIZED_PRESETS[langKey]?.langName.split(' ')[0] || 'English';
  const ttsBtn = document.getElementById('playTtsBtn');
  if (ttsBtn && !isSpeaking) {
    ttsBtn.innerHTML = `<span>🔊 Listen in ${langName} (Voice-Out)</span>`;
  }

  showToast(`Language set to ${LOCALIZED_PRESETS[langKey]?.langName}`, 'info');
}

function renderPresetChips() {
  const container = document.getElementById('presetChipsContainer');
  if (!container) return;

  const presets = LOCALIZED_PRESETS[appState.selectedLang]?.presets || LOCALIZED_PRESETS.en.presets;
  container.innerHTML = presets.map((p, idx) => `
    <button class="preset-chip" onclick="applyPresetPhrase(${idx})" title="${p.text}">
      <strong>${p.title}</strong>
    </button>
  `).join('');
}

function applyPresetPhrase(presetIndex) {
  const presets = LOCALIZED_PRESETS[appState.selectedLang]?.presets || LOCALIZED_PRESETS.en.presets;
  const p = presets[presetIndex];
  if (!p) return;

  const input = document.getElementById('voiceTranscriptInput');
  if (input) input.value = p.text;

  handleTriageAnalysis(p.text);
  showToast(`Loaded clinical scenario: "${p.title}"`, 'success');
}

function handleTriageAnalysis(text) {
  const rx = currentTriage.prescriptionData || SAMPLE_PRESCRIPTIONS.sample1;
  const triageResult = analyzeAndTriage(text, appState.selectedLang, rx);
  renderActionCard(triageResult);
}

function selectPrescriptionSample(sampleKey) {
  const sample = SAMPLE_PRESCRIPTIONS[sampleKey];
  if (!sample) return;

  document.querySelectorAll('.sample-photo-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sample === sampleKey);
  });

  const previewBox = document.getElementById('prescriptionPreviewBox');
  if (previewBox) {
    previewBox.innerHTML = `
      <img src="${sample.svgThumbnail}" class="preview-thumb" alt="Rx Preview" />
      <div style="flex: 1; font-size: 0.8rem;">
        <div style="font-weight: 700; color: var(--text-main);">${sample.name}</div>
        <div style="color: var(--text-muted); font-size: 0.72rem;">Facility: ${sample.facility} | Prescriber: ${sample.doctor}</div>
        <div style="margin-top: 0.2rem;">
          <span class="badge ${sample.needsDoctorVerification ? 'badge-warning' : 'badge-verified'}">
            ${sample.needsDoctorVerification ? '⚠️ Low Confidence (48%) - Needs Doctor Check' : '✓ Gemini Vision OCR Extracted (94%)'}
          </span>
        </div>
      </div>
    `;
  }

  currentTriage.prescriptionData = sample;
  const transcript = document.getElementById('voiceTranscriptInput')?.value || currentTriage.rawTranscript;
  analyzeAndTriage(transcript, appState.selectedLang, sample);
  renderActionCard(currentTriage);
  showToast(`Loaded: ${sample.name}`, 'info');
}

function handleCustomPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const customRx = {
      id: 'rx-uploaded',
      name: `Uploaded Record: ${file.name}`,
      doctor: 'Dr. Rural Medical Officer',
      regNo: 'NMC-EXT-2026',
      facility: 'Uploaded Clinic Record',
      date: new Date().toLocaleDateString(),
      diagnosis: 'Clinical extraction from uploaded photo',
      confidence: 88,
      needsDoctorVerification: false,
      medicines: [
        { name: 'Tab Metformin', dose: '500mg', freq: '1 BD', duration: '30 days' },
        { name: 'Tab Aspirin', dose: '75mg', freq: '1 OD', duration: '30 days' },
        { name: 'Cap Omeprazole', dose: '20mg', freq: '1 OD', duration: '14 days' }
      ],
      clinicalNotes: 'Extracted via simulated Gemini 2.0 Flash Vision OCR pipeline.',
      svgThumbnail: e.target.result
    };

    const previewBox = document.getElementById('prescriptionPreviewBox');
    if (previewBox) {
      previewBox.innerHTML = `
        <img src="${e.target.result}" class="preview-thumb" alt="Uploaded Document" />
        <div style="flex: 1; font-size: 0.8rem;">
          <div style="font-weight: 700; color: var(--text-main);">📸 ${file.name}</div>
          <div style="color: var(--text-muted); font-size: 0.72rem;">Gemini Vision OCR: Extracted 3 Medicines, 1 Diagnosis</div>
          <div style="margin-top: 0.2rem;">
            <span class="badge badge-verified">✓ Gemini Vision Processed (88% Confidence)</span>
          </div>
        </div>
      `;
    }

    currentTriage.prescriptionData = customRx;
    const transcript = document.getElementById('voiceTranscriptInput')?.value || currentTriage.rawTranscript;
    analyzeAndTriage(transcript, appState.selectedLang, customRx);
    renderActionCard(currentTriage);
    showToast('Prescription image processed via Gemini Vision OCR', 'success');
  };
  reader.readAsDataURL(file);
}

// Render Structured Action Card (Feature 4 & 12)
function renderActionCard(triage) {
  const container = document.getElementById('actionCardContainer');
  if (!container) return;

  const sev = triage.severity.toLowerCase(); // green | yellow | red
  const sevClass = `severity-${sev}`;
  const bannerClass = sev;

  const sevLabel = {
    red: '🚨 RED: CRITICAL EMERGENCY (Immediate Referral Required)',
    yellow: '⚠️ YELLOW: MODERATE URGENCY (Observe & Visit Clinic in 24-48h)',
    green: '✅ GREEN: MILD / NON-URGENT (Home Management & Community Care)'
  }[sev];

  // Matched Doctor for auto-routing
  const matchedDoc = appState.availableDoctors.find(d => d.dept === triage.department) || appState.availableDoctors[0];

  container.className = `action-card ${sevClass}`;
  container.innerHTML = `
    <!-- Urgency Classification Banner -->
    <div class="urgency-banner ${bannerClass}">
      <div>${sevLabel}</div>
      <span class="badge badge-department">Dept: ${triage.department}</span>
    </div>

    <!-- Drug Interaction Safety Alert if present -->
    ${triage.drugInteractionAlert ? `
      <div class="safety-alert-banner">
        <div class="safety-alert-icon">⚠️</div>
        <div>
          <div class="safety-alert-title">${triage.drugInteractionAlert.title}</div>
          <div class="safety-alert-desc">${triage.drugInteractionAlert.description}</div>
        </div>
      </div>
    ` : ''}

    <!-- Confidence Flag if low -->
    ${triage.needsDoctorVerification ? `
      <div class="confidence-flag">
        <span>⚠️</span>
        <div><strong>Low AI Confidence (${triage.confidence}%)</strong> — Messy handwriting detected. Flagged as <em>Needs Doctor Verification</em> before final medical disposition.</div>
      </div>
    ` : ''}

    <!-- Primary Clinical Fields -->
    <div class="card-detail-item">
      <div class="card-detail-label">Predicted Medical Condition</div>
      <div class="card-detail-val" style="font-size: 1.1rem; color: var(--primary-dark); font-weight: 700;">
        ${triage.predictedCondition}
      </div>
    </div>

    <div class="card-detail-item">
      <div class="card-detail-label">Recommended Action (Next Steps)</div>
      <div class="card-detail-val" style="font-weight: 600; color: ${sev === 'red' ? 'var(--danger)' : 'var(--text-main)'};">
        ${triage.recommendedAction}
      </div>
    </div>

    <div class="card-detail-item">
      <div class="card-detail-label">One-Line Urgency Reason</div>
      <div class="card-detail-val" style="font-style: italic; color: var(--text-muted);">
        "${triage.urgencyReason}"
      </div>
    </div>

    <!-- Extracted Entities Tags -->
    <div class="card-detail-item">
      <div class="card-detail-label">Extracted Symptom Entities</div>
      <div class="entity-tags">
        ${triage.extractedEntities.symptoms.map(s => `<span class="entity-tag symptom">🩺 ${s}</span>`).join('')}
        ${triage.extractedEntities.duration ? `<span class="entity-tag duration">⏱ Duration: ${triage.extractedEntities.duration}</span>` : ''}
        ${triage.extractedEntities.severityKeywords.map(k => `<span class="entity-tag severity">⚡ ${k}</span>`).join('')}
        <span class="entity-tag medicine">💊 Rx: ${triage.prescriptionData.medicines.map(m => m.name).join(', ')}</span>
      </div>
    </div>

    <div class="card-detail-item">
      <div class="card-detail-label">Suggested Diagnostic Investigations</div>
      <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
        ${triage.suggestedInvestigations.map(inv => `<li>${inv}</li>`).join('')}
      </ul>
    </div>

    <!-- Doctor Routing Card -->
    <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.85rem; margin-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-size: 0.72rem; color: var(--text-light); text-transform: uppercase; font-weight: 700;">AI Matched On-Duty Specialist</div>
        <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-main);">${matchedDoc.name} <span class="badge badge-verified">✓ Verified ${matchedDoc.nmcId}</span></div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${matchedDoc.degrees} • ${matchedDoc.hospital}</div>
      </div>
      <button class="btn btn-secondary" onclick="openDoctorChat('${matchedDoc.id}')" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">
        💬 Chat
      </button>
    </div>

    <!-- Emergency Action Button for RED Urgency -->
    ${sev === 'red' ? `
      <div style="margin-top: 1.25rem;">
        <button class="btn btn-emergency btn-full" onclick="openEmergencySosModal()">
          🚨 CONNECT TO LIVE EMERGENCY DOCTOR NOW (AUTO-ROUTED)
        </button>
      </div>
    ` : ''}

    <!-- Action Toolbar (JSON toggle, TTS, Save to Health History) -->
    <div style="display: flex; gap: 0.5rem; margin-top: 1.25rem; flex-wrap: wrap;">
      <button id="playTtsBtn" class="btn btn-secondary" onclick="playTtsVoiceOut()" style="flex: 1;">
        🔊 Listen in ${LOCALIZED_PRESETS[appState.selectedLang]?.langName.split(' ')[0] || 'English'} (Voice-Out)
      </button>
      <button class="btn btn-secondary" onclick="openJsonModal()">
        { } View JSON Card
      </button>
      <button class="btn btn-primary" onclick="saveTriageToPatientHistory()">
        + Save to Health History
      </button>
    </div>
  `;
}

function renderTriageView() {
  renderPresetChips();
  const input = document.getElementById('voiceTranscriptInput');
  if (input && !input.value) {
    // Default to the first preset scenario
    applyPresetPhrase(0);
  } else {
    renderActionCard(currentTriage);
  }
}

// ============================================================================
// 8. Patient History & Timeline Rendering (Feature 7)
// ============================================================================

function renderPatientHistory() {
  const profile = appState.patientProfile;
  const profileContainer = document.getElementById('patientProfileBox');
  const timelineContainer = document.getElementById('patientTimelineBox');

  if (profileContainer) {
    profileContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div>
          <div class="card-detail-label">Patient Name & Age</div>
          <div style="font-weight: 700; font-size: 1.05rem;">${profile.name} (${profile.age}/${profile.gender})</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">ABHA ID: <span style="font-family: monospace; font-weight: 600;">${profile.abhaId}</span></div>
        </div>
        <div>
          <div class="card-detail-label">Location & Blood Group</div>
          <div style="font-size: 0.9rem;">📍 ${profile.village}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Blood Group: <strong style="color: var(--danger);">${profile.bloodGroup}</strong></div>
        </div>
        <div>
          <div class="card-detail-label">Documented Chronic Conditions</div>
          <div style="display: flex; gap: 0.3rem; flex-wrap: wrap; margin-top: 0.2rem;">
            ${profile.chronicConditions.map(c => `<span class="badge badge-warning">${c}</span>`).join('')}
          </div>
        </div>
      </div>

      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
        <div class="card-detail-label">Active Medications (Cross-Checked in Real-time)</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.5rem; margin-top: 0.4rem;">
          ${profile.activeMedications.map(m => `
            <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.5rem; font-size: 0.8rem;">
              <strong style="color: var(--primary-dark);">${m.name} ${m.dose}</strong>
              <div style="color: var(--text-muted); font-size: 0.72rem;">${m.purpose}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (timelineContainer) {
    timelineContainer.innerHTML = `
      <div class="timeline">
        ${appState.patientTimeline.map(item => `
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-date">🗓 ${item.date} • ${item.facility}</div>
              <div class="timeline-title">${item.complaint}</div>
              <div style="font-size: 0.85rem; color: #334155; margin-top: 0.3rem;">
                <strong>Prescription:</strong> ${item.prescription}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                Clinician: ${item.doctor} | Outcome: ${item.outcome}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

function saveTriageToPatientHistory() {
  const newVisit = {
    id: 'vis-' + Date.now(),
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    facility: `Health-Bridge Tele-Triage (${currentTriage.department})`,
    complaint: `${currentTriage.predictedCondition} - Severity: ${currentTriage.severity}`,
    doctor: `AI Triage reviewed by ${appState.doctorProfile.name}`,
    prescription: currentTriage.recommendedAction,
    outcome: 'Action card generated and linked to ABHA record'
  };

  appState.patientTimeline.unshift(newVisit);
  saveState();
  showToast('✓ Triage encounter saved to permanent Patient Health Timeline!', 'success');
}

function openAddPastVisitModal() {
  const facility = prompt('Enter Hospital / PHC Name:', 'Taluk Govt Hospital, Mandya');
  if (!facility) return;
  const complaint = prompt('Enter Chief Complaint / Diagnosis:', 'Follow-up for Hypertension & Blood Sugar');
  if (!complaint) return;
  const rx = prompt('Enter Prescribed Medicines:', 'Tab Metformin 500mg, Tab Amlodipine 5mg');

  const manualVisit = {
    id: 'vis-' + Date.now(),
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    facility: facility,
    complaint: complaint,
    doctor: 'Dr. Consulting Physician',
    prescription: rx || 'None recorded',
    outcome: 'Manually logged by ASHA Health Worker'
  };

  appState.patientTimeline.unshift(manualVisit);
  saveState();
  renderPatientHistory();
  showToast('Added past visit record to patient timeline', 'success');
}

// ============================================================================
// 9. Doctor Profiles & Verification Directory (Feature 8 & 16)
// ============================================================================

function renderDoctorDirectory() {
  const container = document.getElementById('doctorDirectoryContainer');
  if (!container) return;

  container.innerHTML = appState.availableDoctors.map(doc => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem;">
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div class="avatar doctor" style="width: 48px; height: 48px; font-size: 1.1rem;">${doc.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main);">${doc.name}</h3>
              <div style="font-size: 0.8rem; color: var(--accent); font-weight: 600;">${doc.degrees}</div>
            </div>
          </div>
          <span class="badge badge-verified">✓ Verified NMC</span>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.85rem;">
          <div>🏥 <strong>Hospital:</strong> ${doc.hospital}</div>
          <div>🩺 <strong>Specialty:</strong> <span class="badge badge-department">${doc.dept}</span></div>
          <div>🆔 <strong>Registration:</strong> <code style="color: #0f766e; font-weight: 600;">${doc.nmcId}</code></div>
          <div>⏱ <strong>Response Time:</strong> ${doc.response} | Experience: ${doc.experience}</div>
        </div>
      </div>

      <div style="display: flex; gap: 0.5rem; border-top: 1px solid #f1f5f9; padding-top: 0.75rem;">
        <button class="btn btn-secondary" onclick="openDoctorPublicProfile('${doc.id}')" style="flex: 1; font-size: 0.8rem;">
          View Impact Stats
        </button>
        <button class="btn btn-primary" onclick="openDoctorChat('${doc.id}')" style="flex: 1; font-size: 0.8rem;">
          💬 Message
        </button>
      </div>
    </div>
  `).join('');
}

function openDoctorPublicProfile(docId) {
  const doc = appState.availableDoctors.find(d => d.id === docId) || appState.availableDoctors[0];
  const modal = document.getElementById('doctorProfileModal');
  const body = document.getElementById('doctorProfileModalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <div class="avatar doctor" style="width: 72px; height: 72px; font-size: 1.75rem; margin: 0 auto 0.75rem;">${doc.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
      <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main);">${doc.name}</h2>
      <div style="color: var(--accent); font-weight: 600; font-size: 0.9rem;">${doc.degrees}</div>
      <div style="margin-top: 0.35rem;">
        <span class="badge badge-verified" style="font-size: 0.8rem;">
          🛡️ NMC Verified License: ${doc.nmcId} (National Medical Commission)
        </span>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
        ${doc.hospital} • ${doc.dept}
      </div>
    </div>

    <!-- Verified Real Impact Stats (Feature 16) -->
    <div class="impact-stats-grid">
      <div class="stat-box">
        <div class="stat-box-number">428</div>
        <div class="stat-box-label">Rural Patients Helped</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-number" style="color: var(--danger);">39</div>
        <div class="stat-box-label">Red Referrals Resolved</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-number" style="color: var(--accent);">4.2m</div>
        <div class="stat-box-label">Avg Tele-Response</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-number" style="color: var(--success);">98.4%</div>
        <div class="stat-box-label">Diagnostic Agreement</div>
      </div>
    </div>

    <!-- Verification Bio & CME Status -->
    <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem; font-size: 0.85rem; line-height: 1.6;">
      <strong>Clinical Bio & Public Accreditation:</strong><br>
      Senior Consultant in ${doc.dept} with over ${doc.experience} of clinical practice. Leading volunteer for state rural tele-triage connecting Primary Health Centres across Karnataka and Tamil Nadu with tertiary cardiac/critical infrastructure.
    </div>

    <div class="cme-cert">
      <h2>National Medical Commission (India)</h2>
      <div style="font-size: 0.85rem; color: #475569; margin-bottom: 0.75rem;">State Medical Council Tele-Health CME Certificate of Recognition</div>
      <p style="font-size: 0.9rem; font-style: italic;">
        This certifies that <strong>${doc.name}</strong> (${doc.nmcId}) has completed <strong>24.5 Credit Hours</strong> of verified Rural Tele-Triage Clinical Consultations toward mandatory 5-year medical license renewal.
      </p>
      <div style="margin-top: 1rem; display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b;">
        <div>Issue Date: Sept 2026</div>
        <div>Registrar, State Medical Council</div>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

// ============================================================================
// 10. Doctor Review Dashboard (Feature 11, 15 - CME Tracker)
// ============================================================================

function renderDoctorDashboard() {
  const casesContainer = document.getElementById('doctorCasesQueue');
  const activeCaseDetail = document.getElementById('activeCaseDetailBox');
  const cmeMiniProgress = document.getElementById('cmeMiniProgressFill');
  const cmeMiniText = document.getElementById('cmeMiniProgressText');

  // Update CME bar in Doctor view
  const doc = appState.doctorProfile;
  const pct = Math.min(100, Math.round((doc.cmeCredits / doc.cmeTarget) * 100));
  if (cmeMiniProgress) cmeMiniProgress.style.width = `${pct}%`;
  if (cmeMiniText) cmeMiniText.innerText = `${doc.cmeCredits} / ${doc.cmeTarget} Credits (${pct}%)`;

  if (!casesContainer) return;

  casesContainer.innerHTML = appState.assignedCases.map((c, idx) => `
    <div class="case-queue-card ${idx === 0 ? 'active' : ''}" onclick="selectDoctorCase('${c.id}')" data-case="${c.id}">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
        <strong style="font-size: 0.9rem;">${c.patientName}</strong>
        <span class="badge ${c.severity === 'RED' ? 'badge-red' : (c.severity === 'YELLOW' ? 'badge-yellow' : 'badge-green')}">
          ${c.severity}
        </span>
      </div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.4rem;">
        Case: <code>${c.id}</code> • ${c.time} • Dept: ${c.department}
      </div>
      <div style="font-size: 0.8rem; color: #334155; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        ${c.symptoms}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.72rem;">
        <span class="badge ${c.status === 'Approved' ? 'badge-verified' : 'badge-department'}">
          Status: ${c.status}
        </span>
        ${c.needsDoctorVerification ? '<span style="color: var(--warning); font-weight: 700;">⚠️ Needs Verification</span>' : '<span style="color: var(--success);">✓ High Confidence</span>'}
      </div>
    </div>
  `).join('');

  // Default display first case
  if (appState.assignedCases.length > 0) {
    displayCaseDetail(appState.assignedCases[0]);
  }
}

function selectDoctorCase(caseId) {
  document.querySelectorAll('.case-queue-card').forEach(el => {
    el.classList.toggle('active', el.dataset.case === caseId);
  });
  const c = appState.assignedCases.find(item => item.id === caseId);
  if (c) displayCaseDetail(c);
}

function displayCaseDetail(c) {
  const detailContainer = document.getElementById('activeCaseDetailBox');
  if (!detailContainer) return;

  detailContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
      <div>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--text-main);">${c.patientName}</h3>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Case Reference: <strong>${c.id}</strong> • Assigned to: ${c.department}</div>
      </div>
      <span class="badge ${c.severity === 'RED' ? 'badge-red' : (c.severity === 'YELLOW' ? 'badge-yellow' : 'badge-green')}" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">
        ${c.severity} URGENCY
      </span>
    </div>

    <!-- Confidence Flag -->
    ${c.needsDoctorVerification ? `
      <div class="confidence-flag">
        <span>⚠️</span>
        <div><strong>Low AI Confidence (${c.confidence}%)</strong>: Degraded handwriting / ambiguous symptoms. Mandatory clinical review required before sign-off.</div>
      </div>
    ` : `
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem;">
        ✓ High AI Confidence (${c.confidence}%) — AI Structured Action Card ready for approval.
      </div>
    `}

    <div class="card-detail-item">
      <div class="card-detail-label">Reported Symptoms (Voice/Text Intake)</div>
      <div class="card-detail-val" style="background: #f8fafc; padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
        ${c.symptoms}
      </div>
    </div>

    <div class="card-detail-item">
      <div class="card-detail-label">Prescription / Lab Reader Summary</div>
      <div class="card-detail-val" style="font-size: 0.85rem; color: #334155;">
        ${c.prescriptionSummary}
      </div>
    </div>

    <div class="card-detail-item">
      <div class="card-detail-label">AI Proposed Clinical Action Card</div>
      <div style="border: 1px solid #cbd5e1; border-radius: var(--radius-md); padding: 0.85rem; background: #ffffff;">
        <div style="font-weight: 700; color: var(--primary-dark);">${c.aiCondition}</div>
        <div style="font-size: 0.85rem; color: #475569; margin-top: 0.25rem;">${c.aiAction}</div>
      </div>
    </div>

    <!-- Doctor Decision Form -->
    <div style="margin-top: 1.25rem; background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem;">
      <div class="card-detail-label">Doctor Clinical Actions & CME Sign-Off</div>
      <textarea id="doctorNotesInput" class="textarea-styled" style="min-height: 60px; margin-bottom: 0.75rem;" placeholder="Add doctor instructions, adjusted doses, or override justification...">${c.doctorNotes || ''}</textarea>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn btn-success" onclick="doctorActionCase('${c.id}', 'Approve')" style="flex: 1;">
          ✓ Approve AI Decision (+0.5 CME Credit)
        </button>
        <button class="btn btn-secondary" onclick="doctorActionCase('${c.id}', 'Edit')" style="flex: 1;">
          ✏️ Edit Diagnosis / Rx
        </button>
        <button class="btn btn-danger" onclick="doctorActionCase('${c.id}', 'Override')" style="flex: 1;">
          ⚡ Override Urgency (+1.0 CME Credit)
        </button>
      </div>
    </div>
  `;
}

function doctorActionCase(caseId, actionType) {
  const c = appState.assignedCases.find(item => item.id === caseId);
  if (!c) return;

  const notes = document.getElementById('doctorNotesInput')?.value || '';
  c.doctorNotes = notes;

  let creditsEarned = 0.5;

  if (actionType === 'Approve') {
    c.status = 'Approved';
    c.needsDoctorVerification = false;
    creditsEarned = 0.5;
  } else if (actionType === 'Edit') {
    c.status = 'Edited by Doctor';
    const newCondition = prompt('Edit Condition Diagnosis:', c.aiCondition);
    if (newCondition) c.aiCondition = newCondition;
    creditsEarned = 0.5;
  } else if (actionType === 'Override') {
    c.status = 'Overridden by Doctor';
    const newSeverity = prompt('Enter new urgency classification (GREEN / YELLOW / RED):', c.severity === 'RED' ? 'YELLOW' : 'RED');
    if (newSeverity && ['GREEN', 'YELLOW', 'RED'].includes(newSeverity.toUpperCase())) {
      c.severity = newSeverity.toUpperCase();
    }
    creditsEarned = 1.0;
  }

  // Update CME credits (Feature 15)
  appState.doctorProfile.cmeCredits = parseFloat((appState.doctorProfile.cmeCredits + creditsEarned).toFixed(1));
  appState.doctorProfile.patientsHelped += 1;
  if (c.severity === 'RED') {
    appState.doctorProfile.emergencyResolved += 1;
  }

  appState.doctorProfile.cmeHistory.unshift({
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    caseId: c.id,
    action: `${actionType} on Case (${c.patientName})`,
    credits: `+${creditsEarned}`
  });

  saveState();
  renderDoctorDashboard();

  showToast(`🎉 Case ${actionType}d! You earned +${creditsEarned} CME Credits toward Indian Medical License renewal.`, 'success');
}

// ============================================================================
// 11. CME Credit Tracker View (Feature 15)
// ============================================================================

function renderCmeTracker() {
  const container = document.getElementById('cmeTrackerContainer');
  if (!container) return;

  const doc = appState.doctorProfile;
  const pct = Math.min(100, Math.round((doc.cmeCredits / doc.cmeTarget) * 100));

  container.innerHTML = `
    <!-- Top CME Overview Card -->
    <div class="cme-card">
      <div class="cme-header">
        <div>
          <div class="cme-title">Continuing Medical Education (CME) Credit Tracker</div>
          <div style="font-size: 0.8rem; color: #a7f3d0; margin-top: 0.2rem;">
            Mandatory Requirement: 30 Credit Hours per 5-Year Cycle (Medical Council of India / NMC Guidelines)
          </div>
        </div>
        <span class="badge badge-verified" style="background: rgba(255,255,255,0.15); color: #ffffff; border-color: #34d399;">
          Cycle Active: Exp 2026
        </span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 0.9rem;">
        <span>Progress Toward 5-Year License Renewal</span>
        <span style="font-size: 1.25rem; font-weight: 800; color: #34d399;">${doc.cmeCredits} / ${doc.cmeTarget} Credits (${pct}%)</span>
      </div>

      <div class="cme-progress-track">
        <div class="cme-progress-fill" style="width: ${pct}%;"></div>
      </div>

      <div class="cme-stats-grid">
        <div>
          <div class="cme-stat-val">+0.5</div>
          <div class="cme-stat-lbl">Credits Per Triage Case</div>
        </div>
        <div>
          <div class="cme-stat-val">+1.0</div>
          <div class="cme-stat-lbl">Credits Per Red Override</div>
        </div>
        <div>
          <div class="cme-stat-val">${(doc.cmeTarget - doc.cmeCredits).toFixed(1)}</div>
          <div class="cme-stat-lbl">Credits Remaining to Renew</div>
        </div>
      </div>
    </div>

    <!-- Real Activity & Impact Statistics (Feature 16) -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Verified Clinician Activity & Real-World Impact</div>
          <div class="card-subtitle">Publicly visible clinical audit metrics building patient trust and community visibility</div>
        </div>
        <button class="btn btn-secondary" onclick="openDoctorPublicProfile('doc-1')" style="font-size: 0.8rem;">
          View Public Profile Card
        </button>
      </div>

      <div class="impact-stats-grid">
        <div class="stat-box">
          <div class="stat-box-number">${doc.patientsHelped}</div>
          <div class="stat-box-label">Rural Patients Helped</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-number" style="color: var(--danger);">${doc.emergencyResolved}</div>
          <div class="stat-box-label">Emergency Red Cases</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-number" style="color: var(--accent);">${doc.avgResponseTime}</div>
          <div class="stat-box-label">Avg Review Latency</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-number" style="color: var(--success);">${doc.diagnosticAgreement}</div>
          <div class="stat-box-label">Diagnostic Agreement</div>
        </div>
      </div>
    </div>

    <!-- Timestamped CME Activity Log -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">📜 Verified CME Activity Log (Timestamped for State Medical Council Audit)</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
        <thead>
          <tr style="border-bottom: 2px solid var(--border); text-align: left; color: var(--text-light);">
            <th style="padding: 0.6rem;">Date</th>
            <th style="padding: 0.6rem;">Case Reference</th>
            <th style="padding: 0.6rem;">Clinical Action</th>
            <th style="padding: 0.6rem; text-align: right;">CME Earned</th>
          </tr>
        </thead>
        <tbody>
          ${doc.cmeHistory.map(h => `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.6rem; color: var(--text-muted);">${h.date}</td>
              <td style="padding: 0.6rem;"><code>${h.caseId}</code></td>
              <td style="padding: 0.6rem; font-weight: 500;">${h.action}</td>
              <td style="padding: 0.6rem; text-align: right; font-weight: 700; color: var(--success);">${h.credits} Credits</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ============================================================================
// 12. Community & Department Feed (Feature 14)
// ============================================================================

let activeFeedDepartment = 'All';

function renderCommunityFeed() {
  const container = document.getElementById('communityFeedContainer');
  if (!container) return;

  const filteredPosts = activeFeedDepartment === 'All'
    ? appState.communityFeed
    : appState.communityFeed.filter(p => p.dept === activeFeedDepartment);

  container.innerHTML = filteredPosts.map(post => `
    <div class="feed-post">
      <div class="feed-author">
        <div class="avatar ${post.role === 'doctor' ? 'doctor' : ''}">${post.avatar}</div>
        <div>
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
            ${post.author}
            ${post.role === 'doctor' ? '<span class="badge badge-verified">✓ Verified Doctor</span>' : '<span class="badge badge-department">Patient / Community</span>'}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">
            Dept: <strong>${post.dept}</strong> • ${post.time}
          </div>
        </div>
      </div>

      <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">${post.title}</h4>
      <div class="feed-body">${post.content}</div>

      <!-- Comments / Replies -->
      ${post.comments.length > 0 ? `
        <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 0.75rem; margin-bottom: 0.75rem;">
          ${post.comments.map(c => `
            <div style="font-size: 0.8rem; margin-bottom: 0.4rem; padding-bottom: 0.4rem; border-bottom: 1px solid #e2e8f0;">
              <strong>${c.author}</strong> ${c.verified ? '<span class="badge badge-verified" style="font-size: 0.65rem;">✓ Clinician Reply</span>' : ''}
              <div style="color: #334155; margin-top: 0.15rem;">${c.text}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="feed-actions">
        <button class="feed-action-btn" onclick="likeCommunityPost('${post.id}')">
          👍 Upvote (${post.upvotes})
        </button>
        <button class="feed-action-btn" onclick="addCommentToPost('${post.id}')">
          💬 Reply (${post.comments.length})
        </button>
        <span style="font-size: 0.75rem; color: var(--text-light); margin-left: auto;">Peer-reviewed Health Discussion</span>
      </div>
    </div>
  `).join('');
}

function filterFeed(dept) {
  activeFeedDepartment = dept;
  document.querySelectorAll('.feed-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.dept === dept);
  });
  renderCommunityFeed();
}

function likeCommunityPost(postId) {
  const post = appState.communityFeed.find(p => p.id === postId);
  if (post) {
    post.upvotes += 1;
    saveState();
    renderCommunityFeed();
    showToast('Upvoted community health post', 'info');
  }
}

function addCommentToPost(postId) {
  const commentText = prompt('Enter your reply or clinical observation:');
  if (!commentText) return;

  const post = appState.communityFeed.find(p => p.id === postId);
  if (post) {
    const isDoc = appState.currentRole === 'doctor';
    post.comments.push({
      author: isDoc ? appState.doctorProfile.name : `${appState.patientProfile.name} (Patient)`,
      role: isDoc ? 'doctor' : 'patient',
      verified: isDoc,
      text: commentText,
      time: 'Just now'
    });
    saveState();
    renderCommunityFeed();
    showToast('Reply posted to community feed', 'success');
  }
}

function createCommunityPost() {
  const title = prompt('Enter Post Title / Question:');
  if (!title) return;
  const content = prompt('Enter post content / clinical advisory:');
  if (!content) return;
  const dept = prompt('Enter department (Cardiology, Pulmonology, General Medicine, Pediatrics, Maternal Health):', 'General Medicine') || 'General Medicine';

  const isDoc = appState.currentRole === 'doctor';
  const newPost = {
    id: 'post-' + Date.now(),
    author: isDoc ? appState.doctorProfile.name : `${appState.patientProfile.name} (Patient)`,
    role: isDoc ? 'doctor' : 'patient',
    dept: dept,
    avatar: isDoc ? 'RV' : 'RK',
    time: 'Just now',
    title: title,
    content: content,
    upvotes: 1,
    comments: []
  };

  appState.communityFeed.unshift(newPost);
  saveState();
  renderCommunityFeed();
  showToast('Published new discussion in ' + dept, 'success');
}

// ============================================================================
// 13. Direct In-App Doctor-Patient Messaging (Feature 13 - LinkedIn style)
// ============================================================================

let activeChatDoctor = 'doc-1';

function openDoctorChat(docId) {
  activeChatDoctor = docId || 'doc-1';
  const drawer = document.getElementById('chatDrawer');
  if (drawer) {
    drawer.classList.remove('minimized');
    drawer.style.display = 'flex';
  }
  renderChatMessages();
}

function toggleChatDrawer() {
  const drawer = document.getElementById('chatDrawer');
  if (drawer) {
    drawer.classList.toggle('minimized');
  }
}

function renderChatMessages() {
  const container = document.getElementById('chatMessagesBox');
  const doc = appState.availableDoctors.find(d => d.id === activeChatDoctor) || appState.availableDoctors[0];
  const docNameHeader = document.getElementById('chatDoctorNameHeader');
  const docDeptHeader = document.getElementById('chatDoctorDeptHeader');

  if (docNameHeader) docNameHeader.innerText = doc.name;
  if (docDeptHeader) docDeptHeader.innerText = `${doc.dept} • ${doc.status}`;

  if (!container) return;

  container.innerHTML = appState.chatMessages.map(m => `
    <div class="chat-msg ${m.sender}">
      <div style="font-size: 0.7rem; color: ${m.sender === 'patient' ? 'rgba(255,255,255,0.8)' : 'var(--text-light)'}; margin-bottom: 0.2rem;">
        ${m.sender === 'patient' ? 'Ramesh Kumar (You)' : doc.name} • ${m.time}
      </div>
      <div>${m.text}</div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chatInputText');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  appState.chatMessages.push({
    id: 'msg-' + Date.now(),
    sender: 'patient',
    text: text,
    time: timeStr
  });

  saveState();
  renderChatMessages();

  // Simulated Doctor Response after 1.5s
  setTimeout(() => {
    const doc = appState.availableDoctors.find(d => d.id === activeChatDoctor) || appState.availableDoctors[0];
    let replyText = `Understood. Please keep resting in a propped-up seated position. I am reviewing your triage card now.`;

    if (text.toLowerCase().includes('pain') || text.toLowerCase().includes('chest')) {
      replyText = `Do not exert yourself. If you have Sorbitrate 5mg or Aspirin at home and have taken it before, keep it ready. The ambulance dispatch has been alerted.`;
    } else if (text.toLowerCase().includes('medicine') || text.toLowerCase().includes('tablet')) {
      replyText = `Please share the photograph of the medicine strip here so I can verify the active molecule and dosage.`;
    }

    appState.chatMessages.push({
      id: 'msg-' + Date.now(),
      sender: 'doctor',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    saveState();
    renderChatMessages();
  }, 1400);
}

function sendQuickChat(phrase) {
  const input = document.getElementById('chatInputText');
  if (input) {
    input.value = phrase;
    sendChatMessage();
  }
}

// ============================================================================
// 14. Emergency SOS Tele-Triage Room (Feature 9)
// ============================================================================

let telemetryInterval = null;

function openEmergencySosModal() {
  const modal = document.getElementById('emergencySosModal');
  if (!modal) return;
  modal.classList.add('open');

  const hrEl = document.getElementById('sosHeartRate');
  const bpEl = document.getElementById('sosBloodPressure');
  const spo2El = document.getElementById('sosSpO2');

  // Simulate continuous telemetry fluctuations
  clearInterval(telemetryInterval);
  telemetryInterval = setInterval(() => {
    if (hrEl) hrEl.innerText = Math.floor(104 + Math.random() * 12);
    if (bpEl) bpEl.innerText = `${Math.floor(150 + Math.random() * 8)}/${Math.floor(92 + Math.random() * 6)}`;
    if (spo2El) spo2El.innerText = `${Math.floor(92 + Math.random() * 2)}%`;
  }, 2000);
}

function closeEmergencySosModal() {
  const modal = document.getElementById('emergencySosModal');
  if (modal) modal.classList.remove('open');
  clearInterval(telemetryInterval);
}

function dispatch108Ambulance() {
  showToast('🚨 108 AMBULANCE DISPATCHED! GPS Coordinates sent to Mandya District Emergency Response Center. ETA: 12 minutes.', 'danger');
  const statusEl = document.getElementById('ambulanceDispatchStatus');
  if (statusEl) {
    statusEl.innerHTML = `
      <div style="background: #fee2e2; border: 2px solid var(--danger); border-radius: var(--radius-md); padding: 0.85rem; color: #7f1d1d; font-weight: 700;">
        🚑 Ambulance KA-11-G-4091 En Route to Shivanasamudra PHC. Driver Contact: +91 98450 11080.
      </div>
    `;
  }
}

// ============================================================================
// 15. JSON Viewer Modal & Toasts
// ============================================================================

function openJsonModal() {
  const modal = document.getElementById('jsonViewerModal');
  const viewer = document.getElementById('jsonCodeViewer');
  if (!modal || !viewer) return;

  const exportPayload = {
    resourceType: 'ClinicalTriageEncounter',
    timestamp: new Date().toISOString(),
    patient: {
      name: appState.patientProfile.name,
      age: appState.patientProfile.age,
      abhaId: appState.patientProfile.abhaId,
      village: appState.patientProfile.village,
      activeMedications: appState.patientProfile.activeMedications
    },
    intake: {
      language: appState.selectedLang,
      rawSpeechTranscript: currentTriage.rawTranscript,
      extractedEntities: currentTriage.extractedEntities
    },
    prescriptionOcr: {
      documentId: currentTriage.prescriptionData.id,
      prescriber: currentTriage.prescriptionData.doctor,
      confidenceScore: currentTriage.prescriptionData.confidence,
      needsDoctorVerification: currentTriage.prescriptionData.needsDoctorVerification,
      extractedMedicines: currentTriage.prescriptionData.medicines
    },
    triageClassification: {
      urgencyLevel: currentTriage.severity,
      urgencyReason: currentTriage.urgencyReason,
      predictedCondition: currentTriage.predictedCondition,
      recommendedAction: currentTriage.recommendedAction,
      matchedDepartment: currentTriage.department,
      suggestedInvestigations: currentTriage.suggestedInvestigations,
      drugInteractionAlert: currentTriage.drugInteractionAlert
    },
    teleTriageRouting: {
      assignedDoctor: appState.doctorProfile.name,
      registration: appState.doctorProfile.nmcReg,
      cmeAccredited: true
    }
  };

  viewer.innerText = JSON.stringify(exportPayload, null, 2);
  modal.classList.add('open');
}

function closeJsonModal() {
  const modal = document.getElementById('jsonViewerModal');
  if (modal) modal.classList.remove('open');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'danger' ? '🚨' : (type === 'warning' ? '⚠️' : '✓')}</span> <div>${message}</div>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============================================================================
// 16. Initialization on DOM Load
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  renderTriageView();
  renderPatientHistory();
  renderDoctorDirectory();
  renderCommunityFeed();
  renderDoctorDashboard();
  renderCmeTracker();
  renderChatMessages();

  // Attach keyboard event for chat input
  const chatInput = document.getElementById('chatInputText');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
});
