# Health-Bridge (स्वास्थ्य सेतु / நலப் பாலம் / ಆರೋಗ್ಯ ಸೇತು)
### Rural Health Triage & Doctor-Patient Bridge System

Health-Bridge is a functional web prototype designed to bridge messy real-world health inputs (multilingual voice descriptions, blurry mobile photos of handwritten prescriptions, and clinic notes) with structured, verified, life-saving clinical medical actions.

---

## 🌟 Core Features Implementation Map

### CORE AI TRIAGE FEATURES
1. **Voice Symptom Intake (Multilingual)**:
   - Live speech recognition using Web Speech API (`webkitSpeechRecognition`) supporting **Hindi (हिन्दी)**, **Tamil (தமிழ்)**, **Kannada (ಕನ್ನಡ)**, and **English**.
   - Built-in one-click scenario presets for each language with instant structured entity extraction (symptoms, duration, severity keywords, anatomical body system).
2. **Prescription/Report Photo Reader (Gemini Vision OCR)**:
   - Accept user photo uploads (camera/file dropzone) or test with 3 built-in realistic clinic records (Rural PHC Rx, Messy handwritten clinic slip, and Emergency ECG/Troponin report).
   - Extracts doctor name, facility, date, diagnosis, and medications into structured JSON.
3. **Severity Scoring (Strict Tri-Color Urgency)**:
   - **GREEN**: Mild / Non-urgent with home care and ORS hydration advice.
   - **YELLOW**: Moderate urgency requiring Primary Health Centre visit within 24–48 hours.
   - **RED**: Critical emergency requiring immediate tertiary referral, 108 ambulance dispatch, and telemetry hand-off.
   - Clear, one-line clinical reason provided for each triage outcome.
4. **Structured Action Card**:
   - Complete clinical card presenting: Predicted Medical Condition, Urgency Level badge, Recommended Action, Clinical Reasoning, and Suggested Diagnostic Investigations.
   - Interactive `{ } View JSON Card` modal with interoperable FHIR/JSON export schema.
5. **Local Language Voice-Out (Text-to-Speech)**:
   - Native Web Speech API `speechSynthesis` reads the actionable guidance out loud in Hindi, Tamil, Kannada, or English so low-literacy rural patients can understand immediately.

---

### PATIENT HISTORY & SAFETY
6. **Cross-Check Drug-Symptom Safety Engine**:
   - Compares reported symptoms with active medications in the patient's profile.
   - Detects critical interactions (e.g., patient taking Aspirin who reports bleeding/black stools triggers a critical alert: *Suspected Aspirin-Induced GI Bleeding*).
   - Withhold/contraindication warnings for Metformin during dehydration and Amlodipine for ankle edema.
7. **Patient Health Profile & Longitudinal Timeline**:
   - ABHA-integrated profile with chronic conditions, blood group, and active meds.
   - Chronological multi-visit timeline tracking past hospital visits, complaints, doctors, prescriptions, and outcomes over time.
   - Instant "+ Save to Health History" button to append current triage to the timeline.

---

### DOCTOR-SIDE CLINICAL FEATURES
8. **Verified Doctor Directory**:
   - National Medical Commission (NMC) verified clinician profiles with registration numbers, state councils, years of experience, hospital affiliations, and specialties.
9. **Emergency Auto-Connect for RED Cases**:
   - Pulsing `🚨 CONNECT TO LIVE EMERGENCY DOCTOR NOW` button triggers an emergency tele-triage room with live simulated patient telemetry (HR, BP, SpO2), video consultation relay, and one-click 108 ambulance dispatch.
10. **AI Department / Specialization Routing**:
    - Automatic symptom-to-department classification (Cardiology, Pulmonology, General Medicine, Pediatrics, OBGYN).
11. **Doctor Review Dashboard**:
    - Clinicians can review incoming cases, inspect OCR findings and symptoms, and choose to **Approve**, **Edit**, or **Override** the AI triage decision.
12. **Confidence Flagging ("Needs Doctor Verification")**:
    - If handwriting is degraded or symptoms are ambiguous, confidence drops (e.g. 48%) and the case is flagged as *Needs Doctor Verification* rather than guessing.
13. **Doctor Profile Management Page (`👤 My Profile & Credentials`)**:
    - Dedicated page in Doctor section allowing doctors to view and continuously update their clinical identity.
    - Editable fields: Full Name, Academic Qualifications, NMC Registration ID, State Medical Council, Specialization/Department, Affiliated Hospital / Apex Tele-Triage Hub, Years of Clinical Practice, On-Duty Tele-Triage Status, Guaranteed Response Latency, Emergency Pager/Email, Clinical Bio & Rural Tele-Health Mission, and Profile Avatar badge.
    - Real-time side-by-side Public Verification Card preview and instant synchronization across the entire network.

---

### COMMUNITY & COMMUNICATION
14. **In-App LinkedIn-Style Messaging**:
    - 1-on-1 private messaging drawer between patients and matched verified doctors with clinical quick-reply chips and simulated instant responses.
15. **Department Community & Health Feed**:
    - Public discussion feed filtered by medical department where doctors post clinical alerts (e.g., post-harvest asthma, dengue guidelines) and answer patient queries with verified doctor badges.

---

### DOCTOR MOTIVATION SYSTEM
16. **CME (Continuing Medical Education) Credit Tracker**:
    - Live progress bar tracking credits toward the mandatory 30-credit requirement for Indian medical license renewal (+0.5 credits per case approved, +1.0 for emergency overrides).
    - Timestamped CME audit activity log.
17. **Verified Public Impact Profile**:
    - Showcases real clinical audit metrics: Rural Patients Helped (428), Emergency Referrals Resolved (39), Average Response Time (4.2m), and a printable State Medical Council CME Certificate of Recognition.

---


### AUTHENTICATION & LOGIN
18. **Dual-Role Sign In / Login Modal**:
    - Accessible via header pill (`🔑 Login / Switch`).
    - Dedicated tabs for **🧑‍🌾 Patient / ASHA Worker** (ABHA ID, Village, Patient Name) and **🩺 Doctor / Specialist** (NMC Registration ID, State Council, Department).
    - Includes 1-click instant demo logins for quick testing:
      - *Ramesh Kumar (Patient / Mandya)*
      - *Dr. Rajesh Verma (Cardiology / Victoria Hospital)*
      - *Dr. Ananya Sen (Pulmonology / Safdarjung Hospital)*
    - Persists session and updates user badge and role dynamically.

---

=======

