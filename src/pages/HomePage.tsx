import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import AmbulanceServiceModal from '../components/common/AmbulanceServiceModal';

const ROLE_CARDS = [
  {
    role: 'patient',
    icon: '🏥',
    color: 'patient',
    features: ['Book appointments online', 'Live token tracking', 'Medical history & prescriptions'],
  },
  {
    role: 'doctor',
    icon: '👨‍⚕️',
    color: 'doctor',
    features: ['Daily appointment queue', 'Create & sign prescriptions', 'Access patient records'],
  },
  {
    role: 'nurse',
    icon: '💉',
    color: 'nurse',
    features: ['Ward patient tracking', 'Record vital signs', 'Nursing observations'],
  },
  {
    role: 'staff',
    icon: '🗂️',
    color: 'staff',
    features: ['Reception & registration', 'Queue management', 'Billing operations'],
  },
  {
    role: 'admin',
    icon: '🛡️',
    color: 'admin',
    features: ['Full system control', 'Audit logs & analytics', 'User & role management'],
  },
];

const FEATURES = [
  { icon: '📅', title: 'Easy Appointment Booking', desc: 'Book doctors in 3 simple steps. Available 24/7 across 25+ specialties.' },
  { icon: '🎫', title: 'Automatic Token Generation', desc: 'Get a unique queue token and track your live waiting position in real time.' },
  { icon: '🚑', title: '24/7 Emergency & Ambulance', desc: 'Instant SOS dispatch for Advanced Cardiac (ALS) and Basic Life Support (BLS) units.' },
  { icon: '📱', title: 'WhatsApp & SMS Alerts', desc: 'Receive instant notifications for appointments, prescriptions, and queue turns.' },
  { icon: '📋', title: 'Complete Medical Records', desc: 'All your diagnostic reports, prescriptions, and visit histories in one secure vault.' },
  { icon: '🧾', title: 'Digital Billing & Insurance', desc: 'Transparent itemized invoices, cashless claim processing, and instant receipts.' },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [ambulanceOpen, setAmbulanceOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Emergency Top Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)',
          color: 'white',
          padding: '0.45rem 1rem',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          fontWeight: 600,
          textAlign: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span>🚨 <strong>24/7 Emergency & Trauma Response:</strong> Call <strong>108</strong> / <strong>102</strong></span>
        <button
          onClick={() => setAmbulanceOpen(true)}
          style={{
            background: 'white',
            color: '#DC2626',
            border: 'none',
            borderRadius: '20px',
            padding: '2px 10px',
            fontWeight: 800,
            fontSize: '0.78rem',
            cursor: 'pointer',
          }}
        >
          🚑 Request Ambulance
        </button>
      </div>

      {/* Header */}
      <header className="site-header">
        <Link className="brand" to="/">
          MediCare <span>360</span>
          <span className="brand-badge">DEMO</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/patient/login">{t('nav.patientLogin')}</Link>
          <Link to="/doctor/login">{t('nav.doctorLogin')}</Link>
          <button
            onClick={() => setAmbulanceOpen(true)}
            style={{
              background: 'rgba(220, 38, 38, 0.1)',
              color: '#DC2626',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '20px',
              padding: '0.35rem 0.85rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            🚑 Ambulance
          </button>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Hero */}
        <section className="hero">
          <div className="hero-badge">🏥 Your Health, One Platform</div>
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-xl" to="/patient/login">
              📅 {t('home.bookAppointment')}
            </Link>
            <Link className="btn btn-outline btn-xl" to="/patient/login">
              🎫 Track My Token
            </Link>
            <button
              className="btn btn-xl"
              onClick={() => setAmbulanceOpen(true)}
              style={{
                background: '#DC2626',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
              }}
            >
              🚑 Emergency Ambulance
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>50,000+</strong><span>Patients Served</span></div>
            <div className="hero-stat"><strong>120+</strong><span>Specialist Doctors</span></div>
            <div className="hero-stat"><strong>8 mins</strong><span>Avg Ambulance ETA</span></div>
            <div className="hero-stat"><strong>98%</strong><span>Satisfaction Rate</span></div>
          </div>
        </section>

        {/* Demo Banner */}
        <div className="demo-banner">
          ⚠️ <span>This is a <strong>demonstration build</strong>. No real patient data. Use demo credentials to explore each role.</span>
        </div>

        {/* Portal Cards */}
        <section className="portal-section" aria-labelledby="portals-heading">
          <div className="section-header">
            <div>
              <h2 className="section-title" id="portals-heading">{t('home.portalTitle')}</h2>
              <p className="section-subtitle">Choose your designated role to enter the system</p>
            </div>
          </div>
          <div className="card-grid">
            {ROLE_CARDS.map(({ role, icon, color, features }) => (
              <Link key={role} to={`/${role}/login`} style={{ textDecoration: 'none' }}>
                <article className={`role-card ${color}`}>
                  <div className="role-card-icon">{icon}</div>
                  <div className="role-card-title">{t(`roles.${role}`)}</div>
                  <div className="role-card-desc">
                    <ul style={{ paddingLeft: 0 }}>
                      {features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--green)', marginTop: 2 }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="role-card-link">
                    {t('home.signIn')} →
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Ambulance & Emergency Feature Highlight Card */}
        <section style={{ marginBottom: '3rem' }}>
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.06) 0%, rgba(13, 148, 136, 0.08) 100%)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              padding: '2rem',
              borderRadius: 'var(--radius-lg, 16px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ maxWidth: '650px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEE2E2', color: '#B91C1C', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  🚑 24/7 Rapid Ambulance Dispatch
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
                  State-of-the-Art Mobile Intensive Care Fleet
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Equipped with telemetry defibrillators, transport ventilators, life-support medication, and certified EMT paramedics. Real-time GPS tracking and live hospital ER pre-alert.
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', fontWeight: 600 }}>
                  <span>✓ Advanced Cardiac ICU (ALS)</span>
                  <span>✓ Basic Life Support (BLS)</span>
                  <span>✓ Neonatal Incubator Unit</span>
                  <span>✓ Non-Emergency Stretcher Van</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => setAmbulanceOpen(true)}
                  className="btn btn-lg"
                  style={{ background: '#DC2626', color: 'white', fontWeight: 800, padding: '0.85rem 1.5rem' }}
                >
                  🚨 Dispatch Ambulance Now
                </button>
                <a
                  href="tel:108"
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: '#DC2626', color: '#DC2626', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}
                >
                  📞 Direct Hotline: 108
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section style={{ marginBottom: '3rem' }} aria-labelledby="features-heading">
          <div className="section-header">
            <div>
              <h2 className="section-title" id="features-heading">Everything You Need</h2>
              <p className="section-subtitle">A unified, modern hospital management ecosystem</p>
            </div>
          </div>
          <div className="card-grid-2">
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Credentials */}
        <section style={{ marginBottom: '3rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--teal-light))' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>🔑 Demo Login Credentials (All 5 Roles)</h2>
            <div className="card-grid">
              {ROLE_CARDS.map(({ role, icon }) => (
                <div key={role} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '0.875rem', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, textTransform: 'capitalize', display: 'flex', gap: 6, alignItems: 'center' }}>
                    {icon} {role}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    📧 {role}@demo.com<br />
                    🔒 demo1234
                  </div>
                  <Link
                    to={`/${role}/login`}
                    className="btn btn-sm btn-outline"
                    style={{ marginTop: '0.75rem', width: '100%', textDecoration: 'none', textAlign: 'center', display: 'block' }}
                  >
                    Open {role} Portal →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        {t('app.footer')} · <span style={{ color: 'var(--text-muted)' }}>Demonstration build — not for real patient use</span>
      </footer>

      {/* Ambulance Modal */}
      <AmbulanceServiceModal isOpen={ambulanceOpen} onClose={() => setAmbulanceOpen(false)} />
    </div>
  );
}
