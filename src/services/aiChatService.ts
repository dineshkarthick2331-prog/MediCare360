// ─── MediCare 360 — AI Medical Assistant Engine (MediBot) ───────────────────
// Multilingual, RAG-grounded conversational medical engine with safety guardrails,
// emergency symptom detection, role-aware personalization, and LLM API integration.

import {
  DOCTORS,
  Doctor,
  DEPARTMENTS,
  PRESCRIPTIONS,
  LAB_REPORTS,
  INVOICES,
  INSURANCE,
  WARDS,
  ADMIN_STATS,
  AMBULANCES,
  DemoUser,
  Role,
} from '../data/demo';
import { getStoredAppointments, getStoredPrescriptions, getStoredQueries } from './hospitalDataStore';

export type Language = 'en' | 'ta' | 'hi';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: string;
  language?: Language;
  isEmergency?: boolean;
  widgetType?: 'appointment_flow' | 'doctor_list' | 'report_view' | 'prescription_view' | 'ward_status' | 'admin_summary' | 'support_handoff' | 'prescription_draft';
  widgetData?: any;
  quickReplies?: string[];
}

export interface AIContext {
  currentUser: DemoUser | null;
  role: Role | null;
  currentPath: string;
  preferredLanguage: Language;
}

// ─── Emergency Symptoms Detection ───────────────────────────────────────────

const EMERGENCY_KEYWORDS = [
  // English
  'chest pain', 'heart attack', 'cardiac arrest', 'shortness of breath', 'cannot breathe',
  'severe bleeding', 'unconscious', 'fainted', 'seizure', 'stroke', 'paralysis',
  'loss of vision', 'severe burn', 'anaphylaxis', 'poisoning', 'suicide', 'choking',
  'coughing blood', 'vomiting blood', 'severe head injury', 'sudden collapse',
  // Tamil
  'நெஞ்சு வலி', 'மாரடைப்பு', 'மூச்சுத்திணறல்', 'மூச்சு விட முடியவில்லை',
  'மயக்கம்', 'இரத்தப்போக்கு', 'பக்கவாதம்', 'வலிப்பு',
  // Hindi
  'सीने में दर्द', 'दौरा', 'हार्ट अटैक', 'सांस लेने में तकलीफ', 'सांस फूलना',
  'बेहोश', 'खून बह रहा', 'लकवा', 'मिर्गी',
];

export function detectEmergency(input: string): boolean {
  const lower = input.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
}

// ─── Language Detection ─────────────────────────────────────────────────────

export function detectLanguage(text: string): Language {
  // Tamil unicode range \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  // Devanagari (Hindi) unicode range \u0900-\u097F
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
}

// ─── RAG Grounding Knowledge Base ───────────────────────────────────────────

function buildHospitalGroundingContext(context: AIContext): string {
  const doctorsList = DOCTORS.map(d =>
    `- ${d.name} (${d.specialty}, Dept: ${d.department}, Qual: ${d.qualification}, Exp: ${d.experience}y, Fee: ₹${d.fee}, Rating: ${d.rating}★, Available: ${d.available ? 'Yes (' + d.nextAvailable + ')' : 'No'})`
  ).join('\n');

  const deptList = DEPARTMENTS.map(dp => `${dp.name} (${dp.doctorCount} doctors)`).join(', ');

  let userSpecificContext = '';
  if (context.currentUser?.role === 'patient') {
    const apts = getStoredAppointments().filter(a => a.patientId === context.currentUser?.id || a.patientName.includes('Dinesh'));
    const rxs = getStoredPrescriptions().filter(r => r.patientId === context.currentUser?.id);
    const labs = LAB_REPORTS.filter(l => l.patientId === context.currentUser?.id);
    const bills = INVOICES.filter(b => b.patientId === context.currentUser?.id);
    const ins = INSURANCE.filter(i => i.patientId === context.currentUser?.id);

    userSpecificContext = `
AUTHENTICATED PATIENT DATA:
- Patient Name: ${context.currentUser.name} (ID: ${context.currentUser.patientId || context.currentUser.id})
- Phone: ${context.currentUser.phone || '+91 98765 43210'}
- Upcoming Appointments: ${JSON.stringify(apts)}
- Active Prescriptions: ${JSON.stringify(rxs)}
- Lab Diagnostic Reports: ${JSON.stringify(labs)}
- Billing Invoices: ${JSON.stringify(bills)}
- Insurance Policy & Claims: ${JSON.stringify(ins)}
`;
  } else if (context.currentUser?.role === 'doctor') {
    const myApts = getStoredAppointments().filter(a => a.doctorId === context.currentUser?.id || a.doctorName.includes(context.currentUser?.name || ''));
    userSpecificContext = `
AUTHENTICATED DOCTOR DATA:
- Doctor: ${context.currentUser.name} (${context.currentUser.specialization || 'Consultant'})
- Today's Appointments & Queue: ${JSON.stringify(myApts)}
- Pending Consultations: ${myApts.filter(a => a.status === 'Confirmed' || a.status === 'Waiting').length}
`;
  } else if (context.currentUser?.role === 'nurse' || context.currentUser?.role === 'staff') {
    userSpecificContext = `
WARD & OCCUPANCY DATA:
- Wards: ${JSON.stringify(WARDS)}
- Ambulances: ${JSON.stringify(AMBULANCES)}
`;
  } else if (context.currentUser?.role === 'admin') {
    userSpecificContext = `
HOSPITAL ADMIN STATISTICS:
- Stats: ${JSON.stringify(ADMIN_STATS)}
`;
  }

  return `
HOSPITAL PROFILE:
- Name: MediCare 360 Multispecialty Hospital & Research Institute
- Address: 42, Health City Expressway, Chennai, Tamil Nadu 600028
- Emergency Helpline: 108 / 044-2830-3699 (24/7 Instant SOS Dispatch)
- Hospital General Reception: 044-2830-3600 (Mon-Sat 8:00 AM - 8:00 PM)
- Outpatient (OPD) Hours: 8:00 AM to 8:00 PM
- Inpatient (IPD) / Pharmacy / Emergency / Laboratory: 24 Hours Open Every Day
- Total Bed Capacity: 200 beds (General, ICU, NICU, Maternity)
- Departments Available: ${deptList}
- Cashless Insurance Tie-ups: Star Health, HDFC ERGO, ICICI Lombard, MediAssist, Max Bupa, New India Assurance

DOCTORS ROSTER:
${doctorsList}

${userSpecificContext}
`;
}

