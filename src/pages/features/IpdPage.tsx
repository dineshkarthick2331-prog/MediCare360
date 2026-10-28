import React from 'react';
import { ADMISSIONS, WARDS } from '../../data/demo';

export default function IpdPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Inpatient Department (IPD) & Wards 🛏️</h1>
          <p className="page-subtitle">Admissions, bed occupancy, ward management, and discharge summaries</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {WARDS.map((w) => {
          const occupied = w.beds.filter((b) => b.status === 'occupied').length;
          return (
            <div key={w.id} className="card">
              <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{w.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{w.department}</div>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>
                  Occupied: <strong>{occupied} / {w.totalBeds}</strong>
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#E0F2FE', color: '#0369A1' }}>
                  {Math.round((occupied / w.totalBeds) * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Current Hospital Admissions</h2>
        <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '8px' }}>Admission #</th>
              <th style={{ padding: '8px' }}>Patient Name</th>
              <th style={{ padding: '8px' }}>Ward & Bed</th>
              <th style={{ padding: '8px' }}>Doctor</th>
              <th style={{ padding: '8px' }}>Diagnosis</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {ADMISSIONS.map((adm) => (
              <tr key={adm.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px', fontWeight: 700, color: 'var(--primary)' }}>{adm.admissionNumber}</td>
                <td style={{ padding: '8px' }}><strong>{adm.patientName}</strong></td>
                <td style={{ padding: '8px' }}>{adm.ward} ({adm.bedNumber})</td>
                <td style={{ padding: '8px' }}>{adm.admittingDoctor}</td>
                <td style={{ padding: '8px' }}>{adm.diagnosis}</td>
                <td style={{ padding: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: adm.status === 'Admitted' ? '#DCFCE7' : '#E2E8F0', color: adm.status === 'Admitted' ? '#166534' : '#475569' }}>
                    {adm.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
