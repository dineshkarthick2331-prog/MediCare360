import React, { useState } from 'react';
import { DOCTORS, QUEUE } from '../../data/demo';

export default function OpdPage() {
  const [selectedDept, setSelectedDept] = useState('All');

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Outpatient Department (OPD) 🩺</h1>
          <p className="page-subtitle">Daily clinics, specialist consultations, and token queues</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {DOCTORS.slice(0, 4).map((doc) => (
          <div key={doc.id} className="card" style={{ borderLeft: '4px solid var(--teal)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2rem' }}>{doc.avatar}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{doc.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{doc.department}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <div>Room: 10{doc.id.slice(-1)} · Shift: 09:00 AM – 01:00 PM</div>
              <div>Consultation Fee: ₹{doc.fee}</div>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: doc.available ? '#166534' : '#991B1B', background: doc.available ? '#DCFCE7' : '#FEE2E2', padding: '2px 8px', borderRadius: '10px' }}>
                {doc.available ? '● In Clinic' : '○ Unavailable'}
              </span>
              <button onClick={() => alert(`Opening queue for ${doc.name}`)} className="btn btn-outline btn-sm">
                View Queue
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* OPD Queue Summary */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Active OPD Token Summary</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {QUEUE.slice(8, 14).map((q) => (
            <div key={q.token} style={{ padding: '0.75rem 1rem', background: 'var(--surface-2)', borderRadius: '8px', textAlign: 'center', minWidth: '90px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: q.status === 'current' ? 'var(--teal)' : 'inherit' }}>{q.token}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
