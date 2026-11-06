import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboards
import PatientDashboard from './pages/dashboard/PatientDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import NurseDashboard from './pages/dashboard/NurseDashboard';
import StaffDashboard from './pages/dashboard/StaffDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Feature pages
import AppointmentsPage from './pages/features/AppointmentsPage';
import BookAppointmentPage from './pages/features/BookAppointmentPage';
import QueueTrackerPage from './pages/features/QueueTrackerPage';
import MedicalRecordsPage from './pages/features/MedicalRecordsPage';
import PrescriptionsPage from './pages/features/PrescriptionsPage';
import LabReportsPage from './pages/features/LabReportsPage';
import BillingPage from './pages/features/BillingPage';
import InsurancePage from './pages/features/InsurancePage';
import OpdPage from './pages/features/OpdPage';
import IpdPage from './pages/features/IpdPage';
import QueriesPage from './pages/features/QueriesPage';
import AdminUsersPage from './pages/features/AdminUsersPage';

// Layout
import AppLayout from './components/layout/AppLayout';
import { Role } from './data/demo';
import MediBot from './components/chatbot/MediBot';

function RequireAuth({ children, role }: { children: React.ReactNode; role: Role }) {
  const { isAuthenticated, role: userRole } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to={`/${role}/login`} state={{ from: location }} replace />;
  if (userRole !== role) return <Navigate to={`/${userRole}/dashboard`} replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/:role/login" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/patient/login" replace />} />

      {/* Patient routes */}
      <Route path="/patient/*" element={
        <RequireAuth role="patient">
          <AppLayout role="patient">
            <Routes>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="appointments/book" element={<BookAppointmentPage />} />
              <Route path="queue" element={<QueueTrackerPage />} />
              <Route path="records" element={<MedicalRecordsPage />} />
              <Route path="prescriptions" element={<PrescriptionsPage />} />
              <Route path="reports" element={<LabReportsPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="insurance" element={<InsurancePage />} />
              <Route path="queries" element={<QueriesPage />} />
            </Routes>
          </AppLayout>
        </RequireAuth>
      } />

      {/* Doctor routes */}
      <Route path="/doctor/*" element={
        <RequireAuth role="doctor">
          <AppLayout role="doctor">
            <Routes>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="prescriptions" element={<PrescriptionsPage />} />
              <Route path="reports" element={<LabReportsPage />} />
              <Route path="records" element={<MedicalRecordsPage />} />
              <Route path="opd" element={<OpdPage />} />
            </Routes>
          </AppLayout>
        </RequireAuth>
      } />

      {/* Nurse routes */}
      <Route path="/nurse/*" element={
        <RequireAuth role="nurse">
          <AppLayout role="nurse">
            <Routes>
              <Route path="dashboard" element={<NurseDashboard />} />
              <Route path="ipd" element={<IpdPage />} />
              <Route path="opd" element={<OpdPage />} />
            </Routes>
          </AppLayout>
        </RequireAuth>
      } />

      {/* Staff routes */}
      <Route path="/staff/*" element={
        <RequireAuth role="staff">
          <AppLayout role="staff">
            <Routes>
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="opd" element={<OpdPage />} />
              <Route path="ipd" element={<IpdPage />} />
              <Route path="queries" element={<QueriesPage />} />
            </Routes>
          </AppLayout>
        </RequireAuth>
      } />

      {/* Admin routes */}
      <Route path="/admin/*" element={
        <RequireAuth role="admin">
          <AppLayout role="admin">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="insurance" element={<InsurancePage />} />
              <Route path="opd" element={<OpdPage />} />
              <Route path="ipd" element={<IpdPage />} />
              <Route path="queries" element={<QueriesPage />} />
              <Route path="reports" element={<LabReportsPage />} />
            </Routes>
          </AppLayout>
        </RequireAuth>
      } />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <MediBot />
  </>
  );
}
