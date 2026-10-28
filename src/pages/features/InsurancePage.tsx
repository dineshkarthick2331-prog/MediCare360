import React from 'react';
import { INSURANCE } from '../../data/demo';

export default function InsurancePage() {
  const policy = INSURANCE[0];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Health Insurance & TPA Desk 🛡️</h1>
          <p className="page-subtitle">Cashless pre-authorization, policy status, and claim history</p>
        </div>
        <button onClick={() => alert('Opening Cashless Claim Pre-Authorization Form')} className="btn btn-primary btn-sm">
          ➕ Submit New Pre-Auth Claim
        </button>
      </div>

      {/* Policy Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
          color: 'white',
          padding: '1.75rem',
          borderRadius: '16px',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Primary Health Insurance Provider</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>{policy.insurer}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>
              Policy #: <strong>{policy.policyNumber}</strong> · Holder: <strong>{policy.holderName}</strong>
            </div>
          </div>
          <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
            ✓ {policy.status} Cashless Network
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Sum Insured</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{policy.coverageLimit.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Utilized Amount</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{policy.usedAmount.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Remaining Balance</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{(policy.coverageLimit - policy.usedAmount).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Valid Period</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Till {policy.validTo}</div>
          </div>
        </div>
      </div>

      {/* Claims History */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Past Claims & Pre-Authorizations</h2>
        <table className="table" style={{ width: '100%', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '8px' }}>Claim Ref</th>
              <th style={{ padding: '8px' }}>Date</th>
              <th style={{ padding: '8px' }}>Description</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Claimed</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Approved</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {policy.claims.map((cl) => (
              <tr key={cl.claimRef} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px', fontWeight: 700, color: 'var(--primary)' }}>{cl.claimRef}</td>
                <td style={{ padding: '8px' }}>{cl.date}</td>
                <td style={{ padding: '8px' }}>{cl.description}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹{cl.amount.toLocaleString()}</td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#16A34A' }}>
                  ₹{cl.approvedAmount.toLocaleString()}
                </td>
                <td style={{ padding: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: cl.status === 'Settled' ? '#DCFCE7' : '#FEF3C7',
                      color: cl.status === 'Settled' ? '#166534' : '#B45309',
                    }}
                  >
                    {cl.status}
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
