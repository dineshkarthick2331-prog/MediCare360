import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Role } from '../../data/demo';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  badge?: number;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  patient: [
    { path: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { path: 'appointments', icon: '📅', label: 'Appointments' },
    { path: 'queue', icon: '🎫', label: 'Live Queue' },
    { path: 'records', icon: '📋', label: 'Medical Records' },
    { path: 'prescriptions', icon: '💊', label: 'Prescriptions' },
    { path: 'reports', icon: '🔬', label: 'Lab Reports' },
    { path: 'billing', icon: '🧾', label: 'Billing' },
    { path: 'insurance', icon: '🛡️', label: 'Insurance' },
    { path: 'queries', icon: '💬', label: 'Support', badge: 1 },
  ],
  doctor: [
    { path: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { path: 'appointments', icon: '📅', label: 'Appointments' },
    { path: 'opd', icon: '🩺', label: 'OPD Consultation' },
    { path: 'prescriptions', icon: '💊', label: 'Prescriptions' },
    { path: 'reports', icon: '🔬', label: 'Lab Reports', badge: 3 },
    { path: 'records', icon: '📋', label: 'Patient Records' },
  ],
  nurse: [
    { path: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { path: 'ipd', icon: '🛏️', label: 'Ward / IPD' },
    { path: 'opd', icon: '🩺', label: 'OPD' },
  ],
  staff: [
    { path: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { path: 'appointments', icon: '📅', label: 'Appointments' },
    { path: 'opd', icon: '🩺', label: 'OPD Queue' },
    { path: 'ipd', icon: '🛏️', label: 'IPD / Admissions' },
    { path: 'billing', icon: '🧾', label: 'Billing' },
    { path: 'queries', icon: '💬', label: 'Queries', badge: 2 },
  ],
  admin: [
    { path: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { path: 'users', icon: '👥', label: 'User Management' },
    { path: 'appointments', icon: '📅', label: 'Appointments' },
    { path: 'opd', icon: '🩺', label: 'OPD' },
    { path: 'ipd', icon: '🛏️', label: 'IPD / Wards' },
    { path: 'billing', icon: '🧾', label: 'Billing' },
    { path: 'insurance', icon: '🛡️', label: 'Insurance' },
    { path: 'reports', icon: '📊', label: 'Reports' },
    { path: 'queries', icon: '💬', label: 'Queries', badge: 3 },
  ],
};

const ROLE_COLORS: Record<Role, string> = {
  patient: '#1769AA',
  doctor: '#0D9488',
  nurse: '#805AD5',
  staff: '#D69E2E',
  admin: '#E53E3E',
};

interface AppLayoutProps {
  role: Role;
  children: React.ReactNode;
}

export default function AppLayout({ role, children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems = NAV_ITEMS[role];
  const roleColor = ROLE_COLORS[role];

  const handleLogout = () => {
    logout();
    navigate(`/${role}/login`);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="auth-layout">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <span className="sidebar-brand">Medicare <span>360</span></span>
          <button
            className="sidebar-close btn btn-icon btn-ghost"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >✕</button>
        </div>

        {/* Role badge */}
        <div style={{ padding: '0.75rem 1.25rem' }}>
          <span
            className="badge"
            style={{
              background: `${roleColor}20`,
              color: roleColor,
              fontSize: '0.72rem',
              textTransform: 'capitalize',
              letterSpacing: '0.06em',
            }}
          >
            ● {role} portal
          </span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={`/${role}/${item.path}`}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? (
                  <span className="nav-badge">{item.badge}</span>
                ) : null}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background: `linear-gradient(135deg, ${roleColor}, #0D9488)` }}>
              {initials}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name truncate">{user?.name ?? 'Demo User'}</div>
              <div className="sidebar-user-role">{role}</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm w-full"
            style={{ marginTop: '0.5rem', justifyContent: 'flex-start', gap: 8 }}
            onClick={handleLogout}
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="app-main">
        {/* Top Bar */}
        <header className="app-topbar">
          <button
            className="topbar-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >☰</button>

          <span className="topbar-title" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>
            MediCare <strong style={{ color: 'var(--primary)' }}>360</strong>
          </span>

          <div className="topbar-actions">
            <LanguageSwitcher />
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div style={{ position: 'relative' }}>
              <button className="notif-btn" onClick={() => setNotifOpen(o => !o)} aria-label="Notifications">
                🔔
                <span className="notif-dot" />
              </button>
              {notifOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '48px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)',
                  width: 300, zIndex: 200, padding: '0.5rem',
                }}>
                  <div style={{ padding: '0.75rem 1rem', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>
                    Notifications
                  </div>
                  {[
                    { icon: '✅', text: 'Appointment confirmed — Dr. Ramesh Kumar, Today 10:30 AM', time: '9:00 AM' },
                    { icon: '🎫', text: 'Your token is A012 — 1 patient ahead', time: '10:00 AM' },
                    { icon: '🔬', text: 'Lab report ready — Complete Blood Count', time: 'Yesterday' },
                  ].map((n, i) => (
                    <div key={i} style={{
                      padding: '0.75rem 1rem', display: 'flex', gap: 10, cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                    }}
                      className="sidebar-nav-item"
                    >
                      <span style={{ fontSize: '1.2rem' }}>{n.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn btn-ghost btn-sm w-full"
                    style={{ marginTop: 4 }}
                    onClick={() => setNotifOpen(false)}
                  >Close</button>
                </div>
              )}
            </div>
            <div className="sidebar-avatar" style={{
              width: 34, height: 34, fontSize: '0.85rem',
              background: `linear-gradient(135deg, ${roleColor}, #0D9488)`,
            }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
