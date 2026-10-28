// Starter server-side function outline.
// Add provider-specific WhatsApp/SMS API calls, input validation, idempotency,
// consent checks, delivery status persistence, and audit logging before enabling.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  // TODO:
  // 1. Verify the caller and authorize access to the appointment.
  // 2. Validate appointment ID and notification consent.
  // 3. Load minimum necessary appointment details server-side.
  // 4. Send approved WhatsApp template and/or SMS using secrets.
  // 5. Persist provider response and delivery status.
  // 6. Never log secrets or sensitive medical details.

  return new Response(JSON.stringify({
    status: 'not_configured',
    message: 'Configure and implement a messaging provider before sending notifications.',
  }), {
    status: 501,
    headers: { 'content-type': 'application/json' },
  });
});
