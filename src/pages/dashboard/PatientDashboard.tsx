import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APPOINTMENTS, PRESCRIPTIONS, LAB_REPORTS, INVOICES, QUEUE } from '../../data/demo';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [currentToken, setCurrentToken] = useState('A011');
  const [myToken] = useState('A012');
  const [ahead, setAhead] = useState(1);
  const [time, setTime] = useState(new Date());

  // Simulate live token movement
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const upcoming = APPOINTMENTS.find(a => a.patientId === 'pat-001' && a.status === 'Confirmed');
  const recentRx = PRESCRIPTIONS.filter(p => p.patientId === 'pat-001').slice(0, 2);
  const pendingReports = LAB_REPORTS.filter(r => r.patientId === 'pat-001' && r.status !== 'Reviewed').length;
  const pendingBill = INVOICES.find(i => i.patientId === 'pat-001' && i.status === 'Unpaid');

  return (
    <div>
      <div className="demo-banner">
        ⚠️ Demo mode — fictional patient data for <strong>Dinesh Karthick</strong>. Not for real medical use.
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">
            {time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Link to="/patient/appointments/book" className="btn btn-primary btn-lg">
          📅 Book Appointment
        </Link>
      </div>

      {/* Emergency Banner */}
      <div className="alert alert-emergency mb-4" style={{ marginBottom: '1.5rem' }}>
        <span className="alert-icon">🚨</span>
        <div>
          <strong>Medical Emergency?</strong> Do not wait online — call <strong>108</strong> (Ambulance) or go directly to the Emergency Department.
          {' '}<Link to="/patient/ambulance" style={{ color: 'var(--red)', textDecoration: 'underline', fontWeight: 700 }}>Request Ambulance →</Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1.5rem' }}>
        {[
          { icon: '📅', label: 'Appointments', value: '3', sub: '1 upcoming', color: '#1769AA', bg: 'var(--primary-light)' },
          { icon: '💊', label: 'Prescriptions', value: '2', sub: 'Active', color: '#0D9488', bg: 'var(--teal-light)' },
          { icon: '🔬', label: 'Lab Reports', value: String(pendingReports), sub: 'Pending review', color: '#805AD5', bg: 'var(--purple-light)' },
          { icon: '🧾', label: 'Pending Bills', value: pendingBill ? '1' : '0', sub: pendingBill ? `₹${(pendingBill.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0) - pendingBill.discount - pendingBill.insuranceCoverage).toLocaleString()}` : 'All clear', color: pendingBill ? '#E53E3E' : '#38A169', bg: pendingBill ? 'var(--red-light)' : 'var(--green-light)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, fontSize: '1.4rem' }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: '1.6rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-grid-3">
        {/* Upcoming Appointment + Token */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-header">
              <span className="card-title">📅 Next Appointment</span>
              <Link to="/patient/appointments" className="btn btn-ghost btn-sm">View all</Link>
            </div>
            {upcoming ? (
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="token-display" style={{ flex: '0 0 auto', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', minWidth: 140, textAlign: 'center' }}>
                  <div className="token-label">Your Token</div>
                  <div className="token-number" style={{ fontSize: '3.5rem' }}>{upcoming.token}</div>
                  <div className="token-meta">{upcoming.appointmentId}</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 6 }}>{upcoming.doctorName}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--teal)', fontWeight: 600, marginBottom: 8 }}>{upcoming.department}</div>
                  <div style={{ display: 'grid', gap: 4 }}>
                    {[
                      ['📅', 'Date', upcoming.date],
                      ['🕐', 'Time', upcoming.time],
                      ['🎫', 'Type', upcoming.type],
                    ].map(([icon, label, val]) => (
                      <div key={String(label)} style={{ display: 'flex', gap: 8, fontSize: '0.85rem' }}>
                        <span>{icon}</span>
                        <span style={{ color: 'var(--text-muted)', minWidth: 40 }}>{label}:</span>
                        <span style={{ fontWeight: 600 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: '1rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-green">✓ Confirmed</span>
                    <span className="badge badge-blue">{upcoming.fee ? `₹${upcoming.fee} Paid` : 'Fee pending'}</span>
                    <Link to="/patient/queue" className="btn btn-teal btn-sm">🎫 Track Queue</Link>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem' }}>📅</div>
                <p>No upcoming appointments</p>
                <Link to="/patient/appointments/book" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>Book now</Link>
              </div>
            )}
          </div>

          {/* Live Queue Status */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">🎫 Live Queue — General Medicine</span>
              <Link to="/patient/queue" className="btn btn-ghost btn-sm">Full view</Link>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ flex: 1, background: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '0.875rem', textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Now Serving</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{currentToken}</div>
              </div>
              <div style={{ flex: 1, background: 'var(--teal-light)', borderRadius: 'var(--radius)', padding: '0.875rem', textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal-dark)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Token</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--teal)' }}>{myToken}</div>
              </div>
              <div style={{ flex: 1, background: 'var(--amber-light)', borderRadius: 'var(--radius)', padding: '0.875rem', textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7B5E20', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Patients Ahead</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--amber)' }}>{ahead}</div>
              </div>
              <div style={{ flex: 1, background: 'var(--green-light)', borderRadius: 'var(--radius)', padding: '0.875rem', textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#276749', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Est. Wait</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--green)' }}>~15m</div>
              </div>
            </div>
            <div className="alert alert-info" style={{ margin: 0 }}>
              <span className="alert-icon">ℹ️</span>
              <span style={{ fontSize: '0.82rem' }}>Waiting times are approximate. Please arrive 10 minutes before your token is called. Doctor: <strong>Dr. Ramesh Kumar</strong> · Status: <strong>Consulting</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Quick Actions */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-title" style={{ marginBottom: '0.875rem' }}>⚡ Quick Actions</div>
            {[
              { to: '/patient/appointments/book', icon: '📅', label: 'Book Appointment', color: 'var(--primary)' },
              { to: '/patient/queue', icon: '🎫', label: 'Track My Token', color: 'var(--teal)' },
              { to: '/patient/ambulance', icon: '🚑', label: 'Ambulance Service', color: 'var(--red)' },
              { to: '/patient/prescriptions', icon: '💊', label: 'My Prescriptions', color: '#805AD5' },
              { to: '/patient/reports', icon: '🔬', label: 'Lab Reports', color: 'var(--amber)' },
              { to: '/patient/billing', icon: '🧾', label: 'Pay Bills', color: 'var(--green)' },
              { to: '/patient/queries', icon: '💬', label: 'Get Support', color: '#475569' },
            ].map(a => (
              <Link
                key={a.to}
                to={a.to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-sm)', marginBottom: 4, fontWeight: 600, fontSize: '0.875rem',
                  color: a.color, background: `${a.color}12`, border: `1px solid ${a.color}30`,
                  textDecoration: 'none', transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{a.icon}</span>
                {a.label} →
              </Link>
            ))}
          </div>

          {/* Patient ID */}
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--teal-light))' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Patient Card</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>{user?.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 2 }}>📛 MED-PAT-001</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 2 }}>🩸 Blood Group: O+</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>📱 {user?.phone}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-green">✓ Active</span>
              <span className="badge badge-blue">🛡️ Star Health</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Prescriptions & Reports */}
      <div className="card-grid-2" style={{ marginTop: '1.25rem' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">💊 Recent Prescriptions</span>
            <Link to="/patient/prescriptions" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {recentRx.map(rx => (
            <div key={rx.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{rx.diagnosis}</span>
                <span className={`badge ${rx.signed ? 'badge-green' : 'badge-amber'}`}>{rx.signed ? '✓ Signed' : 'Draft'}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{rx.doctorName} · {rx.date}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{rx.medicines.length} medicines</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">🔬 Lab Reports</span>
            <Link to="/patient/reports" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {LAB_REPORTS.filter(r => r.patientId === 'pat-001').slice(0, 4).map(rep => (
            <div key={rep.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.4rem' }}>
                {{ 'Blood': '🩸', 'X-Ray': '🦴', 'ECG': '❤️', 'Urine': '🧪', 'MRI': '🧠', 'CT Scan': '💻', 'Ultrasound': '📡', 'Pathology': '🔬', 'Other': '📋' }[rep.type] ?? '🔬'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rep.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rep.date} · {rep.lab}</div>
              </div>
              <span className={`badge ${rep.status === 'Reviewed' ? 'badge-green' : rep.status === 'Completed' ? 'badge-blue' : rep.status === 'In Progress' ? 'badge-amber' : 'badge-gray'}`}>
                {rep.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
