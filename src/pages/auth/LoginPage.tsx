import React, { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Role } from '../../data/demo';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const allowedRoles: Role[] = ['patient', 'doctor', 'nurse', 'staff', 'admin'];

const ROLE_META: Record<Role, { icon: string; color: string; illustration: string; features: string[] }> = {
  patient: {
    icon: '🏥', color: '#1769AA', illustration: '🤒',
    features: ['Book appointments easily', 'Track your queue token live', 'Access all your medical records', 'Download prescriptions & bills'],
  },
  doctor: {
    icon: '👨‍⚕️', color: '#0D9488', illustration: '🩺',
    features: ['View today\'s appointment queue', 'Create & sign prescriptions', 'Access patient medical history', 'Manage your schedule & availability'],
  },
  nurse: {
    icon: '💉', color: '#805AD5', illustration: '🏨',
    features: ['View assigned ward patients', 'Record vital signs & observations', 'Manage nursing tasks & care plans', 'Track medication schedules'],
  },
  staff: {
    icon: '🗂️', color: '#D69E2E', illustration: '🖥️',
    features: ['Register & manage patients', 'Handle appointment scheduling', 'Process billing & receipts', 'Manage admission workflows'],
  },
  admin: {
    icon: '🛡️', color: '#E53E3E', illustration: '📊',
    features: ['Full hospital management', 'User roles & permissions', 'Revenue & analytics dashboard', 'System configuration & audit'],
  },
};

export default function LoginPage() {
  const { role = 'patient' } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  if (!allowedRoles.includes(role as Role)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>{t('auth.invalidRole')}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Home</Link>
      </div>
    );
  }

  const r = role as Role;
  const meta = ROLE_META[r];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password, r);
      navigate(`/${r}/dashboard`);
    } catch (err: any) {
      setError(err.message || t('auth.loginFailed'));
    } finally {
      setBusy(false);
    }
  }

  function handleDemoLogin() {
    demoLogin(r);
    navigate(`/${r}/dashboard`);
  }

  return (
    <div className="login-page" style={{ minHeight: '100vh' }}>
      {/* Left — Branding */}
      <div className="login-left" style={{ background: `linear-gradient(145deg, ${meta.color} 0%, #0D9488 100%)` }}>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            MediCare <span style={{ opacity: 0.85 }}>360</span>
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '2.5rem' }}>Your Health, One Platform</div>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>{meta.illustration}</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', opacity: 0.95, textTransform: 'capitalize' }}>
            {r} Portal
          </h2>
          {meta.features.map((f, i) => (
            <div key={i} className="login-feature">
              <span className="login-feature-icon">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="login-right">
        <div className="login-box">
          {/* Top bar actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
              ← Back
            </Link>
            <div style={{ display: 'flex', gap: 8 }}>
              <LanguageSwitcher />
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Role badge */}
          <div
            className="login-role-badge"
            style={{ background: `${meta.color}20`, color: meta.color }}
          >
            {meta.icon} {r} login
          </div>

          <h1 className="login-title">{t('auth.loginTitle', { role: t(`roles.${r}`) })}</h1>
          <p className="login-subtitle">{t('auth.loginSubtitle')}</p>

          {/* Demo quick login */}
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.5rem',
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              🔑 Demo Credentials
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Email: <code style={{ color: 'var(--primary)' }}>{r}@demo.com</code> &nbsp;|&nbsp;
              Password: <code style={{ color: 'var(--primary)' }}>demo1234</code>
            </div>
            <button
              type="button"
              className="btn btn-teal btn-sm"
              onClick={handleDemoLogin}
              style={{ width: '100%' }}
            >
              ⚡ One-click Demo Login
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or sign in manually</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="email">{t('auth.email')}</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                placeholder={`${r}@demo.com`}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="password">{t('auth.password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem',
                  }}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem 1rem' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={busy}
              style={{ background: meta.color, marginBottom: '1rem' }}
            >
              {busy ? <><span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span> Signing in…</> : `${t('auth.signIn')} →`}
            </button>
          </form>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
            {t('auth.noAccount')}{' '}
            <Link to="/patient/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {t('auth.contactRegistration')}
            </Link>
          </p>

          {/* Other portals */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
              Other portals
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {allowedRoles.filter(ro => ro !== r).map(ro => (
                <Link key={ro} to={`/${ro}/login`} className="btn btn-ghost btn-sm" style={{ textTransform: 'capitalize' }}>
                  {ROLE_META[ro].icon} {ro}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
