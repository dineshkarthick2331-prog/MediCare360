// ─── MediCare 360 — Dynamic Hospital Data Store ──────────────────────────────
// Synchronizes appointments, queries, prescriptions, and audit logs between
// the website UI and MediBot AI Assistant with real-time localStorage persistence.

import {
  APPOINTMENTS as INITIAL_APPOINTMENTS,
  Appointment,
  QUERIES as INITIAL_QUERIES,
  PatientQuery,
  PRESCRIPTIONS as INITIAL_PRESCRIPTIONS,
  Prescription,
  DOCTORS,
  WARDS,
  ADMIN_STATS,
  Role,
} from '../data/demo';

const STORAGE_KEYS = {
  APPOINTMENTS: 'medicare360_live_appointments',
  QUERIES: 'medicare360_live_queries',
  PRESCRIPTIONS: 'medicare360_live_prescriptions',
  AUDIT_LOGS: 'medicare360_audit_logs',
};

export const DATA_UPDATE_EVENT = 'medicare360_data_updated';

// Helper to notify listeners
function emitUpdate(detailType: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATA_UPDATE_EVENT, { detail: { type: detailType } }));
  }
}

// ─── Appointments Store ──────────────────────────────────────────────────────

export function getStoredAppointments(): Appointment[] {
  if (typeof window === 'undefined') return INITIAL_APPOINTMENTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load appointments from localStorage', e);
  }
  return INITIAL_APPOINTMENTS;
}

export function saveAppointments(appointments: Appointment[]): void {
  INITIAL_APPOINTMENTS.length = 0;
  INITIAL_APPOINTMENTS.push(...appointments);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch { /* ignore */ }
    emitUpdate('appointments');
  }
}

export function addAppointment(newApt: Omit<Appointment, 'id' | 'appointmentId' | 'token'>): Appointment {
  const current = getStoredAppointments();
  const tokenNum = (current.length + 12).toString().padStart(3, '0');
  const token = `A${tokenNum.slice(-3)}`;
  const appointmentId = `MED-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const id = `apt-${Date.now()}`;

  const createdAppointment: Appointment = {
    ...newApt,
    id,
    appointmentId,
    token,
  };

  const updated = [createdAppointment, ...current];
  saveAppointments(updated);
  logAuditEvent('APPOINTMENT_BOOKED', `Booked appointment ${appointmentId} with ${newApt.doctorName}`, newApt.patientId);
  return createdAppointment;
}

export function cancelAppointment(appointmentId: string, reason?: string): boolean {
  const current = getStoredAppointments();
  const index = current.findIndex(a => a.appointmentId === appointmentId || a.id === appointmentId);
  if (index === -1) return false;

  current[index] = {
    ...current[index],
    status: 'Cancelled',
    notes: reason ? `Cancelled: ${reason}` : 'Cancelled by patient via MediBot',
  };

  saveAppointments([...current]);
  logAuditEvent('APPOINTMENT_CANCELLED', `Cancelled appointment ${appointmentId}`, current[index].patientId);
  return true;
}

export function rescheduleAppointment(appointmentId: string, newDate: string, newTime: string): Appointment | null {
  const current = getStoredAppointments();
  const index = current.findIndex(a => a.appointmentId === appointmentId || a.id === appointmentId);
  if (index === -1) return null;

  current[index] = {
    ...current[index],
    date: newDate,
    time: newTime,
    status: 'Confirmed',
    notes: `Rescheduled to ${newDate} at ${newTime}`,
  };

  saveAppointments([...current]);
  logAuditEvent('APPOINTMENT_RESCHEDULED', `Rescheduled appointment ${appointmentId} to ${newDate} ${newTime}`, current[index].patientId);
  return current[index];
}

// ─── Queries & Human Support Store ───────────────────────────────────────────

export function getStoredQueries(): PatientQuery[] {
  if (typeof window === 'undefined') return INITIAL_QUERIES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUERIES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load queries from localStorage', e);
  }
  return INITIAL_QUERIES;
}

export function saveQueries(queries: PatientQuery[]): void {
  INITIAL_QUERIES.length = 0;
  INITIAL_QUERIES.push(...queries);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(queries));
    } catch { /* ignore */ }
    emitUpdate('queries');
  }
}

export function createPatientQuery(params: {
  patientId: string;
  patientName: string;
  category: 'Appointment' | 'Billing' | 'Insurance' | 'Report' | 'General' | 'Complaint';
  subject: string;
  message: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
}): PatientQuery {
  const current = getStoredQueries();
  const queryRef = `QRY-2026-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

  const newQuery: PatientQuery = {
    id: `qry-${Date.now()}`,
    queryRef,
    patientId: params.patientId,
    patientName: params.patientName,
    category: params.category,
    subject: params.subject,
    message: params.message,
    status: 'Open',
    priority: params.priority || 'Medium',
    createdAt: now,
    updatedAt: now,
    assignedTo: 'Suresh Babu (Patient Support Desk)',
    responses: [
      {
        from: 'MediBot AI Support',
        message: 'Your query has been escalated to our human hospital coordinator. Front desk staff Suresh Babu will review and reply within 15 minutes.',
        date: now,
        isStaff: true,
      },
    ],
  };

  const updated = [newQuery, ...current];
  saveQueries(updated);
  logAuditEvent('QUERY_CREATED', `Created patient query ${queryRef}: ${params.subject}`, params.patientId);
  return newQuery;
}

// ─── Prescriptions Store ─────────────────────────────────────────────────────

export function getStoredPrescriptions(): Prescription[] {
  if (typeof window === 'undefined') return INITIAL_PRESCRIPTIONS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load prescriptions from localStorage', e);
  }
  return INITIAL_PRESCRIPTIONS;
}

export function addPrescription(prescription: Omit<Prescription, 'id'>): Prescription {
  const current = getStoredPrescriptions();
  const newRx: Prescription = {
    ...prescription,
    id: `rx-${Date.now()}`,
  };

  const updated = [newRx, ...current];
  INITIAL_PRESCRIPTIONS.length = 0;
  INITIAL_PRESCRIPTIONS.push(...updated);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(updated));
    } catch { /* ignore */ }
    emitUpdate('prescriptions');
  }
  logAuditEvent('PRESCRIPTION_CREATED', `Doctor created prescription for ${prescription.diagnosis}`, prescription.patientId);
  return newRx;
}

// ─── Audit Logging ───────────────────────────────────────────────────────────

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  userId?: string;
  timestamp: string;
}

export function logAuditEvent(action: string, details: string, userId?: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs: AuditLogItem[] = raw ? JSON.parse(raw) : [];
    logs.unshift({
      id: `log-${Date.now()}`,
      action,
      details,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
    });
    // Keep last 100 audit entries
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.warn('Failed to record audit log', e);
  }
}

// Initial sync on module load
if (typeof window !== 'undefined') {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        INITIAL_APPOINTMENTS.length = 0;
        INITIAL_APPOINTMENTS.push(...parsed);
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    }
  } catch (e) {
    /* ignore */
  }
}
