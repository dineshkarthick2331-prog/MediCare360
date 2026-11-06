import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOCTORS } from '../../data/demo';
import { addAppointment } from '../../services/hospitalDataStore';
import { sendAppointmentNotification } from '../../services/notificationService';

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const [selectedDoctorId, setSelectedDoctorId] = useState(DOCTORS[0].id);
  const [selectedDate, setSelectedDate] = useState('2026-10-29');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');
  const [visitType, setVisitType] = useState('New Consultation');
  const [reason, setReason] = useState('');
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [assignedToken, setAssignedToken] = useState('A016');

  const selectedDoctor = DOCTORS.find((d) => d.id === selectedDoctorId) || DOCTORS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = addAppointment({
      patientId: 'pat-001',
      patientName: 'Dinesh Karthick',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      date: selectedDate,
      time: selectedSlot,
      type: visitType as any,
      status: 'Confirmed',
      fee: selectedDoctor.fee,
      paid: true,
      notes: reason || 'Booked online',
    });

    setAssignedToken(created.token);
    setBookedSuccess(true);

    await sendAppointmentNotification({
      appointment: created,
      recipientPhone: '+91 98765 43210',
      recipientName: 'Dinesh Karthick',
      action: 'booked',
    });

    setTimeout(() => {
      navigate('/patient/appointments');
    }, 2500);
  };

  const slots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Book Doctor Appointment 📅</h1>
        <p className="page-subtitle">Schedule an in-clinic consultation with your preferred specialist</p>
      </div>

      {bookedSuccess ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', background: '#F0FDF4', border: '1px solid #86EFAC' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: '#166534', fontWeight: 800 }}>Appointment Confirmed!</h2>
          <p style={{ color: '#15803D' }}>
            Your consultation with <strong>{selectedDoctor.name}</strong> has been scheduled for <strong>{selectedDate} at {selectedSlot}</strong>.
          </p>
          <div style={{ display: 'inline-block', background: '#166534', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, margin: '1rem 0' }}>
            Token Assigned: {assignedToken}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#15803D', marginBottom: '1rem' }}>
            ✅ WhatsApp & SMS confirmation dispatched to +91 98765 43210
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirecting to your appointments list…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          {/* Step 1: Doctor Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'block' }}>
              1. Select Specialist Doctor
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
              {DOCTORS.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctorId(doc.id)}
                  style={{
                    border: `2px solid ${selectedDoctorId === doc.id ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '10px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    background: selectedDoctorId === doc.id ? 'rgba(23, 105, 170, 0.06)' : 'var(--surface)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{doc.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{doc.specialty}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                        Fee: ₹{doc.fee}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Date & Slots */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>2. Consultation Date</label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>3. Visit Type</label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                <option value="New Consultation">New Consultation</option>
                <option value="Follow-up">Follow-up Visit</option>
                <option value="Report Review">Report Review</option>
              </select>
            </div>
          </div>

          {/* Time Slot Grid */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
              4. Available Time Slots
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {slots.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSelectedSlot(s)}
                  className={`btn btn-sm ${selectedSlot === s ? 'btn-teal' : 'btn-outline'}`}
                  style={{ minWidth: '85px' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms / Reason */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>5. Symptoms or Medical Concern</label>
            <textarea
              rows={2}
              placeholder="Briefly describe your symptoms (e.g. fever for 2 days, backache, routine checkup)…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
          </div>

          {/* Summary Box & Submit */}
          <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>Total Consultation Fee</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Payable at clinic desk or via online portal</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--teal)' }}>
              ₹{selectedDoctor.fee}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg">
              Confirm & Generate Token →
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
