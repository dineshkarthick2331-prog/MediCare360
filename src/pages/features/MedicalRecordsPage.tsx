import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PRESCRIPTIONS, LAB_REPORTS, ADMISSIONS } from '../../data/demo';

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'timeline' | 'prescriptions' | 'lab' | 'admissions'>('timeline');

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Electronic Health & Medical Records 📋</h1>
          <p className="page-subtitle">Unified lifetime health records, clinical summaries, and diagnostic archives</p>
        </div>
        <button className="btn btn-outline btn-sm">
          📥 Download Full Health Summary (PDF)
        </button>
      </div>

      {/* Patient Profile Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(23, 105, 170, 0.08) 0%, rgba(13, 148, 136, 0.08) 100%)',
          border: '1px solid var(--border)',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
            }}
          >
            DK
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Dinesh Karthick</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              UHID: <strong>MED-PAT-001</strong> · Age: 32 · Male · Blood Group: <strong>O+ Positive</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Known Allergies:</span><br />
            <strong style={{ color: '#DC2626' }}>Penicillin, Sulfa drugs</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Chronic Conditions:</span><br />
            <strong>Mild Hypertension (Controlled)</strong>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
        {[
          { id: 'timeline', label: 'Timeline History' },
          { id: 'prescriptions', label: 'Prescriptions' },
          { id: 'lab', label: 'Lab Reports' },
          { id: 'admissions', label: 'Hospital Admissions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: 'none',
              border: 'none',
              borderBottom: `3px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline View */}
      {activeTab === 'timeline' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>OPD Consultation — General Medicine</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>28 October 2026</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Attending: <strong>Dr. Ramesh Kumar</strong> · Token: A012 · Vitals: BP 120/80 mmHg, SpO2 99%
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '0.85rem' }}>
              Follow-up visit for upper respiratory tract symptoms. Improving well on current antibiotics.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--teal)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>Cardiology Review & ECG</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>15 October 2026</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Attending: <strong>Dr. Anitha Rajan</strong> · Diagnosis: Hypertension Stage 1
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '0.85rem' }}>
              12-lead ECG showed normal sinus rhythm. Prescribed Telmisartan 40mg + Amlodipine 5mg. Advised daily morning BP charting.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #805AD5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>Inpatient Admission — General Ward A</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10 July 2026 – 17 July 2026</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Bed: GWA-012 · Admitting: <strong>Dr. Ramesh Kumar</strong> · Discharge Summary: Dengue Fever Recovery
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '0.85rem' }}>
              Treated with IV hydration and supportive therapy. Platelet counts stabilized at 1.8 lacs/μL prior to discharge.
            </p>
          </div>
        </div>
      )}

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {PRESCRIPTIONS.map((rx) => (
            <div key={rx.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800 }}>{rx.diagnosis}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rx.date}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Prescribed by <strong>{rx.doctorName}</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                {rx.medicines.map((m, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    <strong>{m.name} {m.strength}</strong> — {m.dosage} ({m.frequency}) for {m.duration} [{m.instructions}]
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Lab Tab */}
      {activeTab === 'lab' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {LAB_REPORTS.map((rep) => (
            <div key={rep.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 800 }}>🔬 {rep.name}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#DCFCE7', color: '#166534' }}>
                  {rep.status}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Ordered by: {rep.orderedBy} · Date: {rep.date} · Lab: {rep.lab}
              </div>
              {rep.findings && (
                <div style={{ marginTop: '8px', padding: '0.75rem', background: 'var(--surface-2)', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <strong>Findings:</strong> {rep.findings}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Admissions Tab */}
      {activeTab === 'admissions' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {ADMISSIONS.map((adm) => (
            <div key={adm.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 800 }}>🛏️ {adm.admissionNumber} — {adm.ward}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#E0E7FF', color: '#3730A3' }}>
                  {adm.status}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Patient: <strong>{adm.patientName}</strong> · Bed: {adm.bedNumber} · Admitted by: {adm.admittingDoctor}
              </div>
              <div style={{ fontSize: '0.82rem', marginTop: '6px' }}>
                <strong>Diagnosis:</strong> {adm.diagnosis}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Admitted: {adm.admissionDate} {adm.dischargeDate ? `· Discharged: ${adm.dischargeDate}` : '· Currently Admitted'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
