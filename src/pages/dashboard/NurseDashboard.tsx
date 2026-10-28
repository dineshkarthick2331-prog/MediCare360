import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ADMISSIONS, NURSING_OBS, WARDS, NursingObservation } from '../../data/demo';

export default function NurseDashboard() {
  const { user } = useAuth();
  const [observations, setObservations] = useState<NursingObservation[]>(NURSING_OBS);
  const [selectedWard, setSelectedWard] = useState<string>('all');

  // Form for recording new vitals
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [newVitals, setNewVitals] = useState({
    patientName: 'Priya Sharma (MW-204)',
    temperature: '98.6°F',
    bloodPressure: '120/80 mmHg',
    pulse: '78 bpm',
    oxygen: '99%',
    notes: 'Patient resting comfortably. Normal respiration.',
  });

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: NursingObservation = {
      id: `obs-${Date.now()}`,
      patientId: 'pat-002',
      admissionId: 'adm-001',
      nurseId: user?.id || 'nur-001',
      nurseName: user?.name || 'Meena Lakshmi',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      temperature: newVitals.temperature,
      bloodPressure: newVitals.bloodPressure,
      pulse: newVitals.pulse,
      oxygen: newVitals.oxygen,
      notes: newVitals.notes,
    };
    setObservations([newEntry, ...observations]);
    setShowVitalsModal(false);
  };

  return (
    <div>
      <div className="demo-banner">
        ⚠️ Demo mode — <strong>{user?.name || 'Meena Lakshmi'}</strong>, Nurse In-Charge, Inpatient Care
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Nursing Station & Ward Care 💉</h1>
          <p className="page-subtitle">Shift: Morning (07:00 – 15:00) · Inpatient Care Units</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowVitalsModal(true)} className="btn btn-primary btn-sm">
            ➕ Record Vitals
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => alert('Code Blue / Emergency Response Team Alerted!')}>
            🚨 Emergency / Code Blue
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '1.5rem' }}>
        {[
          { icon: '🛏️', label: 'Inpatients in Ward', value: '18', color: '#805AD5', bg: 'var(--purple-light)' },
          { icon: '🩺', label: 'Vitals Due', value: '4', color: '#D69E2E', bg: 'var(--amber-light)' },
          { icon: '💊', label: 'Medications Pending', value: '6', color: '#1769AA', bg: 'var(--primary-light)' },
          { icon: '✅', label: 'Observations Logged', value: String(observations.length), color: '#38A169', bg: 'var(--green-light)' },
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

      {/* Ward Patients Grid */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Active Inpatient Wards</h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className={`btn btn-sm ${selectedWard === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedWard('all')}
            >
              All Beds
            </button>
            {WARDS.map((w) => (
              <button
                key={w.id}
                className={`btn btn-sm ${selectedWard === w.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedWard(w.id)}
              >
                {w.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {WARDS.filter((w) => selectedWard === 'all' || w.id === selectedWard)
            .flatMap((w) => w.beds.map((b) => ({ ...b, wardName: w.name })))
            .map((bed) => {
              const isOccupied = bed.status === 'occupied';
              return (
                <div
                  key={bed.number}
                  style={{
                    border: `1px solid ${isOccupied ? '#CBD5E1' : '#E2E8F0'}`,
                    borderLeft: `4px solid ${isOccupied ? '#805AD5' : '#10B981'}`,
                    borderRadius: '8px',
                    padding: '0.75rem',
                    background: 'var(--surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{bed.number}</span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        background: isOccupied ? '#EDE9FE' : '#D1FAE5',
                        color: isOccupied ? '#6D28D9' : '#065F46',
                      }}
                    >
                      {bed.status}
                    </span>
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: isOccupied ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {isOccupied ? <strong>{bed.patientName}</strong> : 'Vacant Bed'}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Recent Nursing Observations Log */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Recent Vital Signs & Nursing Notes</h2>
          <button onClick={() => setShowVitalsModal(true)} className="btn btn-outline btn-sm">
            ➕ Add Observation
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '8px' }}>Time</th>
                <th style={{ padding: '8px' }}>Patient / Bed</th>
                <th style={{ padding: '8px' }}>Nurse</th>
                <th style={{ padding: '8px' }}>Temp</th>
                <th style={{ padding: '8px' }}>BP</th>
                <th style={{ padding: '8px' }}>Pulse</th>
                <th style={{ padding: '8px' }}>SpO2</th>
                <th style={{ padding: '8px' }}>Observations & Care Notes</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((obs) => (
                <tr key={obs.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px', whiteSpace: 'nowrap', fontWeight: 600 }}>{obs.time}</td>
                  <td style={{ padding: '8px' }}>
                    <strong>Priya Sharma</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MW-204</div>
                  </td>
                  <td style={{ padding: '8px' }}>{obs.nurseName}</td>
                  <td style={{ padding: '8px' }}>{obs.temperature}</td>
                  <td style={{ padding: '8px' }}>{obs.bloodPressure}</td>
                  <td style={{ padding: '8px' }}>{obs.pulse}</td>
                  <td style={{ padding: '8px', color: '#15803D', fontWeight: 700 }}>{obs.oxygen}</td>
                  <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{obs.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Vitals Modal */}
      {showVitalsModal && (
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
          <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1.5rem', maxWidth: '450px', width: '100%', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800 }}>Record Patient Vitals</h3>
            <form onSubmit={handleAddVitals}>
              <div className="form-field" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Patient & Bed</label>
                <input
                  type="text"
                  value={newVitals.patientName}
                  onChange={(e) => setNewVitals({ ...newVitals, patientName: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Temperature</label>
                  <input
                    type="text"
                    value={newVitals.temperature}
                    onChange={(e) => setNewVitals({ ...newVitals, temperature: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Blood Pressure</label>
                  <input
                    type="text"
                    value={newVitals.bloodPressure}
                    onChange={(e) => setNewVitals({ ...newVitals, bloodPressure: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pulse</label>
                  <input
                    type="text"
                    value={newVitals.pulse}
                    onChange={(e) => setNewVitals({ ...newVitals, pulse: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>SpO2 (%)</label>
                  <input
                    type="text"
                    value={newVitals.oxygen}
                    onChange={(e) => setNewVitals({ ...newVitals, oxygen: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    required
                  />
                </div>
              </div>
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Observations & Care Notes</label>
                <textarea
                  rows={2}
                  value={newVitals.notes}
                  onChange={(e) => setNewVitals({ ...newVitals, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowVitalsModal(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
