import React, { useState, useEffect } from 'react';
import { QUEUE } from '../../data/demo';

export default function QueueTrackerPage() {
  const [currentToken, setCurrentToken] = useState('A011');
  const myToken = 'A012';

  const myQueueIdx = QUEUE.findIndex((q) => q.token === myToken);
  const currentIdx = QUEUE.findIndex((q) => q.token === currentToken);
  const tokensAhead = Math.max(0, myQueueIdx - currentIdx);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Live OPD Queue Tracker 🎫</h1>
        <p className="page-subtitle">Real-time token display and queue monitoring for Doctor Chambers</p>
      </div>

      {/* Main Big Token Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--teal) 100%)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
          borderRadius: '16px',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ fontSize: '0.9rem', opacity: 0.9, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Now Serving in Room 104 (Dr. Ramesh Kumar)
        </div>
        <div style={{ fontSize: '5rem', fontWeight: 900, margin: '0.5rem 0', letterSpacing: '-0.02em' }}>
          {currentToken}
        </div>
        <div style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.2)', padding: '4px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 700 }}>
          ⚡ Consultation In Progress
        </div>
      </div>

      {/* Patient's specific token box */}
      <div
        className="card"
        style={{
          borderLeft: '5px solid #0D9488',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>YOUR ASSIGNED TOKEN</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teal)' }}>{myToken}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Patient: Dinesh Karthick · General Medicine OPD
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: tokensAhead === 1 ? '#D69E2E' : 'inherit' }}>
            {tokensAhead === 0 ? '🎉 It is your turn now!' : `${tokensAhead} Patient Ahead of You`}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Estimated wait time: ~{tokensAhead * 12} minutes
          </div>
        </div>
      </div>

      {/* Live Queue Table */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Today's Token Sequence</h2>
        <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '8px' }}>Token #</th>
              <th style={{ padding: '8px' }}>Patient</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px' }}>Est. Time</th>
            </tr>
          </thead>
          <tbody>
            {QUEUE.map((item) => {
              const isServing = item.token === currentToken;
              const isMine = item.token === myToken;
              return (
                <tr
                  key={item.token}
                  style={{
                    background: isMine ? 'rgba(13, 148, 136, 0.08)' : isServing ? 'rgba(23, 105, 170, 0.08)' : 'transparent',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <td style={{ padding: '8px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        background: isMine ? 'var(--teal)' : isServing ? 'var(--primary)' : 'var(--surface-2)',
                        color: isMine || isServing ? 'white' : 'inherit',
                      }}
                    >
                      {item.token}
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <strong>{item.patientName}</strong>
                    {isMine && <span style={{ marginLeft: '6px', fontSize: '0.75rem', color: 'var(--teal)', fontWeight: 700 }}>(You)</span>}
                  </td>
                  <td style={{ padding: '8px' }}>
                    {isServing ? (
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>● In Consultation</span>
                    ) : item.status === 'done' ? (
                      <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Completed</span>
                    ) : (
                      <span style={{ color: 'var(--amber)', fontWeight: 600 }}>⏳ Waiting</span>
                    )}
                  </td>
                  <td style={{ padding: '8px', color: 'var(--text-muted)' }}>
                    {item.estimatedTime || (item.status === 'done' ? 'Done' : '—')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
