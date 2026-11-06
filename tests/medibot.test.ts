import { describe, it, expect } from 'vitest';
import {
  detectEmergency,
  detectLanguage,
  processUserMessage,
} from '../src/services/aiChatService';
import {
  getStoredAppointments,
  addAppointment,
  cancelAppointment,
  rescheduleAppointment,
  createPatientQuery,
} from '../src/services/hospitalDataStore';
import { sendAppointmentNotification } from '../src/services/notificationService';
import { DEMO_USERS } from '../src/data/demo';

describe('MediBot AI Medical Assistant Tests', () => {
  it('should detect medical emergencies accurately across English, Tamil, and Hindi', () => {
    // English emergencies
    expect(detectEmergency('Patient is having severe chest pain and cannot breathe')).toBe(true);
    expect(detectEmergency('I feel dizzy and might have a stroke')).toBe(true);
    expect(detectEmergency('Severe bleeding from head trauma')).toBe(true);
    // Tamil emergencies
    expect(detectEmergency('எனக்கு கடுமையான நெஞ்சு வலி உள்ளது')).toBe(true);
    expect(detectEmergency('நோயாளிக்கு மூச்சுத்திணறல் ஏற்படுகிறது')).toBe(true);
    // Hindi emergencies
    expect(detectEmergency('मरीज के सीने में दर्द हो रहा है और सांस लेने में तकलीफ है')).toBe(true);
    expect(detectEmergency('वह अचानक बेहोश हो गया')).toBe(true);

    // Non-emergencies
    expect(detectEmergency('I want to schedule an appointment with Dr. Ramesh')).toBe(false);
    expect(detectEmergency('What are the hospital timings for OPD?')).toBe(false);
  });

  it('should auto-detect Tamil and Hindi languages', () => {
    expect(detectLanguage('வணக்கம் டாக்டர்')).toBe('ta');
    expect(detectLanguage('नमस्ते, मुझे अपॉइंटमेंट चाहिए')).toBe('hi');
    expect(detectLanguage('Hello, what are your consultation fees?')).toBe('en');
  });

  it('should trigger priority emergency alert message on critical symptoms', async () => {
    const context = {
      currentUser: null,
      role: null,
      currentPath: '/',
      preferredLanguage: 'en' as const,
    };
    const response = await processUserMessage('I am feeling intense chest pain and left arm numbness', context);
    expect(response.isEmergency).toBe(true);
    expect(response.text).toContain('108');
    expect(response.text).toContain('Emergency');
  });

  it('should guide through conversational appointment booking', async () => {
    const context = {
      currentUser: DEMO_USERS[0],
      role: 'patient' as const,
      currentPath: '/patient/dashboard',
      preferredLanguage: 'en' as const,
    };
    const response = await processUserMessage('I want to book an appointment with a cardiologist', context);
    expect(response.widgetType).toBe('appointment_flow');
    expect(response.widgetData?.step).toBe('select_department');
  });

  it('should provide dynamic appointment booking, token assignment, and cancellation in store', () => {
    const initialCount = getStoredAppointments().length;
    const newApt = addAppointment({
      patientId: 'pat-001',
      patientName: 'Dinesh Karthick',
      doctorId: 'doc-002',
      doctorName: 'Dr. Anitha Rajan',
      department: 'Cardiology',
      date: '2026-11-04',
      time: '10:30 AM',
      type: 'New Consultation',
      status: 'Confirmed',
      fee: 1200,
      paid: true,
    });

    expect(newApt.id).toBeDefined();
    expect(newApt.appointmentId).toContain('MED-2026-');
    expect(newApt.token).toMatch(/^A\d{3}$/);
    expect(getStoredAppointments().length).toBe(initialCount + 1);

    // Reschedule
    const rescheduled = rescheduleAppointment(newApt.appointmentId, '2026-11-06', '02:30 PM');
    expect(rescheduled?.date).toBe('2026-11-06');
    expect(rescheduled?.time).toBe('02:30 PM');

    // Cancel
    const cancelled = cancelAppointment(newApt.appointmentId, 'Patient requested');
    expect(cancelled).toBe(true);
    const inStore = getStoredAppointments().find(a => a.appointmentId === newApt.appointmentId);
    expect(inStore?.status).toBe('Cancelled');
  });

  it('should dispatch WhatsApp and SMS notification records for appointments', async () => {
    const apt = getStoredAppointments()[0];
    const notifResult = await sendAppointmentNotification({
      appointment: apt,
      recipientPhone: '+91 98765 43210',
      recipientName: 'Dinesh Karthick',
      action: 'booked',
    });

    expect(notifResult.success).toBe(true);
    expect(notifResult.whatsapp).toBe(true);
    expect(notifResult.sms).toBe(true);
    expect(notifResult.records.length).toBe(2);
    expect(notifResult.records[0].message).toContain(apt.token);
  });

  it('should allow human support escalation by generating tracked patient query', () => {
    const query = createPatientQuery({
      patientId: 'pat-001',
      patientName: 'Dinesh Karthick',
      category: 'Billing',
      subject: 'Insurance pre-authorization for MRI',
      message: 'Need help with cashless coverage for my brain scan.',
    });

    expect(query.queryRef).toContain('QRY-2026-');
    expect(query.assignedTo).toContain('Suresh Babu');
    expect(query.status).toBe('Open');
  });
});
