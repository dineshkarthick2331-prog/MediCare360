import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Appointment } from '../../data/demo';
import { getStoredAppointments, DATA_UPDATE_EVENT } from '../../services/hospitalDataStore';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'Confirmed' | 'Completed'>('all');
  const [appointments, setAppointments] = useState<Appointment[]>(getStoredAppointments());

  useEffect(() => {
    const handleUpdate = () => {
      setAppointments([...getStoredAppointments()]);
    };
    window.addEventListener(DATA_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(DATA_UPDATE_EVENT, handleUpdate);
  }, []);

  const userAppointments = appointments.filter((a) => {
    if (user?.role === 'patient') return a.patientName.includes('Dinesh') || a.patientId === 'pat-001';
    if (user?.role === 'doctor') return a.doctorId === 'doc-001';
    return true;
  });

  const filtered = userAppointments.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Doctor Appointments 📅</h1>
          <p className="page-subtitle">Track, reschedule, or book appointments with specialist physicians</p>
        </div>
        {user?.role === 'patient' && (
          <Link to="/patient/appointments/book" className="btn btn-primary btn-sm">
            ➕ Book New Appointment
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        {['all', 'Confirmed', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {tab === 'all' ? 'All Appointments' : tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              borderLeft: `4px solid ${apt.status === 'Confirmed' ? 'var(--primary)' : 'var(--green)'}`,
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div
                style={{
                  background: 'var(--surface-2)',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  minWidth: '70px',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOKEN</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{apt.token}</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{apt.doctorName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {apt.department} · {apt.type}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  🗓️ {apt.date} at {apt.time} · ID: {apt.appointmentId}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: apt.status === 'Confirmed' ? '#E0F2FE' : '#DCFCE7',
                    color: apt.status === 'Confirmed' ? '#0369A1' : '#15803D',
                  }}
                >
                  {apt.status}
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>
                  Fee: ₹{apt.fee} {apt.paid ? '· Paid' : '· Unpaid'}
                </div>
              </div>

              {apt.status === 'Confirmed' && (
                <Link to="/patient/queue" className="btn btn-outline btn-sm">
                  Track Live Queue →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
