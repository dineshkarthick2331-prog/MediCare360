// ─── MediCare 360 — Demo Data (fictional, for testing only) ───────────────────

export type Role = 'patient' | 'doctor' | 'nurse' | 'staff' | 'admin';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  department?: string;
  specialization?: string;
  phone?: string;
  patientId?: string;
}

export const DEMO_USERS: DemoUser[] = [
  { id: 'pat-001', name: 'Dinesh Karthick', email: 'patient@demo.com', password: 'demo1234', role: 'patient', avatar: '👨', phone: '+91 98765 43210', patientId: 'MED-PAT-001' },
  { id: 'pat-002', name: 'Priya Sharma', email: 'priya@demo.com', password: 'demo1234', role: 'patient', avatar: '👩', phone: '+91 87654 32109', patientId: 'MED-PAT-002' },
  { id: 'doc-001', name: 'Dr. Ramesh Kumar', email: 'doctor@demo.com', password: 'demo1234', role: 'doctor', avatar: '👨‍⚕️', department: 'General Medicine', specialization: 'General Physician' },
  { id: 'doc-002', name: 'Dr. Anitha Rajan', email: 'anitha@demo.com', password: 'demo1234', role: 'doctor', avatar: '👩‍⚕️', department: 'Cardiology', specialization: 'Cardiologist' },
  { id: 'nur-001', name: 'Meena Lakshmi', email: 'nurse@demo.com', password: 'demo1234', role: 'nurse', avatar: '👩‍⚕️', department: 'General Ward' },
  { id: 'stf-001', name: 'Suresh Babu', email: 'staff@demo.com', password: 'demo1234', role: 'staff', avatar: '👨‍💼', department: 'Reception' },
  { id: 'adm-001', name: 'Admin User', email: 'admin@demo.com', password: 'demo1234', role: 'admin', avatar: '🛡️' },
];

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  qualification: string;
  experience: number;
  fee: number;
  rating: number;
  reviews: number;
  languages: string[];
  avatar: string;
  available: boolean;
  nextAvailable: string;
  about: string;
}

