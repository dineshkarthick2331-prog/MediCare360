import React from 'react';
import { INVOICES } from '../../data/demo';

export default function BillingPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Hospital Billing & Invoices 🧾</h1>
          <p className="page-subtitle">Itemized invoices, insurance deductions, receipts, and payment portal</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {INVOICES.map((inv) => {
          const subtotal = inv.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
          const netPayable = subtotal - inv.discount - inv.insuranceCoverage;
          return (
            <div key={inv.id} className="card" style={{ borderTop: `4px solid ${inv.status === 'Paid' ? '#16A34A' : '#DC2626'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{inv.billNumber}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Patient: <strong>{inv.patientName}</strong> · Date: {inv.date} · Type: {inv.visitType}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: inv.status === 'Paid' ? '#DCFCE7' : '#FEE2E2',
                      color: inv.status === 'Paid' ? '#166534' : '#991B1B',
                    }}
                  >
                    {inv.status}
                  </span>
                  <button onClick={() => alert(`Receipt #${inv.billNumber} downloading…`)} className="btn btn-sm btn-outline">
                    🖨️ Receipt
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <table className="table" style={{ width: '100%', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '6px' }}>Service / Item</th>
                    <th style={{ padding: '6px' }}>Category</th>
                    <th style={{ padding: '6px' }}>Qty</th>
                    <th style={{ padding: '6px', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '6px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.items.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '6px' }}>{it.description}</td>
                      <td style={{ padding: '6px', color: 'var(--text-muted)' }}>{it.category}</td>
                      <td style={{ padding: '6px' }}>{it.quantity}</td>
                      <td style={{ padding: '6px', textAlign: 'right' }}>₹{it.unitPrice.toLocaleString()}</td>
                      <td style={{ padding: '6px', textAlign: 'right', fontWeight: 600 }}>₹{(it.quantity * it.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ minWidth: '240px', fontSize: '0.85rem', lineHeight: 1.8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {inv.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                      <span>Hospital Concession:</span>
                      <span>-₹{inv.discount.toLocaleString()}</span>
                    </div>
                  )}
                  {inv.insuranceCoverage > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                      <span>Insurance Cashless:</span>
                      <span>-₹{inv.insuranceCoverage.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', borderTop: '2px solid var(--border)', paddingTop: '6px', marginTop: '4px' }}>
                    <span>Net Balance:</span>
                    <span style={{ color: inv.status === 'Paid' ? '#16A34A' : '#DC2626' }}>
                      ₹{netPayable.toLocaleString()}
                    </span>
                  </div>
                  {inv.status === 'Unpaid' && (
                    <button
                      onClick={() => alert('Proceeding to Razorpay / UPI Payment Gateway simulation')}
                      className="btn btn-primary btn-sm w-full"
                      style={{ marginTop: '0.75rem' }}
                    >
                      💳 Pay Now Online
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
