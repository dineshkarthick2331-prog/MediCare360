import React, { useState } from 'react';
import { DEMO_USERS, DemoUser, Role } from '../../data/demo';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DemoUser[]>(DEMO_USERS);
  const [filterRole, setFilterRole] = useState<string>('all');

  const filtered = users.filter((u) => filterRole === 'all' || u.role === filterRole);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">User & Role Management 👥</h1>
          <p className="page-subtitle">Manage hospital staff, doctors, nurses, patients, and administrators</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        {['all', 'patient', 'doctor', 'nurse', 'staff', 'admin'].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`btn btn-sm ${filterRole === r ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {r === 'all' ? 'All Roles' : r}
          </button>
        ))}
      </div>

      <div className="card">
        <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '8px' }}>User</th>
              <th style={{ padding: '8px' }}>Role</th>
              <th style={{ padding: '8px' }}>Email</th>
              <th style={{ padding: '8px' }}>Department</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px' }}>
                  <span style={{ marginRight: '6px' }}>{u.avatar}</span>
                  <strong>{u.name}</strong>
                </td>
                <td style={{ padding: '8px', textTransform: 'capitalize' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, background: 'var(--surface-2)' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '8px' }}><code>{u.email}</code></td>
                <td style={{ padding: '8px' }}>{u.department || 'General'}</td>
                <td style={{ padding: '8px', color: '#16A34A', fontWeight: 700 }}>● Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