export const DOCTORS: Doctor[] = [
  { id: 'doc-001', name: 'Dr. Ramesh Kumar', specialty: 'General Physician', department: 'General Medicine', qualification: 'MBBS, MD', experience: 15, fee: 500, rating: 4.8, reviews: 312, languages: ['English', 'Tamil', 'Hindi'], avatar: '👨‍⚕️', available: true, nextAvailable: 'Today', about: 'Senior physician with 15 years of experience in internal medicine and preventive care.' },
  { id: 'doc-002', name: 'Dr. Anitha Rajan', specialty: 'Cardiologist', department: 'Cardiology', qualification: 'MBBS, MD, DM Cardiology', experience: 12, fee: 1200, rating: 4.9, reviews: 245, languages: ['English', 'Tamil'], avatar: '👩‍⚕️', available: true, nextAvailable: 'Today', about: 'Expert cardiologist specializing in interventional cardiology and heart failure management.' },
  { id: 'doc-003', name: 'Dr. Vijay Mohan', specialty: 'Orthopedic Surgeon', department: 'Orthopedics', qualification: 'MBBS, MS Ortho', experience: 18, fee: 1000, rating: 4.7, reviews: 198, languages: ['English', 'Tamil', 'Telugu'], avatar: '👨‍⚕️', available: false, nextAvailable: 'Tomorrow', about: 'Specialized in joint replacement surgeries and sports injuries.' },
  { id: 'doc-004', name: 'Dr. Kavitha Nair', specialty: 'Dermatologist', department: 'Dermatology', qualification: 'MBBS, MD Dermatology', experience: 10, fee: 800, rating: 4.6, reviews: 167, languages: ['English', 'Malayalam', 'Tamil'], avatar: '👩‍⚕️', available: true, nextAvailable: 'Today', about: 'Expert in skin disorders, cosmetology, and laser treatments.' },
  { id: 'doc-005', name: 'Dr. Suresh Pandian', specialty: 'Neurologist', department: 'Neurology', qualification: 'MBBS, MD, DM Neurology', experience: 20, fee: 1500, rating: 4.9, reviews: 289, languages: ['English', 'Tamil'], avatar: '👨‍⚕️', available: true, nextAvailable: 'Today', about: 'Senior neurologist with expertise in stroke management and neurodegenerative disorders.' },
  { id: 'doc-006', name: 'Dr. Lalitha Menon', specialty: 'Gynecologist', department: 'Gynecology & Obstetrics', qualification: 'MBBS, MS OBG', experience: 14, fee: 900, rating: 4.8, reviews: 234, languages: ['English', 'Tamil', 'Malayalam'], avatar: '👩‍⚕️', available: true, nextAvailable: 'Today', about: 'Specialist in high-risk pregnancies and laparoscopic gynecological surgeries.' },
  { id: 'doc-007', name: 'Dr. Arun Prakash', specialty: 'Pediatrician', department: 'Pediatrics', qualification: 'MBBS, MD Pediatrics', experience: 11, fee: 700, rating: 4.7, reviews: 321, languages: ['English', 'Tamil'], avatar: '👨‍⚕️', available: true, nextAvailable: 'Today', about: 'Dedicated to child health and development with special interest in neonatal care.' },
  { id: 'doc-008', name: 'Dr. Deepa Krishnan', specialty: 'ENT Specialist', department: 'ENT', qualification: 'MBBS, MS ENT', experience: 9, fee: 750, rating: 4.5, reviews: 143, languages: ['English', 'Tamil'], avatar: '👩‍⚕️', available: false, nextAvailable: 'Day after tomorrow', about: 'Specialist in ear, nose and throat disorders including cochlear implants.' },
];

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  token: string;
  type: 'New Consultation' | 'Follow-up' | 'Emergency';
  status: 'Confirmed' | 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No-show' | 'Pending';
  fee: number;
  paid: boolean;
  notes?: string;
  appointmentId: string;
}

export const APPOINTMENTS: Appointment[] = [
  { id: 'apt-001', patientId: 'pat-001', patientName: 'Dinesh Karthick', doctorId: 'doc-001', doctorName: 'Dr. Ramesh Kumar', department: 'General Medicine', date: '2026-10-28', time: '10:30 AM', token: 'A012', type: 'New Consultation', status: 'Confirmed', fee: 500, paid: true, appointmentId: 'MED-2026-00125' },
  { id: 'apt-002', patientId: 'pat-001', patientName: 'Dinesh Karthick', doctorId: 'doc-002', doctorName: 'Dr. Anitha Rajan', department: 'Cardiology', date: '2026-10-15', time: '11:00 AM', token: 'C005', type: 'Follow-up', status: 'Completed', fee: 1200, paid: true, appointmentId: 'MED-2026-00098' },
  { id: 'apt-003', patientId: 'pat-001', patientName: 'Dinesh Karthick', doctorId: 'doc-005', doctorName: 'Dr. Suresh Pandian', department: 'Neurology', date: '2026-11-05', time: '09:00 AM', token: 'N003', type: 'New Consultation', status: 'Confirmed', fee: 1500, paid: false, appointmentId: 'MED-2026-00142' },
  { id: 'apt-004', patientId: 'pat-002', patientName: 'Priya Sharma', doctorId: 'doc-006', doctorName: 'Dr. Lalitha Menon', department: 'Gynecology', date: '2026-10-28', time: '02:30 PM', token: 'G008', type: 'Follow-up', status: 'Waiting', fee: 900, paid: true, appointmentId: 'MED-2026-00126' },
  { id: 'apt-005', patientId: 'pat-002', patientName: 'Priya Sharma', doctorId: 'doc-001', doctorName: 'Dr. Ramesh Kumar', department: 'General Medicine', date: '2026-10-28', time: '11:00 AM', token: 'A015', type: 'New Consultation', status: 'In Consultation', fee: 500, paid: true, appointmentId: 'MED-2026-00127' },
];

