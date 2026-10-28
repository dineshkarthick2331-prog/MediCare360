import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_STATS, DEPARTMENTS, DEMO_USERS, AMBULANCES } from '../../data/demo';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'fleet' | 'users'>('overview');

  return (
    <div>
      <div className="demo-banner">
        ⚠️ Demo mode — <strong>System Administrator</strong>, Full Hospital Management & Analytics
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Executive & Admin Command Center 🛡️</h1>
          <p className="page-subtitle">Hospital Operations, Resource Allocation, Revenue & Emergency Fleet Control</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm">📊 Export Daily Report</button>
          <button className="btn btn-primary btn-sm">⚙️ System Settings</button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '1.5rem' }}>
        {[
          { icon: '👥', label: 'Registered Patients', value: ADMIN_STATS.totalPatients.toLocaleString(), color: '#1769AA', bg: 'var(--primary-light)' },
          { icon: '📅', label: 'Today Appointments', value: String(ADMIN_STATS.todayAppointments), color: '#0D9488', bg: 'var(--teal-light)' },
          { icon: '🛏️', label: 'Bed Occupancy', value: `${ADMIN_STATS.bedOccupancy}%`, color: '#805AD5', bg: 'var(--purple-light)' },
          { icon: '💰', label: 'Today Revenue', value: `₹${ADMIN_STATS.revenue.toLocaleString()}`, color: '#16A34A', bg: 'var(--green-light)' },
          { icon: '🚑', label: 'Ambulances Ready', value: String(AMBULANCES.filter(a => a.status === 'Available').length), color: '#DC2626', bg: 'var(--red-light)' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: '1.5rem' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
        {[
          { id: 'overview', label: 'Hospital Overview' },
          { id: 'departments', label: 'Departments & Doctors' },
          { id: 'fleet', label: 'Ambulance & Emergency Fleet' },
          { id: 'users', label: 'Role & User Accounts' },
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

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Patient Flow & OPD Statistics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OPD Consultations</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{ADMIN_STATS.opdVisits}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>New IPD Admissions</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#805AD5' }}>{ADMIN_STATS.ipdAdmissions}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active On-Duty Doctors</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0D9488' }}>{ADMIN_STATS.activeDoctors}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Insurance Claims</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D69E2E' }}>{ADMIN_STATS.pendingClaims}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Inpatient Ward & Bed Utilization</h2>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                <span>Occupied Beds ({Math.round(ADMIN_STATS.totalBeds * 0.73)} / {ADMIN_STATS.totalBeds})</span>
                <span style={{ fontWeight: 700 }}>73%</span>
              </div>
              <div style={{ height: '10px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '73%', height: '100%', background: 'var(--teal)' }} />
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div>• <strong>General Ward A:</strong> 14 of 20 beds occupied (70%)</div>
              <div>• <strong>Maternity Ward:</strong> 9 of 12 beds occupied (75%)</div>
              <div>• <strong>Cardiac ICU:</strong> 6 of 8 beds occupied (75%)</div>
              <div>• <strong>Emergency Holding:</strong> 4 of 6 beds occupied (66%)</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Departments */}
      {activeTab === 'departments' && (
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Active Medical Departments</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--surface-2)',
                }}
              >
                <span style={{ fontSize: '2rem' }}>{dept.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{dept.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {dept.doctorCount} Doctors On Duty
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Fleet & Ambulance */}
      {activeTab === 'fleet' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Rapid Response Ambulance Fleet</h2>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '3px 10px', borderRadius: '12px' }}>
              4 Units Monitored Live
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {AMBULANCES.map((amb) => (
              <div
                key={amb.id}
                style={{
                  border: '1px solid var(--border)',
                  borderLeft: '4px solid #DC2626',
                  borderRadius: '10px',
                  padding: '1rem',
                  background: 'var(--surface)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>🚑 {amb.vehicleNumber}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: '10px' }}>
                    {amb.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <div><strong>Category:</strong> {amb.type}</div>
                  <div><strong>Driver:</strong> {amb.driverName} ({amb.driverPhone})</div>
                  <div><strong>Paramedic:</strong> {amb.paramedicName}</div>
                  <div><strong>Location:</strong> {amb.currentLocation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Users */}
      {activeTab === 'users' && (
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Demo Portal Users & Credentials</h2>
          <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '8px' }}>User</th>
                <th style={{ padding: '8px' }}>Role</th>
                <th style={{ padding: '8px' }}>Email</th>
                <th style={{ padding: '8px' }}>Department</th>
                <th style={{ padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_USERS.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px' }}>
                    <span style={{ marginRight: '6px' }}>{u.avatar}</span>
                    <strong>{u.name}</strong>
                  </td>
                  <td style={{ padding: '8px', textTransform: 'capitalize' }}>{u.role}</td>
                  <td style={{ padding: '8px' }}><code>{u.email}</code></td>
                  <td style={{ padding: '8px' }}>{u.department || 'N/A'}</td>
                  <td style={{ padding: '8px', color: '#16A34A', fontWeight: 700 }}>Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
