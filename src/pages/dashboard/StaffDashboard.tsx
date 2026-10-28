import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { APPOINTMENTS, QUEUE, INVOICES, QUERIES, QueueItem } from '../../data/demo';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<QueueItem[]>(QUEUE);
  const [currentToken, setCurrentToken] = useState('A011');
  const [patientSearch, setPatientSearch] = useState('');

  // Quick Walk-in Registration Modal
  const [showRegModal, setShowRegModal] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinDept, setWalkinDept] = useState('General Medicine');

  const handleNextToken = () => {
    const nextIdx = queue.findIndex((q) => q.token === currentToken) + 1;
    if (nextIdx < queue.length) {
      setCurrentToken(queue[nextIdx].token);
    }
  };

  const handleRegisterWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    const nextTokenNum = `A0${queue.length + 1}`;
    const newQueueItem: QueueItem = {
      token: nextTokenNum,
      patientName: walkinName,
      status: 'waiting',
      estimatedTime: '~20 min',
    };
    setQueue([...queue, newQueueItem]);
    setShowRegModal(false);
    setWalkinName('');
    setWalkinPhone('');
  };

  return (
    <div>
      <div className="demo-banner">
        ⚠️ Demo mode — <strong>{user?.name || 'Suresh Babu'}</strong>, Front Desk Reception & Patient Services
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Reception & Operations Desk 🗂️</h1>
          <p className="page-subtitle">Front Desk, OPD Queue Management & Registration</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowRegModal(true)} className="btn btn-primary btn-sm">
            ➕ Register Walk-in Patient
          </button>
          <button onClick={handleNextToken} className="btn btn-teal btn-sm">
            📢 Call Next Token
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '1.5rem' }}>
        {[
          { icon: '🎫', label: 'Active OPD Token', value: currentToken, color: '#1769AA', bg: 'var(--primary-light)' },
          { icon: '👥', label: 'In Queue', value: String(queue.filter((q) => q.status === 'waiting').length), color: '#D69E2E', bg: 'var(--amber-light)' },
          { icon: '📅', label: 'Today Appts', value: String(APPOINTMENTS.length), color: '#0D9488', bg: 'var(--teal-light)' },
          { icon: '💬', label: 'Support Queries', value: String(QUERIES.length), color: '#805AD5', bg: 'var(--purple-light)' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: '1.6rem' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* OPD Queue & Appointment Counter */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left: Live Token Queue */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>OPD Live Token Queue</h2>
            <span style={{ fontSize: '0.8rem', background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              Live Counter 1
            </span>
          </div>

          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '6px' }}>Token</th>
                  <th style={{ padding: '6px' }}>Patient Name</th>
                  <th style={{ padding: '6px' }}>Status</th>
                  <th style={{ padding: '6px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => {
                  const isCurrent = item.token === currentToken;
                  return (
                    <tr
                      key={item.token}
                      style={{
                        background: isCurrent ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                        fontWeight: isCurrent ? 700 : 400,
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <td style={{ padding: '6px' }}>
                        <span
                          style={{
                            background: isCurrent ? 'var(--teal)' : 'var(--surface-2)',
                            color: isCurrent ? 'white' : 'inherit',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                          }}
                        >
                          {item.token}
                        </span>
                      </td>
                      <td style={{ padding: '6px' }}>{item.patientName}</td>
                      <td style={{ padding: '6px' }}>
                        {isCurrent ? (
                          <span style={{ color: '#0D9488', fontWeight: 700 }}>Now Serving</span>
                        ) : (
                          item.status
                        )}
                      </td>
                      <td style={{ padding: '6px' }}>
                        <button
                          onClick={() => setCurrentToken(item.token)}
                          className="btn btn-sm btn-ghost"
                          style={{ fontSize: '0.75rem', padding: '2px 6px' }}
                        >
                          Call
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Patient Lookup & Billing */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Patient Lookup & Invoices</h2>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search by Patient Name, ID or Phone…"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {INVOICES.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{inv.patientName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {inv.billNumber} · {inv.visitType}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>₹{inv.amountPaid.toLocaleString()}</div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      background: inv.status === 'Paid' ? '#DCFCE7' : '#FEE2E2',
                      color: inv.status === 'Paid' ? '#166534' : '#991B1B',
                    }}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Walkin Modal */}
      {showRegModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1.5rem', maxWidth: '420px', width: '100%', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800 }}>Register Walk-In Patient</h3>
            <form onSubmit={handleRegisterWalkin}>
              <div className="form-field" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandha Krishnan"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>
              <div className="form-field" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98400 12345"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Consulting Department</label>
                <select
                  value={walkinDept}
                  onChange={(e) => setWalkinDept(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Gynecology">Gynecology</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowRegModal(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Generate Token & Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