export interface QueueItem {
  token: string;
  patientName: string;
  status: 'waiting' | 'current' | 'done' | 'my-turn';
  estimatedTime?: string;
}

export const QUEUE: QueueItem[] = [
  { token: 'A001', patientName: 'Patient 1', status: 'done' },
  { token: 'A002', patientName: 'Patient 2', status: 'done' },
  { token: 'A003', patientName: 'Patient 3', status: 'done' },
  { token: 'A004', patientName: 'Patient 4', status: 'done' },
  { token: 'A005', patientName: 'Patient 5', status: 'done' },
  { token: 'A006', patientName: 'Patient 6', status: 'done' },
  { token: 'A007', patientName: 'Patient 7', status: 'done' },
  { token: 'A008', patientName: 'Patient 8', status: 'done' },
  { token: 'A009', patientName: 'Patient 9', status: 'done' },
  { token: 'A010', patientName: 'Patient 10', status: 'done' },
  { token: 'A011', patientName: 'Patient 11', status: 'current' },
  { token: 'A012', patientName: 'Dinesh Karthick', status: 'my-turn', estimatedTime: '~15 min' },
  { token: 'A013', patientName: 'Patient 13', status: 'waiting', estimatedTime: '~25 min' },
  { token: 'A014', patientName: 'Patient 14', status: 'waiting', estimatedTime: '~35 min' },
  { token: 'A015', patientName: 'Priya Sharma', status: 'waiting', estimatedTime: '~45 min' },
];

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMed[];
  notes: string;
  followUp?: string;
  signed: boolean;
}

export interface PrescriptionMed {
  name: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export const PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-001', patientId: 'pat-001', doctorId: 'doc-001', doctorName: 'Dr. Ramesh Kumar',
    date: '2026-10-15', diagnosis: 'Viral Upper Respiratory Tract Infection',
    signed: true, followUp: '2026-10-28',
    notes: 'Take rest, drink plenty of fluids. Avoid cold drinks and oily food.',
    medicines: [
      { name: 'Tab. Paracetamol', strength: '500 mg', dosage: '1 tab', frequency: 'TID (3 times/day)', duration: '5 days', instructions: 'After food' },
      { name: 'Tab. Cetirizine', strength: '10 mg', dosage: '1 tab', frequency: 'OD (at night)', duration: '5 days', instructions: 'Before bed' },
      { name: 'Syp. Ambroxol', strength: '30 mg/5ml', dosage: '5 ml', frequency: 'TID', duration: '5 days', instructions: 'After food' },
      { name: 'Tab. Azithromycin', strength: '500 mg', dosage: '1 tab', frequency: 'OD', duration: '3 days', instructions: 'After food, complete the course' },
    ]
  },
  {
    id: 'rx-002', patientId: 'pat-001', doctorId: 'doc-002', doctorName: 'Dr. Anitha Rajan',
    date: '2026-10-15', diagnosis: 'Hypertension — Stage 1',
    signed: true, followUp: '2026-11-15',
    notes: 'Monitor BP daily. Reduce salt intake. Regular walks for 30 min/day.',
    medicines: [
      { name: 'Tab. Amlodipine', strength: '5 mg', dosage: '1 tab', frequency: 'OD (morning)', duration: '30 days', instructions: 'Before food' },
      { name: 'Tab. Telmisartan', strength: '40 mg', dosage: '1 tab', frequency: 'OD', duration: '30 days', instructions: 'Before food' },
    ]
  },
];

export interface LabReport {
  id: string;
  patientId: string;
  name: string;
  type: 'Blood' | 'Urine' | 'ECG' | 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound' | 'Pathology' | 'Other';
  orderedBy: string;
  date: string;
  lab: string;
  status: 'Ordered' | 'In Progress' | 'Completed' | 'Reviewed';
  findings?: string;
  normalRange?: string;
}

