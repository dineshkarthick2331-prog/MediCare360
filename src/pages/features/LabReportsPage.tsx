import React from 'react';
import { LAB_REPORTS } from '../../data/demo';

export default function LabReportsPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Diagnostic & Laboratory Reports 🔬</h1>
          <p className="page-subtitle">Pathology, Biochemistry, Radiology, and ECG results archive</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {LAB_REPORTS.map((rep) => (
          <div key={rep.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>
                  {rep.type === 'Blood' ? '🩸' : rep.type === 'X-Ray' || rep.type === 'MRI' ? '🩻' : '🧪'}
                </span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>{rep.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Type: {rep.type} · Lab: {rep.lab} · Ordered by: {rep.orderedBy}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: rep.status === 'Reviewed' ? '#DCFCE7' : rep.status === 'Completed' ? '#E0F2FE' : '#FEF3C7',
                    color: rep.status === 'Reviewed' ? '#15803D' : rep.status === 'Completed' ? '#0369A1' : '#B45309',
                  }}
                >
                  {rep.status}
                </span>
                {rep.status !== 'Ordered' && (
                  <button
                    onClick={() => alert(`Downloading ${rep.name} report PDF`)}
                    className="btn btn-sm btn-outline"
                  >
                    📥 PDF
                  </button>
                )}
              </div>
            </div>

            {rep.findings && (
              <div style={{ background: 'var(--surface-2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginTop: '8px' }}>
                <div style={{ fontWeight: 700, marginBottom: '2px' }}>Clinical Findings:</div>
                <div style={{ color: 'var(--text-primary)' }}>{rep.findings}</div>
                {rep.normalRange && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Reference Range: {rep.normalRange}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
