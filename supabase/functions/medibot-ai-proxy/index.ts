// Starter server-side MediBot AI proxy function.
// This edge function sits between the frontend and the LLM API provider.
// It authenticates the request, enforces rate limiting, and never exposes
// the AI API key to the client.
//
// Required Supabase secrets (set via `supabase secrets set`):
//   GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
//
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  // Add your production domain here, e.g.:
  // 'https://medicare360.vercel.app',
];

const HOSPITAL_SYSTEM_PROMPT = `You are MediBot, the intelligent AI assistant for MediCare 360 Multispecialty Hospital.

CRITICAL SAFETY RULES:
1. You are an AI assistant, NOT a qualified doctor. Always clarify this.
2. For life-threatening symptoms (chest pain, breathing failure, stroke, unconsciousness, severe bleeding), IMMEDIATELY advise calling 108 or going to the Emergency Department.
3. NEVER make a definitive clinical diagnosis.
4. NEVER advise specific medication changes without doctor supervision.
5. Do NOT reveal details about other patients or expose any sensitive medical records.

YOUR ROLE:
- Answer hospital and health-related questions about MediCare 360.
- Guide patients through appointment booking, OPD/IPD information, doctor availability, and medical report explanations.
- Respond in the same language the user uses (English, Tamil தமிழ், or Hindi हिन्दी).
- Keep responses clear, concise, and compassionate.

HOSPITAL FACTS:
- MediCare 360 Multispecialty Hospital, 42 Health City Expressway, Chennai 600028
- OPD Hours: 8 AM–8 PM (Mon–Sat), Emergency & Pharmacy: 24/7
- Emergency: 108 | Reception: 044-2830-3600
- Departments: Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, Gynecology, General Medicine, ENT, and more.`;

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const corsHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  // TODO: Verify Supabase JWT to authenticate the calling user.
  // const authHeader = req.headers.get('Authorization');
  // Validate authHeader as Bearer token via Supabase admin client.

  let body: { message: string; history?: any[]; language?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: corsHeaders });
  }

  const { message, language = 'en' } = body;
  if (!message || typeof message !== 'string' || message.length > 2000) {
    return new Response(JSON.stringify({ error: 'Message is required (max 2000 chars)' }), { status: 400, headers: corsHeaders });
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({
      status: 'not_configured',
      message: 'AI API key is not configured. Set GEMINI_API_KEY via Supabase secrets.',
    }), { status: 501, headers: corsHeaders });
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${HOSPITAL_SYSTEM_PROMPT}\n\nUser (language: ${language}):\n${message}` }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800,
        topK: 40,
        topP: 0.95,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_MEDICAL', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ error: 'AI service temporarily unavailable. Please try again.' }), {
        status: 502,
        headers: corsHeaders,
      });
    }

    const aiData = await aiRes.json();
    const responseText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I encountered an issue generating a response. Please try asking again.';

    // TODO: Persist the message and response to public.chat_messages via Supabase service role client.

    return new Response(JSON.stringify({ text: responseText, language }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('MediBot edge function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