export const LAB_REPORTS: LabReport[] = [
  { id: 'rep-001', patientId: 'pat-001', name: 'Complete Blood Count (CBC)', type: 'Blood', orderedBy: 'Dr. Ramesh Kumar', date: '2026-10-14', lab: 'Pathology Lab', status: 'Reviewed', findings: 'Hb: 13.2 g/dL, WBC: 9,800/μL (slightly elevated), Platelets: 2.1 lacs/μL. Mild leukocytosis — consistent with viral infection.', normalRange: 'Hb: 12-17 g/dL, WBC: 4-11 × 10³/μL' },
  { id: 'rep-002', patientId: 'pat-001', name: 'Chest X-Ray PA View', type: 'X-Ray', orderedBy: 'Dr. Anitha Rajan', date: '2026-10-15', lab: 'Radiology', status: 'Reviewed', findings: 'Lungs are clear. Heart size normal. No pleural effusion. No active cardiopulmonary lesion.' },
  { id: 'rep-003', patientId: 'pat-001', name: 'Fasting Blood Glucose', type: 'Blood', orderedBy: 'Dr. Ramesh Kumar', date: '2026-10-14', lab: 'Biochemistry Lab', status: 'Reviewed', findings: '98 mg/dL — Within normal range.', normalRange: '70–100 mg/dL' },
  { id: 'rep-004', patientId: 'pat-001', name: 'ECG 12-Lead', type: 'ECG', orderedBy: 'Dr. Anitha Rajan', date: '2026-10-15', lab: 'Cardiology Lab', status: 'Reviewed', findings: 'Normal sinus rhythm. Rate: 74 bpm. No significant ST-T changes. No arrhythmia.' },
  { id: 'rep-005', patientId: 'pat-001', name: 'Urine Routine Examination', type: 'Urine', orderedBy: 'Dr. Ramesh Kumar', date: '2026-10-14', lab: 'Pathology Lab', status: 'Completed', findings: 'Colour: Yellow, pH: 6.0, Protein: Nil, Sugar: Nil, RBCs: Nil, WBCs: 0-2/HPF.' },
  { id: 'rep-006', patientId: 'pat-001', name: 'MRI Brain with Contrast', type: 'MRI', orderedBy: 'Dr. Suresh Pandian', date: '2026-11-03', lab: 'Imaging Centre', status: 'Ordered' },
];

export interface Invoice {
  id: string;
  billNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  visitType: 'OPD' | 'IPD';
  items: InvoiceItem[];
  discount: number;
  tax: number;
  insuranceCoverage: number;
  amountPaid: number;
  status: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Refunded';
}

export interface InvoiceItem {
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
}

export const INVOICES: Invoice[] = [
  {
    id: 'inv-001', billNumber: 'BILL-2026-0125', patientId: 'pat-001', patientName: 'Dinesh Karthick',
    date: '2026-10-15', visitType: 'OPD',
    items: [
      { description: 'Consultation — Dr. Ramesh Kumar', category: 'Consultation', quantity: 1, unitPrice: 500 },
      { description: 'Consultation — Dr. Anitha Rajan', category: 'Consultation', quantity: 1, unitPrice: 1200 },
      { description: 'Complete Blood Count (CBC)', category: 'Laboratory', quantity: 1, unitPrice: 350 },
      { description: 'Fasting Blood Glucose', category: 'Laboratory', quantity: 1, unitPrice: 120 },
      { description: 'Chest X-Ray PA View', category: 'Imaging', quantity: 1, unitPrice: 450 },
      { description: 'ECG 12-Lead', category: 'Imaging', quantity: 1, unitPrice: 300 },
    ],
    discount: 0, tax: 0, insuranceCoverage: 0, amountPaid: 2920, status: 'Paid',
  },
  {
    id: 'inv-002', billNumber: 'BILL-2026-0126', patientId: 'pat-001', patientName: 'Dinesh Karthick',
    date: '2026-10-28', visitType: 'OPD',
    items: [
      { description: 'Consultation — Dr. Ramesh Kumar', category: 'Consultation', quantity: 1, unitPrice: 500 },
    ],
    discount: 0, tax: 0, insuranceCoverage: 0, amountPaid: 500, status: 'Paid',
  },
  {
    id: 'inv-003', billNumber: 'BILL-2026-0127', patientId: 'pat-001', patientName: 'Dinesh Karthick',
    date: '2026-11-05', visitType: 'OPD',
    items: [
      { description: 'Consultation — Dr. Suresh Pandian', category: 'Consultation', quantity: 1, unitPrice: 1500 },
      { description: 'MRI Brain with Contrast', category: 'Imaging', quantity: 1, unitPrice: 8500 },
    ],
    discount: 500, tax: 0, insuranceCoverage: 4000, amountPaid: 0, status: 'Unpaid',
  },
];