// ─── External Gemini / LLM API Invoker ──────────────────────────────────────

async function tryCallExternalLLM(prompt: string, context: AIContext): Promise<string | null> {
  // Check for Vite env variable
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.VITE_AI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    return null;
  }

  try {
    const systemPrompt = `You are MediBot, the intelligent medical and hospital assistant for MediCare 360 Multispecialty Hospital.
Your responsibilities:
1. Provide compassionate, medically accurate, and easy-to-understand health information.
2. CRITICAL SAFETY: You are an AI assistant and NOT a qualified physician. Always state that this is for informational purposes only. NEVER make a definitive clinical diagnosis or advise patients to change prescription dosages.
3. If the user mentions life-threatening symptoms (chest pain, stroke, breathing failure, heavy bleeding, loss of consciousness), IMMEDIATELY advise calling 108 or rushing to the emergency department.
4. Answer questions about MediCare 360 doctors, appointment booking, OPD/IPD timings, prescriptions, and lab tests using the provided hospital facts.
5. Support English, Tamil (தமிழ்), and Hindi (हिन्दी). If the user writes in Tamil or Hindi, respond fluently and naturally in that language.
6. Keep answers concise, clear, well-structured with bullet points where appropriate.

HOSPITAL CONTEXT & VERIFIED DATABASE:
${buildHospitalGroundingContext(context)}
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question:\n${prompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800,
      },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (err) {
    console.warn('Gemini API call skipped or failed, using local RAG engine:', err);
    return null;
  }
}

// ─── Core Intelligent Local RAG Engine ──────────────────────────────────────

export async function processUserMessage(
  userQuery: string,
  context: AIContext,
  history: ChatMessage[] = []
): Promise<ChatMessage> {
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const detectedLang = detectLanguage(userQuery);
  const targetLang: Language = detectedLang !== 'en' ? detectedLang : context.preferredLanguage;
  const lower = userQuery.toLowerCase().trim();

  // 1. Emergency Safety Check
  if (detectEmergency(userQuery)) {
    let emergencyText = '';
    if (targetLang === 'ta') {
      emergencyText = `🚨 **அவசர மருத்துவ எச்சரிக்கை!**\n\nநீங்கள் குறிப்பிட்டுள்ள அறிகுறிகள் உடனடி அவசர மருத்துவ கவனிப்பு தேவைப்படுவதாக தெரிகிறது.\n\nதயவுசெய்து நேரத்தை வீணாக்காமல் உடனே **108** அவசர ஆம்புலன்ஸ் எண்ணை அழைக்கவும் அல்லது மெடிகேர் 360 அவசர சிகிச்சைப் பிரிவிற்கு விரைந்து செல்லவும்.\n\n📍 **மெடிகேர் 360 அவசரப் பிரிவு (24/7 திறந்துள்ளது):**\nஅவசர உதவி எண்: **044-2830-3699 / 108**\nஆம்புலன்ஸ் உடனடி உதவி தயார் நிலையில் உள்ளது.`;
    } else if (targetLang === 'hi') {
      emergencyText = `🚨 **आपातकालीन चिकित्सा चेतावनी!**\n\nआपके द्वारा बताए गए लक्षण गंभीर आपातकालीन स्थिति का संकेत देते हैं।\n\nकृपया तुरंत **108** एम्बुलेंस को कॉल करें या नजदीकी आपातकालीन विभाग में जाएं।\n\n📍 **मेदिकेयर 360 इमरजेंसी वार्ड (24/7 खुला है):**\nहेल्पलाइन: **044-2830-3699 / 108**\nएडवांस्ड लाइफ सपोर्ट एम्बुलेंस स्टैंडबाय पर उपलब्ध है।`;
    } else {
      emergencyText = `🚨 **CRITICAL MEDICAL EMERGENCY DETECTED!**\n\nThe symptoms you mentioned require immediate emergency medical attention.\n\nPlease **do not wait** or delay by chatting. Immediately call **108** or rush to the nearest Emergency Department.\n\n📍 **MediCare 360 Emergency & Trauma Centre (Open 24/7):**\n📞 Emergency Helpline: **108** or **044-2830-3699**\n🚑 Cardiac & Trauma Ambulance is ready for instant dispatch.`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: emergencyText,
      timestamp: now,
      language: targetLang,
      isEmergency: true,
      quickReplies: targetLang === 'ta'
        ? ['ஆம்புலன்ஸ் அனுப்பவும் 🚑', 'அவசர அழைப்பு 108', 'மருத்துவமனை இருப்பிடம்']
        : targetLang === 'hi'
        ? ['एम्बुलेंस बुलाएं 🚑', 'इमरजेंसी कॉल 108', 'अस्पताल का पता']
        : ['Dispatch Ambulance 🚑', 'Call Emergency 108', 'Hospital Directions'],
    };
  }

  // 2. Appointment Booking Conversational Intent
  if (
    lower.includes('book') ||
    lower.includes('appointment') ||
    lower.includes('consultation') ||
    lower.includes('முன்பதிவு') ||
    lower.includes('अपॉइंटमेंट') ||
    lower.includes('अपॉइंटमेंट बुक')
  ) {
    let msgText = '';
    if (targetLang === 'ta') {
      msgText = `மருத்துவ முன்பதிவு செய்ய விரும்புகிறீர்களா? மகிழ்ச்சி! கீழேயுள்ள மருத்துவப் பிரிவை தேர்ந்தெடுக்கவும் அல்லது நீங்கள் பார்க்க விரும்பும் மருத்துவரை தேர்வு செய்யவும்:`;
    } else if (targetLang === 'hi') {
      msgText = `डॉक्टर परामर्श बुक करने में मैं आपकी मदद कर सकता हूँ। कृपया नीचे अपना पसंदीदा विभाग चुनें:`;
    } else {
      msgText = `I'd be happy to help you schedule a doctor consultation. Please choose the medical department or specialist below:`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: msgText,
      timestamp: now,
      language: targetLang,
      widgetType: 'appointment_flow',
      widgetData: { step: 'select_department', departments: DEPARTMENTS, doctors: DOCTORS },
      quickReplies: ['Cardiology ❤️', 'General Medicine 🩺', 'Neurology 🧠', 'Orthopedics 🦴', 'Pediatrics 👶'],
    };
  }

  // 3. Check / Reschedule / Cancel Existing Appointments
  if (
    lower.includes('my appointment') ||
    lower.includes('check appointment') ||
    lower.includes('reschedule') ||
    lower.includes('cancel appointment') ||
    lower.includes('என் முன்பதிவு') ||
    lower.includes('मेरी अपॉइंटमेंट')
  ) {
    if (!context.currentUser) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: targetLang === 'ta'
          ? 'உங்கள் முன்பதிவுகளை சரிபார்க்க, மாற்றியமைக்க அல்லது ரத்து செய்ய, தயவுசெய்து உங்கள் நோயாளி கணக்கில் உள்நுழையவும்.'
          : targetLang === 'hi'
          ? 'अपनी अपॉइंटमेंट देखने, बदलने या रद्द करने के लिए कृपया मरीज पोर्टल पर लॉगिन करें।'
          : 'To view, reschedule, or cancel your appointments securely, please sign in to your Patient Account first.',
        timestamp: now,
        language: targetLang,
        quickReplies: ['Login as Patient', 'Book New Appointment', 'Hospital Timings'],
      };
    }

    const apts = getStoredAppointments().filter(
      a => a.patientId === context.currentUser?.id || a.patientName.includes('Dinesh')
    );

    let summaryText = '';
    if (apts.length === 0) {
      summaryText = targetLang === 'ta'
        ? 'உங்களுக்கு வரவிருக்கும் முன்பதிவுகள் எதுவும் இல்லை. புதிய முன்பதிவு செய்ய விரும்புகிறீர்களா?'
        : targetLang === 'hi'
        ? 'आपके पास वर्तमान में कोई सक्रिय अपॉइंटमेंट नहीं है। क्या आप नया स्लॉट बुक करना चाहते हैं?'
        : 'You have no active upcoming appointments scheduled. Would you like to book one?';
    } else {
      const aptListFormatted = apts
        .map(
          a =>
            `• **${a.doctorName}** (${a.department})\n  📅 **Date:** ${a.date} at **${a.time}**\n  🎫 **Token:** ${a.token} | Status: **${a.status}**\n  🆔 Ref: \`${a.appointmentId}\``
        )
        .join('\n\n');

      if (targetLang === 'ta') {
        summaryText = `இதோ உங்கள் தற்போதைய முன்பதிவு விவரங்கள்:\n\n${aptListFormatted}\n\nநீங்கள் ஒரு முன்பதிவை ரத்து செய்ய அல்லது மறுஅட்டவணை செய்ய விரும்பினால், கீழே உள்ள ஆப்ஷன்களைப் பயன்படுத்தலாம்.`;
      } else if (targetLang === 'hi') {
        summaryText = `यहाँ आपकी वर्तमान अपॉइंटमेंट की जानकारी है:\n\n${aptListFormatted}\n\nयदि आप अपॉइंटमेंट को रीशेड्यूल या कैंसल करना चाहते हैं, तो मुझे बताएं।`;
      } else {
        summaryText = `Here are your current appointments on record:\n\n${aptListFormatted}\n\nYou can manage or cancel any appointment directly below:`;
      }
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: summaryText,
      timestamp: now,
      language: targetLang,
      widgetType: 'appointment_flow',
      widgetData: { step: 'manage_appointments', appointments: apts },
      quickReplies: ['Book New Appointment', 'Explain My Prescription', 'View Lab Reports'],
    };
  }

  // 4. Understand Prescriptions
  if (
    lower.includes('prescription') ||
    lower.includes('medicine') ||
    lower.includes('tablet') ||
    lower.includes('dosage') ||
    lower.includes('மருந்து') ||
    lower.includes('दवा') ||
    lower.includes('नुस्खा')
  ) {
    if (context.currentUser?.role === 'patient') {
      const rx = getStoredPrescriptions().find(p => p.patientId === context.currentUser?.id) || PRESCRIPTIONS[0];
      const medsExplained = (rx.medicines || []).map((m: any) =>
        `💊 **${m.name} (${m.strength})**\n- **Dosage:** ${m.dosage} · **Frequency:** ${m.frequency}\n- **Duration:** ${m.duration} · **Instructions:** ${m.instructions}`
      ).join('\n\n');

      let explanation = '';
      if (targetLang === 'ta') {
        explanation = `உங்கள் சமீபத்திய மருந்து சீட்டு விவரம் (**${rx.diagnosis}** - ${rx.doctorName}):\n\n${medsExplained}\n\n📌 **முக்கிய குறிப்பு:** ${rx.notes}\n_எப்போதும் மருத்துவர் பரிந்துரைத்தபடி உணவுக்குப் பின் சரியான நேரத்தில் மருந்து உட்கொள்ளவும். சுயமாக மருந்து அளவை மாற்றாதீர்கள்._`;
      } else if (targetLang === 'hi') {
        explanation = `आपकी नवीनतम डॉक्टर पर्ची (**${rx.diagnosis}** - ${rx.doctorName}):\n\n${medsExplained}\n\n📌 **सलाह:** ${rx.notes}\n_कृपया दवाइयों को समय पर लें और कभी भी डॉक्टर की सलाह के बिना खुराक न बदलें।_`;
      } else {
        explanation = `Here is a clear breakdown of your active prescription for **${rx.diagnosis}** (prescribed by ${rx.doctorName}):\n\n${medsExplained}\n\n📌 **Doctor's Note:** ${rx.notes}\n\n*Medical Reminder: Always take medicines with water as instructed. Never discontinue antibiotics early or adjust doses on your own.*`;
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: explanation,
        timestamp: now,
        language: targetLang,
        widgetType: 'prescription_view',
        widgetData: { prescription: rx },
        quickReplies: ['View Lab Reports', 'Check Next Follow-up', 'Book Doctor Consultation'],
      };
    } else {
      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: targetLang === 'ta'
          ? 'மெடிகேர் 360-ல் வழங்கப்பட்ட உங்கள் மருந்துச் சீட்டை விரிவாக புரிந்து கொள்ள நோயாளி போர்ட்டலில் உள்நுழையவும். பொதுவான மருந்து தகவல்களுக்கு நீங்கள் எந்த மருந்தின் பெயரையும் கேட்கலாம்.'
          : targetLang === 'hi'
          ? 'अपनी डॉक्टर पर्ची देखने और समझने के लिए कृपया मरीज अकाउंट में लॉगिन करें।'
          : 'To view and understand your personalized prescriptions, please sign in as a Patient. You can also ask me about common medicine uses like Paracetamol, Cetirizine, or Azithromycin.',
        timestamp: now,
        language: targetLang,
        quickReplies: ['Login as Patient', 'Paracetamol Uses', 'Hospital Pharmacy 24/7'],
      };
    }
  }

  // 5. Medical Lab Reports & Diagnostics
  if (
    lower.includes('report') ||
    lower.includes('lab') ||
    lower.includes('blood test') ||
    lower.includes('ecg') ||
    lower.includes('x-ray') ||
    lower.includes('அறிக்கை') ||
    lower.includes('இரத்த பரிசோதனை') ||
    lower.includes('रिपोर्ट') ||
    lower.includes('जांच')
  ) {
    if (context.currentUser?.role === 'patient') {
      const reports = LAB_REPORTS.filter(r => r.patientId === context.currentUser?.id);
      const repDetails = reports.map(r =>
        `🔬 **${r.name} (${r.type})** · Date: ${r.date}\n- Status: **${r.status}** (Ordered by ${r.orderedBy})\n- **Findings:** ${r.findings || 'Pending Lab Review'}\n- Normal Range: ${r.normalRange || 'Standard Lab Metrics'}`
      ).join('\n\n');

      let repText = '';
      if (targetLang === 'ta') {
        repText = `உங்கள் மருத்துவ ஆய்வக பரிசோதனை முடிவுகள்:\n\n${repDetails}\n\n💡 **விளக்கம்:** உங்கள் Complete Blood Count (CBC) இரத்த பரிசோதனையில் இரத்த சிவப்பு அணுக்கள் (Hb: 13.2 g/dL) மற்றும் தட்டணுக்கள் நல்ல நிலையில் உள்ளன. லேசான வெள்ளை அணுக்களின் உயர்வு உடலின் இயற்கையான நோய் எதிர்ப்பு வைரஸ் காய்ச்சல் எதிர்ப்பை குறிக்கிறது.`;
      } else if (targetLang === 'hi') {
        repText = `आपकी डायग्नोस्टिक लैब रिपोर्ट सारांश:\n\n${repDetails}\n\n💡 **सरल व्याख्या:** सीबीसी रिपोर्ट में हीमोग्लोबिन 13.2 g/dL और प्लेटलेट्स पूरी तरह सामान्य हैं। ईसीजी रिपोर्ट में भी दिल की धड़कन 74 bpm सामान्य गति पर है।`;
      } else {
        repText = `Here is a summary and simple explanation of your recent diagnostic reports:\n\n${repDetails}\n\n💡 **Simplified Medical Summary:**\n• **Complete Blood Count (CBC):** Hemoglobin (13.2 g/dL) and Platelets (2.1 lakhs) are in healthy normal ranges. WBC is mildly elevated, indicating your body is actively recovering from a common viral infection.\n• **ECG & Chest X-Ray:** Both indicate normal cardiac rhythm and clear lungs with no cardiopulmonary abnormalities.`;
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: repText,
        timestamp: now,
        language: targetLang,
        widgetType: 'report_view',
        widgetData: { reports },
        quickReplies: ['Explain My Prescription', 'Book Follow-up Appointment', 'Billing & Insurance'],
      };
    } else {
      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: targetLang === 'ta'
          ? 'மெடிகேர் 360-ல் அதிநவீன 24/7 தானியங்கி இரத்தப் பரிசோதனை, 1.5T MRI, டிஜிட்டல் எக்ஸ்-ரே, அல்ட்ராசவுண்ட் மற்றும் ஈசிஜி வசதிகள் உள்ளன. உங்கள் அறிக்கைகளைப் பார்க்க நோயாளி போர்ட்டலில் உள்நுழையவும்.'
          : targetLang === 'hi'
          ? 'मेदिकेयर 360 में 24/7 फुल ऑटोमेटेड लैब, डिजिटल एक्स-रे, एमआरआई और ईसीजी सुविधाएं उपलब्ध हैं। अपनी रिपोर्ट देखने के लिए लॉगिन करें।'
          : 'MediCare 360 provides 24/7 Automated Pathology, 1.5T MRI, Digital X-Ray, 12-Lead ECG, and Ultrasound. Please log in as a Patient to access your lab records securely.',
        timestamp: now,
        language: targetLang,
        quickReplies: ['Login as Patient', 'Available Lab Tests', 'Find a Doctor'],
      };
    }
  }

  // 6. Billing and Insurance
  if (
    lower.includes('bill') ||
    lower.includes('invoice') ||
    lower.includes('insurance') ||
    lower.includes('cashless') ||
    lower.includes('claim') ||
    lower.includes('கட்டணம்') ||
    lower.includes('காப்பீடு') ||
    lower.includes('बिल') ||
    lower.includes('बीमा')
  ) {
    if (context.currentUser?.role === 'patient') {
      const ins = INSURANCE.find(i => i.patientId === context.currentUser?.id) || INSURANCE[0];
      const bills = INVOICES.filter(b => b.patientId === context.currentUser?.id);
      const pendingBill = bills.find(b => b.status === 'Unpaid');

      let billText = '';
      if (targetLang === 'ta') {
        billText = `🛡️ **மருத்துவக் காப்பீடு & பில்லிங் நிலை:**\n\n• **காப்பீட்டு நிறுவனம்:** ${ins.insurer}\n• **பாலிசி எண்:** \`${ins.policyNumber}\` (செயலில் உள்ளது)\n• **மொத்த கவரேஜ்:** ₹${ins.coverageLimit.toLocaleString('en-IN')}\n• **பயன்படுத்தப்பட்ட தொகை:** ₹${ins.usedAmount.toLocaleString('en-IN')}\n\n` +
          (pendingBill
            ? `⚠️ **நிலுவையில் உள்ள பில்:** ${pendingBill.billNumber} (நாள்: ${pendingBill.date})\n- மொத்த கட்டணம்: ₹${pendingBill.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)}\n- காப்பீடு கவரேஜ்: ₹${pendingBill.insuranceCoverage}\n- செலுத்த வேண்டிய தொகை: ₹${pendingBill.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0) - pendingBill.discount - pendingBill.insuranceCoverage}`
            : `✅ **அனைத்து கட்டணங்களும் முறையாக செலுத்தப்பட்டுள்ளன.**`);
      } else if (targetLang === 'hi') {
        billText = `🛡️ **बीमा और बिलिंग विवरण:**\n\n• **बीमा प्रदाता:** ${ins.insurer}\n• **पॉलिसी नंबर:** \`${ins.policyNumber}\`\n• **कैशलेस सुविधा:** उपलब्ध ✅\n• **कवर लिमिट:** ₹${ins.coverageLimit.toLocaleString('en-IN')}\n\n` +
          (pendingBill
            ? `⚠️ **बकाया बिल:** बिल नं. ${pendingBill.billNumber} (एमआरआई और कंसल्टेशन) पर ₹${pendingBill.insuranceCoverage} बीमा से स्वीकृत है।`
            : `✅ आपके सभी पिछले बिल चुकता हैं।`);
      } else {
        billText = `🛡️ **Billing & Insurance Status:**\n\n• **Insurance Partner:** ${ins.insurer}\n• **Policy Number:** \`${ins.policyNumber}\` (${ins.status})\n• **Cashless Facility:** Active ✅\n• **Annual Coverage Limit:** ₹${ins.coverageLimit.toLocaleString('en-IN')}\n• **Available Balance:** ₹${(ins.coverageLimit - ins.usedAmount).toLocaleString('en-IN')}\n\n` +
          (pendingBill
            ? `⚠️ **Pending Invoice [${pendingBill.billNumber}]:**\nTotal: ₹${pendingBill.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)} | Insurance pre-approved: ₹${pendingBill.insuranceCoverage} | Net payable on visit: ₹${pendingBill.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0) - pendingBill.discount - pendingBill.insuranceCoverage}`
            : `✅ All previous OPD bills are settled in full.`);
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: billText,
        timestamp: now,
        language: targetLang,
        quickReplies: ['Download Invoices', 'Insurance Desk Contact', 'Book Appointment'],
      };
    } else {
      let publicBilling = '';
      if (targetLang === 'ta') {
        publicBilling = `மெடிகேர் 360-ல் ஸ்டார் ஹெல்த், எச்டிஎஃப்சி எர்கோ, ஐசிஐசிஐ லொம்பார்ட் போன்ற அனைத்து முக்கிய காப்பீடுகளுக்கும் **ரொக்கமில்லா (Cashless TPA)** வசதி உள்ளது. பொது மருத்துவர் கட்டணம் ₹500, சிறப்பு மருத்துவர் கட்டணம் ₹700 - ₹1500 ஆகும்.`;
      } else if (targetLang === 'hi') {
        publicBilling = `मेदिकेयर 360 में स्टार हेल्थ, एचडीएफसी एर्गो, आईसीआईसीआई लोम्बार्ड सहित सभी प्रमुख बीमा कंपनियों के लिए **कैशलेस टीपीए डेस्क** उपलब्ध है। परामर्श शुल्क ₹500 से शुरू होता है।`;
      } else {
        publicBilling = `MediCare 360 provides a dedicated **Cashless TPA Insurance Desk** supporting Star Health, HDFC ERGO, ICICI Lombard, MediAssist, and government schemes. Specialist consultation fees range from ₹500 to ₹1,500. Detailed itemized digital invoices are provided for all services.`;
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: publicBilling,
        timestamp: now,
        language: targetLang,
        quickReplies: ['Check Cashless TPA', 'View Doctor Fees', 'Book Consultation'],
      };
    }
  }

  // 7. Find Doctor / Doctor Availability
  if (
    lower.includes('doctor') ||
    lower.includes('specialist') ||
    lower.includes('physician') ||
    lower.includes('cardiologist') ||
    lower.includes('neurologist') ||
    lower.includes('ortho') ||
    lower.includes('pediatrician') ||
    lower.includes('மருத்துவர்') ||
    lower.includes('டாக்டர்') ||
    lower.includes('डॉक्टर')
  ) {
    let matchDocs = DOCTORS;
    if (lower.includes('cardio') || lower.includes('இதயம்') || lower.includes('दिल')) {
      matchDocs = DOCTORS.filter(d => d.department === 'Cardiology');
    } else if (lower.includes('neuro') || lower.includes('நரம்பியல்') || lower.includes('दिमाग')) {
      matchDocs = DOCTORS.filter(d => d.department === 'Neurology');
    } else if (lower.includes('ortho') || lower.includes('எலும்பு') || lower.includes('हड्डी')) {
      matchDocs = DOCTORS.filter(d => d.department === 'Orthopedics');
    } else if (lower.includes('skin') || lower.includes('derma') || lower.includes('தோல்') || lower.includes('त्वचा')) {
      matchDocs = DOCTORS.filter(d => d.department === 'Dermatology');
    } else if (lower.includes('child') || lower.includes('pediatric') || lower.includes('குழந்தை') || lower.includes('बच्चे')) {
      matchDocs = DOCTORS.filter(d => d.department === 'Pediatrics');
    }

    const docCards = matchDocs.map(d =>
      `👨‍⚕️ **${d.name}** · ${d.specialty}\n• Department: **${d.department}** (${d.qualification}, ${d.experience} yrs exp)\n• Consultation Fee: **₹${d.fee}** | Rating: ${d.rating}★ (${d.reviews} reviews)\n• Status: **${d.available ? 'Available ' + d.nextAvailable : 'Unavailable'}**`
    ).join('\n\n');

    let docMsg = '';
    if (targetLang === 'ta') {
      docMsg = `மெடிகேர் 360-ல் உள்ள முன்னணி மருத்துவர்கள்:\n\n${docCards}\n\nமுன்பதிவு செய்ய விரும்பும் மருத்துவரைத் தேர்ந்தெடுக்கவும்.`;
    } else if (targetLang === 'hi') {
      docMsg = `मेदिकेयर 360 के विशेषज्ञ डॉक्टरों की सूची:\n\n${docCards}\n\nआप किसी भी डॉक्टर के साथ तुरंत अपॉइंटमेंट बुक कर सकते हैं।`;
    } else {
      docMsg = `Here are our specialist doctors available at MediCare 360:\n\n${docCards}\n\nWould you like to schedule an appointment with any of these specialists?`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: docMsg,
      timestamp: now,
      language: targetLang,
      widgetType: 'appointment_flow',
      widgetData: { step: 'select_doctor', doctors: matchDocs },
      quickReplies: ['Book an Appointment', 'Hospital OPD Timings', 'Emergency SOS 108'],
    };
  }

  // 8. Doctor Assistant Role Features
  if (context.currentUser?.role === 'doctor') {
    if (lower.includes('today') || lower.includes('schedule') || lower.includes('queue') || lower.includes('patient')) {
      const myApts = getStoredAppointments().filter(a => a.doctorId === context.currentUser?.id || a.doctorName.includes(context.currentUser?.name || ''));
      const aptText = myApts.map(a => `• **${a.patientName}** (Token ${a.token}) - ${a.time} [${a.status}]`).join('\n');

      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: `👨‍⚕️ **Good day, ${context.currentUser.name}!**\n\nHere is your patient consultation schedule for today:\n\n${aptText}\n\nI can assist you with:\n1. Drafting clinical notes & prescriptions (requires your explicit sign-off).\n2. Reviewing patient medical history and lab trends.\n3. Updating consultation status (e.g. In Consultation, Completed).`,
        timestamp: now,
        language: targetLang,
        quickReplies: ['Draft Prescription', 'View Pending Lab Tests', 'Patient Dinesh History'],
      };
    }

    if (lower.includes('draft') || lower.includes('prescribe')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: `📝 **Clinical Prescription Drafting Assistant:**\nI have prepared a draft prescription template for your review. Please adjust the medication, dosage, and duration, then click **Approve & Save** to add it to the patient's official record.`,
        timestamp: now,
        language: targetLang,
        widgetType: 'prescription_draft',
        widgetData: {
          patientName: 'Dinesh Karthick',
          patientId: 'pat-001',
          suggestedMeds: [
            { name: 'Tab. Paracetamol', strength: '650 mg', dosage: '1 tab', frequency: 'TID', duration: '3 days', instructions: 'After meals' },
            { name: 'Tab. Vitamin C + Zinc', strength: '500 mg', dosage: '1 tab', frequency: 'OD', duration: '10 days', instructions: 'Daily morning' },
          ],
        },
        quickReplies: ['Approve & Sign Prescription', 'Add Antibiotic', 'Cancel Draft'],
      };
    }
  }

  // 9. Nurse & Staff Assistant Role Features
  if (context.currentUser?.role === 'nurse' || context.currentUser?.role === 'staff') {
    if (lower.includes('ward') || lower.includes('bed') || lower.includes('admission') || lower.includes('ipd')) {
      const gwa = WARDS[0];
      const mw = WARDS[1];
      const gwaAvailable = gwa.beds.filter(b => b.status === 'available').length;
      const mwAvailable = mw.beds.filter(b => b.status === 'available').length;

      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: `🏥 **Ward & Bed Occupancy Real-time Summary:**\n\n• **${gwa.name}** (${gwa.department}):\n  - Total Beds: ${gwa.totalBeds} | Available: **${gwaAvailable}** beds | Occupied: ${gwa.beds.filter(b => b.status === 'occupied').length}\n\n• **${mw.name}** (${mw.department}):\n  - Total Beds: ${mw.totalBeds} | Available: **${mwAvailable}** beds | Occupied: ${mw.beds.filter(b => b.status === 'occupied').length}\n\nCurrently, Priya Sharma is admitted in Maternity Ward bed **MW-204** under Dr. Lalitha Menon.`,
        timestamp: now,
        language: targetLang,
        widgetType: 'ward_status',
        widgetData: { wards: WARDS },
        quickReplies: ['Check Patient Priya Vitals', 'Emergency ALS Ambulance Status', 'OPD Token Queue'],
      };
    }
  }

  // 10. Admin Assistant Role Features
  if (context.currentUser?.role === 'admin') {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: `🛡️ **MediCare 360 Hospital Administration Dashboard:**\n\n• **Total Registered Patients:** ${ADMIN_STATS.totalPatients.toLocaleString('en-IN')}\n• **Today's Appointments:** ${ADMIN_STATS.todayAppointments} (Completed: ${ADMIN_STATS.completedToday}, Cancelled: ${ADMIN_STATS.cancelledToday})\n• **Active Doctors On Duty:** ${ADMIN_STATS.activeDoctors} (${ADMIN_STATS.onLeave} on leave)\n• **Bed Occupancy Rate:** ${ADMIN_STATS.bedOccupancy}% (${ADMIN_STATS.totalBeds} total beds)\n• **Today's OPD / IPD Revenue:** ₹${ADMIN_STATS.revenue.toLocaleString('en-IN')}\n• **Pending Insurance Claims:** ${ADMIN_STATS.pendingClaims} claims`,
      timestamp: now,
      language: targetLang,
      widgetType: 'admin_summary',
      widgetData: { stats: ADMIN_STATS },
      quickReplies: ['Manage Doctor Roster', 'Audit Logs', 'Pending Insurance Claims'],
    };
  }

  // 11. Human Support Handover
  if (
    lower.includes('human') ||
    lower.includes('support') ||
    lower.includes('agent') ||
    lower.includes('reception') ||
    lower.includes('help desk') ||
    lower.includes('மனுதர்') ||
    lower.includes('உதவி மையம்') ||
    lower.includes('इंसान से बात')
  ) {
    let supportText = '';
    if (targetLang === 'ta') {
      supportText = `உங்களை எங்கள் மருத்துவமனை நேரடி உதவி மையத்துடன் (Hospital Front Desk) இணைக்கிறேன். உங்கள் கோரிக்கையை கீழே உள்ளீடு செய்தால், வரவேற்பு ஒருங்கிணைப்பாளர் சுரேஷ் பாபு உடனடியாக பதிலளிப்பார். அல்லது 044-2830-3600 என்ற எண்ணில் அழைக்கலாம்.`;
    } else if (targetLang === 'hi') {
      supportText = `मैं आपको हमारे अस्पताल फ्रंट डेस्क सहायता अधिकारी (सुरेश बाबू) से जोड़ रहा हूँ। कृपया अपना संदेश नीचे लिखें या हमें 044-2830-3600 पर कॉल करें।`;
    } else {
      supportText = `I can connect you directly with a hospital care coordinator. You can submit your inquiry below to escalate to front desk executive Suresh Babu, or call our 24/7 helpline at **044-2830-3600**.`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: supportText,
      timestamp: now,
      language: targetLang,
      widgetType: 'support_handoff',
      quickReplies: ['Call Reception (044-2830-3600)', 'Book Appointment', 'Back to Health FAQ'],
    };
  }

  // 12. General Hospital Information & FAQs
  if (
    lower.includes('timing') ||
    lower.includes('hours') ||
    lower.includes('location') ||
    lower.includes('address') ||
    lower.includes('phone') ||
    lower.includes('contact') ||
    lower.includes('நேரம்') ||
    lower.includes('முகவரி') ||
    lower.includes('समय') ||
    lower.includes('पता')
  ) {
    let info = '';
    if (targetLang === 'ta') {
      info = `🏥 **மெடிகேர் 360 மருத்துவமனை விவரங்கள்:**\n\n• **முகவரி:** 42, ஹெல்த் சிட்டி விரைவுச்சாலை, சென்னை - 600028\n• **அவசர சிகிச்சை & ஆம்புலன்ஸ்:** 24 மணி நேரமும் திறந்துள்ளது (அழைக்க: **108**)\n• **OPD வெளிநோயாளி பிரிவு:** காலை 8:00 மணி முதல் இரவு 8:00 மணி வரை (திங்கள் - சனி)\n• **மருந்தகம் & பரிசோதனையகம்:** 24/7 இயங்குகிறது\n• **தொடர்பு எண்:** 044-2830-3600`;
    } else if (targetLang === 'hi') {
      info = `🏥 **मेदिकेयर 360 अस्पताल की जानकारी:**\n\n• **पता:** 42, हेल्थ सिटी एक्सप्रेसवे, चेन्नई - 600028\n• **इमरजेंसी व एम्बुलेंस:** 24 घंटे सातों दिन खुला (कॉल करें: **108**)\n• **ओपीडी समय:** सुबह 8:00 बजे से रात 8:00 बजे तक\n• **फार्मेसी व लैब:** 24 घंटे उपलब्ध\n• **हेल्पलाइन:** 044-2830-3600`;
    } else {
      info = `🏥 **MediCare 360 Hospital Overview:**\n\n• **Location:** 42, Health City Expressway, Chennai, Tamil Nadu 600028\n• **Emergency & Ambulance SOS:** Open 24/7/365 (Call **108**)\n• **Outpatient (OPD) Hours:** 8:00 AM - 8:00 PM (Monday through Saturday)\n• **24/7 Inpatient, Pharmacy & Diagnostic Labs**\n• **Direct Reception:** 044-2830-3600 | **Email:** care@medicare360.com`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: info,
      timestamp: now,
      language: targetLang,
      quickReplies: ['Book an Appointment', 'Find a Doctor', 'Emergency SOS 108'],
    };
  }

  // 13. Try External Gemini / LLM if available
  const externalLLMReply = await tryCallExternalLLM(userQuery, context);
  if (externalLLMReply) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: externalLLMReply,
      timestamp: now,
      language: targetLang,
      quickReplies: ['Book an Appointment', 'Find a Doctor', 'Explain Medical Report'],
    };
  }

  // 14. Intelligent Fallback Health Awareness Responder
  let fallbackText = '';
  if (targetLang === 'ta') {
    fallbackText = `மெடிகேர் 360-ல் உங்களின் உடல்நலனைப் பேண நான் உதவ தயாராக உள்ளேன். நீங்கள் மருத்துவர் சந்திப்பு முன்பதிவு செய்ய, உங்கள் ஆய்வக அறிக்கைகள் அல்லது மருந்து சீட்டைப் பற்றி அறிய, அல்லது மருத்துவமனை சேவைகளைப் பற்றி கேட்கலாம்.\n\n_குறிப்பு: நான் ஒரு AI உதவியாளர். தீவிர உடல் உபாதைகளுக்கு எங்கள் மருத்துவரை நேரில் அணுகவும்._`;
  } else if (targetLang === 'hi') {
    fallbackText = `मेदिकेयर 360 में आपकी सहायता के लिए मैं उपस्थित हूँ। आप डॉक्टर अपॉइंटमेंट बुक कर सकते हैं, अपनी लैब रिपोर्ट व दवाइयों को समझ सकते हैं, या अस्पताल सेवाओं की जानकारी ले सकते हैं।\n\n_सलाह: मैं एक एआई सहायक हूँ। किसी भी गंभीर लक्षण के लिए डॉक्टर से अवश्य मिलें।_`;
  } else {
    fallbackText = `I am here to assist you with everything at MediCare 360! You can ask me to **book or manage doctor appointments**, explain your **prescriptions & lab reports**, check **cashless insurance policies**, or guide you through **OPD/IPD admission**.\n\n*Health Note: I am an AI assistant and not a replacement for a qualified doctor. For medical diagnosis or treatment plans, please consult our specialists.*`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'bot',
    text: fallbackText,
    timestamp: now,
    language: targetLang,
    quickReplies: [
      'Book an Appointment',
      'Find a Doctor',
      'Check My Appointment',
      'View Medical Reports',
      'Understand My Prescription',
    ],
  };
}
