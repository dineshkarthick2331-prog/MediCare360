import React, { useState } from 'react';
import { QUERIES, PatientQuery } from '../../data/demo';

export default function QueriesPage() {
  const [queries, setQueries] = useState<PatientQuery[]>(QUERIES);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const item: PatientQuery = {
      id: `qry-${Date.now()}`,
      queryRef: `QRY-2026-0${queries.length + 90}`,
      patientId: 'pat-001',
      patientName: 'Dinesh Karthick',
      category: 'General',
      subject: newSubject,
      message: newMessage,
      status: 'Open',
      priority: 'Medium',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      responses: [],
    };
    setQueries([item, ...queries]);
    setShowNewModal(false);
    setNewSubject('');
    setNewMessage('');
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Patient Support & Helpdesk 💬</h1>
          <p className="page-subtitle">Submit queries regarding appointments, billing, reports, or insurance</p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="btn btn-primary btn-sm">
          ➕ New Helpdesk Ticket
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {queries.map((q) => (
          <div key={q.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{q.subject}</span>
                <span style={{ marginLeft: '8px', fontSize: '0.75rem', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: '4px' }}>
                  {q.queryRef}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: q.status === 'Open' ? '#FEF3C7' : '#DCFCE7', color: q.status === 'Open' ? '#B45309' : '#166534' }}>
                {q.status}
              </span>
            </div>
            <p style={{ margin: '6px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{q.message}</p>
            {q.responses.map((resp, idx) => (
              <div key={idx} style={{ marginTop: '8px', padding: '0.75rem', background: 'var(--surface-2)', borderRadius: '8px', fontSize: '0.8rem', borderLeft: '3px solid var(--teal)' }}>
                <strong>{resp.from}:</strong> {resp.message}
              </div>
            ))}
          </div>
        ))}
      </div>

      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1.5rem', maxWidth: '450px', width: '100%', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800 }}>New Support Ticket</h3>
            <form onSubmit={handleCreate}>
              <div className="form-field" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question regarding prescription dosage"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Message Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your issue or question in detail…"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowNewModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