export interface InsurancePolicy {
  id: string;
  patientId: string;
  insurer: string;
  policyNumber: string;
  holderName: string;
  validFrom: string;
  validTo: string;
  coverageLimit: number;
  usedAmount: number;
  cashlessEligible: boolean;
  status: 'Active' | 'Expired' | 'Suspended';
  claims: InsuranceClaim[];
}

export interface InsuranceClaim {
  claimRef: string;
  date: string;
  amount: number;
  approvedAmount: number;
  status: 'Submitted' | 'Pending' | 'Approved' | 'Rejected' | 'Settled';
  description: string;
}

export const INSURANCE: InsurancePolicy[] = [
  {
    id: 'ins-001', patientId: 'pat-001', insurer: 'Star Health Insurance', policyNumber: 'STAR-2024-78920',
    holderName: 'Dinesh Karthick', validFrom: '2026-04-01', validTo: '2027-03-31',
    coverageLimit: 500000, usedAmount: 48000, cashlessEligible: true, status: 'Active',
    claims: [
      { claimRef: 'CLM-2026-001', date: '2026-07-15', amount: 48000, approvedAmount: 45000, status: 'Settled', description: 'Hospitalization — Dengue fever' },
      { claimRef: 'CLM-2026-002', date: '2026-11-05', amount: 10000, approvedAmount: 4000, status: 'Pending', description: 'MRI Brain + Neurologist consultation' },
    ]
  }
];

export interface Admission {
  id: string;
  admissionNumber: string;
  patientId: string;
  patientName: string;
  admittingDoctor: string;
  department: string;
  ward: string;
  bedNumber: string;
  admissionDate: string;
  dischargeDate?: string;
  diagnosis: string;
  status: 'Admitted' | 'Discharged' | 'ICU Transfer';
}

export const ADMISSIONS: Admission[] = [
  { id: 'adm-001', admissionNumber: 'IPD-2026-045', patientId: 'pat-002', patientName: 'Priya Sharma', admittingDoctor: 'Dr. Lalitha Menon', department: 'Gynecology', ward: 'Maternity Ward', bedNumber: 'MW-204', admissionDate: '2026-10-25', diagnosis: 'Antenatal care — 36 weeks gestation', status: 'Admitted' },
  { id: 'adm-002', admissionNumber: 'IPD-2026-038', patientId: 'pat-001', patientName: 'Dinesh Karthick', admittingDoctor: 'Dr. Ramesh Kumar', department: 'General Medicine', ward: 'General Ward A', bedNumber: 'GWA-012', admissionDate: '2026-07-10', dischargeDate: '2026-07-17', diagnosis: 'Dengue fever with thrombocytopenia', status: 'Discharged' },
];

export interface NursingObservation {
  id: string;
  patientId: string;
  admissionId: string;
  nurseId: string;
  nurseName: string;
  date: string;
  time: string;
  temperature: string;
  bloodPressure: string;
  pulse: string;
  oxygen: string;
  weight?: string;
  notes: string;
}

