import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APPOINTMENTS, PRESCRIPTIONS, LAB_REPORTS } from '../../data/demo';

const TODAY_QUEUE = [
  { token: 'A001', name: 'Ravi Kumar', time: '09:00', status: 'done', duration: 12 },
  { token: 'A002', name: 'Meena S', time: '09:15', status: 'done', duration: 10 },
  { token: 'A003', name: 'Suresh M', time: '09:30', status: 'done', duration: 15 },
  { token: 'A004', name: 'Anbu R', time: '09:45', status: 'done', duration: 8 },
  { token: 'A005', name: 'Priya K', time: '10:00', status: 'done', duration: 14 },
  { token: 'A006', name: 'Nithya R', time: '10:15', status: 'done', duration: 11 },
  { token: 'A007', name: 'Mahesh B', time: '10:30', status: 'current', duration: null },
  { token: 'A008', name: 'Kavitha S', time: '10:45', status: 'waiting', duration: null },
  { token: 'A009', name: 'Dinesh K', time: '11:00', status: 'waiting', duration: null },
  { token: 'A010', name: 'Sathya P', time: '11:15', status: 'waiting', duration: null },
];

const TABS = ['Today\'s Queue', 'Consultation', 'Prescriptions', 'Reports'];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [currentConsultTab, setCurrentConsultTab] = useState('history');

  const todayAppts = APPOINTMENTS.filter(a => a.date === '2026-10-28');

  return (
    <div>
      <div className="demo-banner">⚠️ Demo mode — <strong>Dr. Ramesh Kumar</strong>, General Medicine</div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Doctor Dashboard 🩺</h1>
          <p className="page-subtitle">Wednesday, 28 October 2026 · General Medicine OPD</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm">📅 My Schedule</button>
          <button className="btn btn-danger btn-sm">🔴 Mark Unavailable</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1.5rem' }}>
        {[
          { icon: '📋', label: 'Total Today', value: '10', color: '#1769AA', bg: 'var(--primary-light)' },
          { icon: '✅', label: 'Completed', value: '6', color: '#38A169', bg: 'var(--green-light)' },
          { icon: '⏳', label: 'Waiting', value: '3', color: '#D69E2E', bg: 'var(--amber-light)' },
          { icon: '🔬', label: 'Reports Pending', value: '3', color: '#805AD5', bg: 'var(--purple-light)' },
          { icon: '📞', label: 'Follow-ups', value: '2', color: '#0D9488', bg: 'var(--teal-light)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: '1.6rem' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.25rem' }}>
        {/* Queue Panel */}
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--teal))', borderRadius: 'var(--radius)', padding: '1rem', color: 'white', textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Now Consulting</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>A007</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Mahesh B · 10:30 AM</div>
            </div>
            <div style={{ marginBottom: 8, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Queue Today</div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {TODAY_QUEUE.map(q => (
                <div key={q.token} className={`queue-item ${q.status === 'current' ? 'current' : q.status === 'my-turn' ? 'my-token' : ''}`}>
                  <div className={`queue-token ${q.status === 'current' ? 'active' : ''}`} style={{ color: q.status === 'done' ? 'var(--text-muted)' : q.status === 'current' ? 'var(--primary)' : 'var(--text)' }}>{q.token}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: q.status === 'done' ? 'var(--text-muted)' : 'var(--text)' }}>{q.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{q.time} {q.duration ? `· ${q.duration} min` : ''}</div>
                  </div>
                  <span className={`badge ${q.status === 'done' ? 'badge-green' : q.status === 'current' ? 'badge-blue' : 'badge-gray'}`} style={{ fontSize: '0.65rem' }}>
                    {q.status === 'done' ? '✓' : q.status === 'current' ? '🟢' : '⏳'}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>✅ Next Patient</button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>⏭️ Skip</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Current Patient */}
          <div className="card" style={{ marginBottom: '1.25rem', border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="card-title">🟢 Current Patient — Token A007</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 4 }}>Mahesh Babu, 42M</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>MED-PAT-087 · Hypertension (Follow-up)</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm">📋 History</button>
                <button className="btn btn-primary btn-sm">💊 Prescribe</button>
              </div>
            </div>
            <div className="tabs">
              {['History', 'Vitals', 'Notes', 'Prescribe', 'Orders'].map((t, i) => (
                <button key={t} className={`tab-btn ${currentConsultTab === t.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setCurrentConsultTab(t.toLowerCase())}>{t}</button>
              ))}
            </div>
            {currentConsultTab === 'history' && (
              <div className="timeline" style={{ marginTop: '1rem' }}>
                <div className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-date">15 Sep 2026 — Dr. Ramesh Kumar</div>
                    <div className="timeline-title">Hypertension — Stage 1</div>
                    <div className="timeline-subtitle">BP: 148/92 mmHg · Started Amlodipine 5mg + Telmisartan 40mg</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot teal" />
                  <div className="timeline-content">
                    <div className="timeline-date">12 Aug 2026 — Dr. Ramesh Kumar</div>
                    <div className="timeline-title">Routine Check-up</div>
                    <div className="timeline-subtitle">BP: 152/96 mmHg · Advised lifestyle modifications</div>
                  </div>
                </div>
              </div>
            )}
            {currentConsultTab === 'vitals' && (
              <div className="vitals-grid" style={{ marginTop: '1rem' }}>
                {[
                  { icon: '🌡️', value: '98.4°F', unit: 'Temp', label: 'Temperature' },
                  { icon: '❤️', value: '128/84', unit: 'mmHg', label: 'Blood Pressure' },
                  { icon: '💓', value: '76', unit: 'bpm', label: 'Heart Rate' },
                  { icon: '🫁', value: '98%', unit: 'SpO₂', label: 'Oxygen' },
                  { icon: '⚖️', value: '78 kg', unit: 'Wt', label: 'Weight' },
                  { icon: '📏', value: '172 cm', unit: 'Ht', label: 'Height' },
                ].map(v => (
                  <div key={v.label} className="vital-card">
                    <div className="vital-icon">{v.icon}</div>
                    <div className="vital-value">{v.value}</div>
                    <div className="vital-unit">{v.unit}</div>
                    <div className="vital-label">{v.label}</div>
                  </div>
                ))}
              </div>
            )}
            {currentConsultTab === 'notes' && (
              <div style={{ marginTop: '1rem' }}>
                <div className="form-field">
                  <label className="form-label">Chief Complaint</label>
                  <input defaultValue="Mild headache, slight dizziness in the morning" />
                </div>
                <div className="form-field">
                  <label className="form-label">Clinical Notes</label>
                  <textarea rows={3} defaultValue="Patient on antihypertensives. BP today 128/84 — improved from last visit. Continue same medications. Advised salt restriction." />
                </div>
                <div className="form-field">
                  <label className="form-label">Diagnosis</label>
                  <input defaultValue="Hypertension — Stage 1, Controlled on medication" />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem' }}>
                  <button className="btn btn-primary btn-sm">💾 Save Notes</button>
                  <button className="btn btn-ghost btn-sm">🗑️ Clear</button>
                </div>
              </div>
            )}
            {currentConsultTab === 'prescribe' && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, marginBottom: '0.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span>Medicine</span><span>Dose</span><span>Frequency</span><span>Duration</span>
                </div>
                {[
                  { med: 'Tab. Amlodipine 5mg', dose: '1 tab', freq: 'OD Morning', dur: '30 days' },
                  { med: 'Tab. Telmisartan 40mg', dose: '1 tab', freq: 'OD', dur: '30 days' },
                ].map((m, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <input defaultValue={m.med} style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.82rem' }} />
                    <input defaultValue={m.dose} style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.82rem' }} />
                    <input defaultValue={m.freq} style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.82rem' }} />
                    <input defaultValue={m.dur} style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.82rem' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem' }}>
                  <button className="btn btn-ghost btn-sm">+ Add Medicine</button>
                  <button className="btn btn-teal btn-sm">✅ Sign & Save</button>
                  <button className="btn btn-primary btn-sm">🖨️ Print Rx</button>
                </div>
              </div>
            )}
            {currentConsultTab === 'orders' && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Order Investigations</div>
                <div className="card-grid-2">
                  {['CBC', 'LFT', 'KFT', 'Lipid Profile', 'HbA1c', 'Chest X-Ray', 'ECG', 'Echo'].map(test => (
                    <label key={test} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input type="checkbox" />
                      {test}
                    </label>
                  ))}
                </div>
                <div className="form-field" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label">Other / Custom Order</label>
                  <input placeholder="Enter test name…" />
                </div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>📋 Place Orders</button>
              </div>
            )}
          </div>

          {/* Today's appointment list */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">📅 All Appointments Today</span>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Token</th><th>Patient</th><th>Time</th><th>Type</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {TODAY_QUEUE.map(q => (
                    <tr key={q.token}>
                      <td><strong>{q.token}</strong></td>
                      <td>{q.name}</td>
                      <td>{q.time}</td>
                      <td><span className="badge badge-blue">New</span></td>
                      <td>
                        <span className={`badge ${q.status === 'done' ? 'badge-green' : q.status === 'current' ? 'badge-blue' : 'badge-gray'}`}>
                          {q.status === 'done' ? 'Completed' : q.status === 'current' ? 'In Progress' : 'Waiting'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm" disabled={q.status !== 'waiting'}>Start</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
