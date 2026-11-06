import React, { useState } from 'react';
import { DOCTORS, Doctor, DEPARTMENTS, WARDS, ADMIN_STATS } from '../../data/demo';
import { addAppointment, cancelAppointment, rescheduleAppointment, createPatientQuery, addPrescription } from '../../services/hospitalDataStore';
import { sendAppointmentNotification } from '../../services/notificationService';

// ─── 1. Conversational Appointment Booking Flow ─────────────────────────────

interface BookingFlowProps {
  initialStep?: string;
  onComplete: (summary: string) => void;
  currentUser: any;
  language: 'en' | 'ta' | 'hi';
}

export function ChatbotBookingFlow({ initialStep = 'select_department', onComplete, currentUser, language }: BookingFlowProps) {
  const [step, setStep] = useState(initialStep);
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0].name);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(DOCTORS[0]);
  const [selectedDate, setSelectedDate] = useState('2026-10-31');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');
  const [patientName, setPatientName] = useState(currentUser?.name || 'Dinesh Karthick');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [bookedResult, setBookedResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSlots = ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '04:00 PM', '05:30 PM'];

  const filteredDoctors = DOCTORS.filter(d => !selectedDept || d.department.toLowerCase().includes(selectedDept.toLowerCase()) || selectedDept.toLowerCase().includes(d.department.toLowerCase()));
  const doctorsToShow = filteredDoctors.length > 0 ? filteredDoctors : DOCTORS;

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const newApt = addAppointment({
        patientId: currentUser?.id || 'pat-001',
        patientName,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        department: selectedDoctor.department,
        date: selectedDate,
        time: selectedSlot,
        type: 'New Consultation',
        status: 'Confirmed',
        fee: selectedDoctor.fee,
        paid: true,
        notes: 'Booked via MediBot AI Assistant',
      });

      // Send WhatsApp and SMS alerts
      await sendAppointmentNotification({
        appointment: newApt,
        recipientPhone: patientPhone,
        recipientName: patientName,
        action: 'booked',
      });

      setBookedResult(newApt);
      setStep('success');
      onComplete(`Appointment successfully scheduled with ${selectedDoctor.name} for ${selectedDate} at ${selectedSlot}. Token: ${newApt.token}, ID: ${newApt.appointmentId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success' && bookedResult) {
    return (
      <div className="medibot-widget-card medibot-success-card">
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '2.2rem' }}>🎉</div>
          <h4 style={{ margin: '4px 0', color: '#166534', fontWeight: 800 }}>Appointment Confirmed!</h4>
          <p style={{ fontSize: '0.8rem', color: '#15803D', margin: 0 }}>
            Your consultation has been booked and registered in MediCare 360.
          </p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '10px', padding: '10px', border: '1px solid #BBF7D0', marginBottom: '10px', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Booking ID:</span>
            <strong style={{ color: '#0F172A' }}>{bookedResult.appointmentId}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Assigned Token:</span>
            <span style={{ background: '#166534', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              {bookedResult.token}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Doctor:</span>
            <strong>{bookedResult.doctorName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Date & Slot:</span>
            <span>{bookedResult.date} · {bookedResult.time}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B' }}>Fee:</span>
            <strong style={{ color: '#1769AA' }}>₹{bookedResult.fee}</strong>
          </div>
        </div>

        {/* Dispatch Confirmation Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', background: 'rgba(22, 101, 52, 0.08)', padding: '8px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D' }}>
            <span>✅</span>
            <span>WhatsApp confirmation dispatched to <strong>{patientPhone}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D' }}>
            <span>✅</span>
            <span>SMS queue token pass sent to <strong>{patientPhone}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="medibot-widget-card">
      {/* Step 1: Department */}
      {step === 'select_department' && (
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text)' }}>
            1. Select Medical Department:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {DEPARTMENTS.slice(0, 8).map(dept => (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDept(dept.name);
                  const matching = DOCTORS.find(d => d.department.toLowerCase().includes(dept.name.toLowerCase()));
                  if (matching) setSelectedDoctor(matching);
                  setStep('select_doctor');
                }}
                className={`medibot-chip ${selectedDept === dept.name ? 'active' : ''}`}
              >
                <span>{dept.icon}</span> {dept.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Doctor Selection */}
      {step === 'select_doctor' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>2. Choose Specialist Doctor:</span>
            <button onClick={() => setStep('select_department')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer' }}>
              ← Change Dept
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {doctorsToShow.map(doc => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setStep('select_slot');
                }}
                className={`medibot-doc-card ${selectedDoctor.id === doc.id ? 'active' : ''}`}
              >
                <div style={{ fontSize: '1.6rem' }}>{doc.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{doc.specialty} · {doc.experience}y exp</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>Fee: ₹{doc.fee} · Rating: {doc.rating}★</div>
                </div>
                <button className="btn btn-sm btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Date & Slots */}
      {step === 'select_slot' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>3. Pick Date & Time Slot:</span>
            <button onClick={() => setStep('select_doctor')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer' }}>
              ← Change Doctor
            </button>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem', background: 'var(--surface)', color: 'var(--text)' }}
            />
          </div>

          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Available Slots:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
            {availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`medibot-chip ${selectedSlot === slot ? 'active' : ''}`}
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                {slot}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('confirm')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
          >
            Review & Confirm Booking →
          </button>
        </div>
      )}

      {/* Step 4: Final Summary & Booking Confirmation */}
      {step === 'confirm' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>4. Confirm Consultation Details:</span>
            <button onClick={() => setStep('select_slot')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer' }}>
              ← Edit Slot
            </button>
          </div>

          <div style={{ background: 'var(--surface-2)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.4rem' }}>{selectedDoctor.avatar}</span>
              <div>
                <strong>{selectedDoctor.name}</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>{selectedDoctor.specialty} · {selectedDoctor.department}</div>
              </div>
            </div>
            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>📅 <strong>{selectedDate}</strong></div>
              <div>⏰ <strong>{selectedSlot}</strong></div>
              <div>💵 Fee: <strong>₹{selectedDoctor.fee}</strong></div>
              <div>📱 Phone: <strong>{patientPhone}</strong></div>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Patient Phone (for WhatsApp & SMS confirmation):</label>
            <input
              type="tel"
              value={patientPhone}
              onChange={e => setPatientPhone(e.target.value)}
              placeholder="+91 98765 43210"
              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem', background: 'var(--surface)', color: 'var(--text)' }}
            />
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '8px', fontSize: '0.85rem', fontWeight: 700 }}
          >
            {isSubmitting ? 'Booking & Assigning Token…' : '✅ Confirm & Book Now'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── 2. Manage Existing Appointments (Reschedule & Cancel) ──────────────────

export function ManageAppointmentsWidget({ appointments, onActionComplete }: { appointments: any[]; onActionComplete: (msg: string) => void }) {
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'cancel' | 'reschedule' | null>(null);
  const [newDate, setNewDate] = useState('2026-11-02');
  const [newTime, setNewTime] = useState('11:00 AM');

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    onActionComplete(`Appointment ${id} has been cancelled successfully.`);
  };

  const handleReschedule = (id: string) => {
    rescheduleAppointment(id, newDate, newTime);
    onActionComplete(`Appointment ${id} has been rescheduled to ${newDate} at ${newTime}.`);
  };

  return (
    <div className="medibot-widget-card">
      <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>Your Appointments on File:</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {appointments.map(apt => (
          <div key={apt.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{apt.doctorName}</span>
              <span style={{ fontSize: '0.72rem', background: apt.status === 'Confirmed' ? 'var(--primary-light)' : 'var(--surface-2)', color: apt.status === 'Confirmed' ? 'var(--primary)' : 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                {apt.status} · Token {apt.token}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
              📅 {apt.date} · ⏰ {apt.time} ({apt.department})
            </div>

            {apt.status === 'Confirmed' && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <button
                  onClick={() => {
                    setSelectedAptId(apt.id);
                    setActionType('reschedule');
                  }}
                  className="btn btn-sm btn-outline"
                  style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                >
                  📅 Reschedule
                </button>
                <button
                  onClick={() => handleCancel(apt.id)}
                  className="btn btn-sm"
                  style={{ fontSize: '0.72rem', padding: '3px 8px', background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FCA5A5' }}
                >
                  ✕ Cancel
                </button>
              </div>
            )}

            {selectedAptId === apt.id && actionType === 'reschedule' && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    style={{ fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid var(--border)' }}
                  />
                  <select
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    style={{ fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid var(--border)' }}
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
                <button
                  onClick={() => handleReschedule(apt.id)}
                  className="btn btn-sm btn-primary"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '4px' }}
                >
                  Confirm Reschedule
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 3. Doctor Prescription Drafting Assistant ──────────────────────────────

export function DoctorPrescriptionDraftWidget({ widgetData, onComplete }: { widgetData: any; onComplete: (msg: string) => void }) {
  const [diagnosis, setDiagnosis] = useState('Acute Bronchitis & Viral Rhinitis');
  const [medicines, setMedicines] = useState(widgetData.suggestedMeds || []);
  const [notes, setNotes] = useState('Hydration, warm fluids, steam inhalation 2x/day. Rest for 3 days.');
  const [signed, setSigned] = useState(false);

  const handleApprove = () => {
    addPrescription({
      patientId: widgetData.patientId || 'pat-001',
      doctorId: 'doc-001',
      doctorName: 'Dr. Ramesh Kumar',
      date: new Date().toISOString().slice(0, 10),
      diagnosis,
      medicines,
      notes,
      signed: true,
      followUp: '2026-11-06',
    });
    setSigned(true);
    onComplete(`Prescription signed and securely saved for patient Dinesh Karthick (Diagnosis: ${diagnosis}).`);
  };

  if (signed) {
    return (
      <div className="medibot-widget-card medibot-success-card">
        <h4 style={{ color: '#166534', margin: '0 0 4px 0' }}>✅ Prescription Approved & Signed</h4>
        <p style={{ fontSize: '0.78rem', color: '#15803D', margin: 0 }}>
          This record has been officially added to the patient's EHR vault.
        </p>
      </div>
    );
  }

  return (
    <div className="medibot-widget-card">
      <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
        👨‍⚕️ Clinical Note & Prescription Drafter:
      </div>
      <div style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
        <strong>Patient:</strong> {widgetData.patientName} (ID: {widgetData.patientId})
      </div>
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Clinical Diagnosis:</label>
        <input
          type="text"
          value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.78rem' }}
        />
      </div>
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Prescribed Medications:</label>
        {medicines.map((m: any, i: number) => (
          <div key={i} style={{ background: 'var(--surface-2)', padding: '6px', borderRadius: '4px', fontSize: '0.75rem', marginBottom: '4px' }}>
            <strong>{m.name} {m.strength}</strong> — {m.dosage} ({m.frequency}) for {m.duration} [{m.instructions}]
          </div>
        ))}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Clinical Instructions / Notes:</label>
        <textarea
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.75rem' }}
        />
      </div>
      <button
        onClick={handleApprove}
        className="btn btn-sm btn-primary"
        style={{ width: '100%', padding: '6px', fontSize: '0.8rem', fontWeight: 700 }}
      >
        ✍️ Sign & Approve Prescription
      </button>
    </div>
  );
}

// ─── 4. Human Support Escalation Handoff ─────────────────────────────────────

export function HumanSupportHandoffWidget({ onComplete, currentUser }: { onComplete: (msg: string) => void; currentUser: any }) {
  const [subject, setSubject] = useState('Request for Front Desk Coordinator Call');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const query = createPatientQuery({
      patientId: currentUser?.id || 'pat-001',
      patientName: currentUser?.name || 'Guest User',
      category: 'General',
      subject,
      message,
      priority: 'High',
    });

    setSubmitted(true);
    onComplete(`Your support ticket [${query.queryRef}] has been created. Coordinator Suresh Babu has been notified.`);
  };

  if (submitted) {
    return (
      <div className="medibot-widget-card medibot-success-card">
        <h4 style={{ color: '#166534', margin: '0 0 4px 0' }}>✅ Support Ticket Created</h4>
        <p style={{ fontSize: '0.78rem', color: '#15803D', margin: 0 }}>
          Assigned to <strong>Suresh Babu</strong> (Reception Desk). You will receive an update within 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="medibot-widget-card">
      <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
        💬 Connect with Human Care Coordinator:
      </div>
      <div style={{ marginBottom: '6px' }}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.78rem' }}
        />
      </div>
      <div style={{ marginBottom: '8px' }}>
        <textarea
          rows={3}
          required
          placeholder="Describe your inquiry or concern…"
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.78rem' }}
        />
      </div>
      <button
        type="submit"
        className="btn btn-sm btn-primary"
        style={{ width: '100%', padding: '6px', fontSize: '0.8rem' }}
      >
        Submit Query to Front Desk
      </button>
    </form>
  );
}