export const NURSING_OBS: NursingObservation[] = [
  { id: 'obs-001', patientId: 'pat-002', admissionId: 'adm-001', nurseId: 'nur-001', nurseName: 'Meena Lakshmi', date: '2026-10-28', time: '08:00 AM', temperature: '98.6°F', bloodPressure: '118/76 mmHg', pulse: '82 bpm', oxygen: '99%', weight: '68 kg', notes: 'Patient is comfortable. Fetal heart sounds normal.' },
  { id: 'obs-002', patientId: 'pat-002', admissionId: 'adm-001', nurseId: 'nur-001', nurseName: 'Meena Lakshmi', date: '2026-10-28', time: '02:00 PM', temperature: '99.1°F', bloodPressure: '122/80 mmHg', pulse: '86 bpm', oxygen: '98%', notes: 'Mild discomfort reported. Informed doctor.' },
];

export interface PatientQuery {
  id: string;
  queryRef: string;
  patientId: string;
  patientName: string;
  category: 'Appointment' | 'Billing' | 'Insurance' | 'Report' | 'General' | 'Complaint';
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  responses: QueryResponse[];
}

export interface QueryResponse {
  from: string;
  message: string;
  date: string;
  isStaff: boolean;
}

export const QUERIES: PatientQuery[] = [
  {
    id: 'qry-001', queryRef: 'QRY-2026-089', patientId: 'pat-001', patientName: 'Dinesh Karthick',
    category: 'Billing', subject: 'Invoice clarification for November 5 appointment',
    message: 'I wanted to know more details about the MRI charges in the invoice BILL-2026-0127. Is this covered under my insurance?',
    status: 'In Progress', priority: 'Medium', createdAt: '2026-10-26 10:30', updatedAt: '2026-10-27 14:15',
    assignedTo: 'Suresh Babu (Billing Team)',
    responses: [
      { from: 'Suresh Babu', message: 'Thank you for reaching out. We have reviewed your insurance policy. The MRI charge of ₹8,500 will be partially covered by your Star Health policy (up to ₹4,000 cashless). The remaining ₹4,500 + consultation of ₹1,500 is payable on the day of visit.', date: '2026-10-27 14:15', isStaff: true }
    ]
  },
  {
    id: 'qry-002', queryRef: 'QRY-2026-091', patientId: 'pat-001', patientName: 'Dinesh Karthick',
    category: 'Appointment', subject: 'Can I reschedule the November 5 appointment?',
    message: 'I have a prior commitment on November 5. Can I reschedule to November 7 or 8?',
    status: 'Open', priority: 'Medium', createdAt: '2026-10-27 09:00', updatedAt: '2026-10-27 09:00',
    assignedTo: undefined, responses: []
  },
];

export interface Ward {
  id: string;
  name: string;
  department: string;
  totalBeds: number;
  beds: Bed[];
}

export interface Bed {
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  patientName?: string;
  admissionId?: string;
}

export const WARDS: Ward[] = [
  {
    id: 'w-001', name: 'General Ward A', department: 'General Medicine', totalBeds: 20,
    beds: [
      { number: 'GWA-001', status: 'occupied', patientName: 'Ravi Kumar', admissionId: 'adm-003' },
      { number: 'GWA-002', status: 'available' },
      { number: 'GWA-003', status: 'available' },
      { number: 'GWA-004', status: 'occupied', patientName: 'Selvi M', admissionId: 'adm-004' },
      { number: 'GWA-005', status: 'reserved' },
      { number: 'GWA-006', status: 'available' },
      { number: 'GWA-007', status: 'maintenance' },
      { number: 'GWA-008', status: 'available' },
      { number: 'GWA-009', status: 'occupied', patientName: 'Kumar S', admissionId: 'adm-005' },
      { number: 'GWA-010', status: 'available' },
    ]
  },
  {
    id: 'w-002', name: 'Maternity Ward', department: 'Gynecology & Obstetrics', totalBeds: 12,
    beds: [
      { number: 'MW-201', status: 'occupied', patientName: 'Asha Devi', admissionId: 'adm-006' },
      { number: 'MW-202', status: 'available' },
      { number: 'MW-203', status: 'available' },
      { number: 'MW-204', status: 'occupied', patientName: 'Priya Sharma', admissionId: 'adm-001' },
      { number: 'MW-205', status: 'reserved' },
      { number: 'MW-206', status: 'available' },
    ]
  },
];

