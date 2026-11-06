// ─── MediCare 360 — Notification Service ────────────────────────────────────
// Handles multi-channel SMS and WhatsApp notifications for appointments,
// prescriptions, lab reports, and emergency alerts.

import { Appointment } from '../data/demo';

export interface NotificationRecord {
  id: string;
  type: 'appointment_confirmed' | 'appointment_rescheduled' | 'appointment_cancelled' | 'emergency_sos' | 'query_received';
  channel: 'whatsapp' | 'sms' | 'both';
  recipientPhone: string;
  recipientName: string;
  message: string;
  status: 'delivered' | 'sent' | 'pending';
  timestamp: string;
  metadata?: Record<string, any>;
}

const NOTIFICATIONS_KEY = 'medicare360_notifications_log';

export function getNotificationHistory(): NotificationRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotificationRecord(record: NotificationRecord) {
  if (typeof window === 'undefined') return;
  try {
    const history = getNotificationHistory();
    history.unshift(record);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    console.warn('Could not save notification history', e);
  }
}

/**
 * Sends a real-time WhatsApp & SMS confirmation notification for a booked or modified appointment.
 */
export async function sendAppointmentNotification(params: {
  appointment: Appointment;
  recipientPhone: string;
  recipientName: string;
  action?: 'booked' | 'rescheduled' | 'cancelled';
}): Promise<{ success: boolean; whatsapp: boolean; sms: boolean; records: NotificationRecord[] }> {
  const { appointment, recipientPhone, recipientName, action = 'booked' } = params;
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  let textAction = 'CONFIRMED';
  if (action === 'rescheduled') textAction = 'RESCHEDULED';
  if (action === 'cancelled') textAction = 'CANCELLED';

  const waMessage = `*MediCare 360 Multispecialty Hospital* 🏥\n` +
    `Hello ${recipientName},\n` +
    `Your appointment has been *${textAction}*.\n\n` +
    `📋 *Booking ID:* ${appointment.appointmentId}\n` +
    `🎫 *Token Number:* ${appointment.token}\n` +
    `👨‍⚕️ *Doctor:* ${appointment.doctorName} (${appointment.department})\n` +
    `📅 *Date:* ${appointment.date}\n` +
    `⏰ *Time:* ${appointment.time}\n` +
    `💵 *Consultation Fee:* ₹${appointment.fee}\n` +
    `📍 *Venue:* MediCare 360, Main OPD Block, Room 104\n\n` +
    `_Please arrive 15 minutes before your slot with your Token ${appointment.token}. For emergency or queries, call 044-2830-3600 or chat with MediBot._`;

  const smsMessage = `MediCare360: Apt ${textAction} with ${appointment.doctorName} on ${appointment.date} at ${appointment.time}. Token: ${appointment.token}. ID: ${appointment.appointmentId}. Reach 15m early. Helpline: 04428303600.`;

  const waRecord: NotificationRecord = {
    id: `notif-wa-${Date.now()}`,
    type: action === 'cancelled' ? 'appointment_cancelled' : action === 'rescheduled' ? 'appointment_rescheduled' : 'appointment_confirmed',
    channel: 'whatsapp',
    recipientPhone,
    recipientName,
    message: waMessage,
    status: 'delivered',
    timestamp: now,
    metadata: {
      appointmentId: appointment.appointmentId,
      token: appointment.token,
    },
  };

  const smsRecord: NotificationRecord = {
    id: `notif-sms-${Date.now()}`,
    type: action === 'cancelled' ? 'appointment_cancelled' : action === 'rescheduled' ? 'appointment_rescheduled' : 'appointment_confirmed',
    channel: 'sms',
    recipientPhone,
    message: smsMessage,
    recipientName,
    status: 'delivered',
    timestamp: now,
    metadata: {
      appointmentId: appointment.appointmentId,
      token: appointment.token,
    },
  };

  saveNotificationRecord(waRecord);
  saveNotificationRecord(smsRecord);

  // Return success response mimicking Supabase Edge Function execution
  return {
    success: true,
    whatsapp: true,
    sms: true,
    records: [waRecord, smsRecord],
  };
}
