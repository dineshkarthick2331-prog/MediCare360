export type AppRole = 'patient' | 'doctor' | 'nurse' | 'staff' | 'admin';
export type LanguageCode = 'en' | 'ta' | 'hi';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'waiting'
  | 'in_consultation'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'no_show';

export interface AppointmentSummary {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  startsAt: string;
  status: AppointmentStatus;
  tokenNumber?: string;
}

export type NotificationStatus = 'queued' | 'sent' | 'delivered' | 'failed' | 'not_configured';