export const DEPARTMENTS = [
  { id: 'dep-001', name: 'General Medicine', icon: '🩺', doctorCount: 3 },
  { id: 'dep-002', name: 'Cardiology', icon: '❤️', doctorCount: 2 },
  { id: 'dep-003', name: 'Orthopedics', icon: '🦴', doctorCount: 2 },
  { id: 'dep-004', name: 'Dermatology', icon: '🧴', doctorCount: 1 },
  { id: 'dep-005', name: 'Neurology', icon: '🧠', doctorCount: 2 },
  { id: 'dep-006', name: 'Gynecology & Obstetrics', icon: '🤰', doctorCount: 2 },
  { id: 'dep-007', name: 'Pediatrics', icon: '👶', doctorCount: 3 },
  { id: 'dep-008', name: 'ENT', icon: '👂', doctorCount: 1 },
  { id: 'dep-009', name: 'Ophthalmology', icon: '👁️', doctorCount: 1 },
  { id: 'dep-010', name: 'Psychiatry', icon: '🧘', doctorCount: 1 },
  { id: 'dep-011', name: 'Oncology', icon: '🎗️', doctorCount: 2 },
  { id: 'dep-012', name: 'Emergency Medicine', icon: '🚑', doctorCount: 4 },
];

export const ADMIN_STATS = {
  totalPatients: 12847,
  todayAppointments: 284,
  completedToday: 198,
  cancelledToday: 12,
  activeDoctors: 42,
  onLeave: 4,
  opdVisits: 198,
  ipdAdmissions: 7,
  bedOccupancy: 73,
  totalBeds: 200,
  revenue: 485200,
  outstanding: 124600,
  pendingClaims: 38,
  settledClaims: 212,
};

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  type: 'Advanced Life Support (ALS)' | 'Basic Life Support (BLS)' | 'Patient Transport (PTV)' | 'Neonatal ICU';
  driverName: string;
  driverPhone: string;
  paramedicName: string;
  status: 'Available' | 'Dispatched' | 'En Route' | 'On Scene' | 'Maintenance';
  currentLocation: string;
  etaMinutes: number;
}

export const AMBULANCES: Ambulance[] = [
  {
    id: 'amb-101',
    vehicleNumber: 'TN-09-EM-1081',
    type: 'Advanced Life Support (ALS)',
    driverName: 'Murugan Shanmugam',
    driverPhone: '+91 98401 23456',
    paramedicName: 'Nurse Priya S. (Trained EMT)',
    status: 'Available',
    currentLocation: 'Hospital Main Emergency Bay',
    etaMinutes: 8,
  },
  {
    id: 'amb-102',
    vehicleNumber: 'TN-09-EM-1082',
    type: 'Basic Life Support (BLS)',
    driverName: 'Ramesh Balan',
    driverPhone: '+91 98402 34567',
    paramedicName: 'Nurse David R.',
    status: 'Available',
    currentLocation: 'Sector 4 Junction Dispatch Post',
    etaMinutes: 12,
  },
  {
    id: 'amb-103',
    vehicleNumber: 'TN-09-EM-1083',
    type: 'Patient Transport (PTV)',
    driverName: 'Senthil Nathan',
    driverPhone: '+91 98403 45678',
    paramedicName: 'Attendant Vignesh',
    status: 'Available',
    currentLocation: 'South Gate Medical Plaza',
    etaMinutes: 15,
  },
  {
    id: 'amb-104',
    vehicleNumber: 'TN-09-EM-1084',
    type: 'Neonatal ICU',
    driverName: 'Karthikeyan P.',
    driverPhone: '+91 98404 56789',
    paramedicName: 'Dr. Arun (Pediatric EMT)',
    status: 'Available',
    currentLocation: 'Pediatric Care Pavilion Bay 2',
    etaMinutes: 10,
  },
];

