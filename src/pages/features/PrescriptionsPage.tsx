import React from 'react';
import { PRESCRIPTIONS } from '../../data/demo';

export default function PrescriptionsPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Digital Prescriptions 💊</h1>
          <p className="page-subtitle">Verified e-prescriptions with dosage, timing, and pharmacy instructions</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm">
          🖨️ Print Prescriptions
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {PRESCRIPTIONS.map((rx) => (
          <div
            key={rx.id}
            className="card"
            style={{
              borderTop: '4px solid var(--teal)',
              padding: '1.5rem',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{rx.diagnosis}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Doctor: <strong>{rx.doctorName}</strong> · Date: {rx.date}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', background: '#DCFCE7', color: '#166534', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  ✓ Digitally Signed
                </span>
                <button
                  onClick={() => alert(`Downloading Rx #${rx.id} in PDF format`)}
                  className="btn btn-sm btn-primary"
                >
                  📥 Download PDF
                </button>
              </div>
            </div>

            {/* Medicines List */}
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Rx / Prescribed Medications</h3>
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '8px' }}>Medicine</th>
                    <th style={{ padding: '8px' }}>Strength</th>
                    <th style={{ padding: '8px' }}>Dosage</th>
                    <th style={{ padding: '8px' }}>Frequency</th>
                    <th style={{ padding: '8px' }}>Duration</th>
                    <th style={{ padding: '8px' }}>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {rx.medicines.map((med, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: 'var(--primary)' }}>{med.name}</td>
                      <td style={{ padding: '8px' }}>{med.strength}</td>
                      <td style={{ padding: '8px' }}>{med.dosage}</td>
                      <td style={{ padding: '8px' }}>{med.frequency}</td>
                      <td style={{ padding: '8px' }}>{med.duration}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{med.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes & Followup */}
            <div style={{ background: 'var(--surface-2)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong>Advice / Notes:</strong> {rx.notes}
              </div>
              {rx.followUp && (
                <div style={{ fontWeight: 700, color: 'var(--teal)' }}>
                  🗓️ Follow-up Date: {rx.followUp}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
