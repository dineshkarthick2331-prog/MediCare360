import { describe, it, expect } from 'vitest';
import { DEMO_USERS, DOCTORS, DEPARTMENTS, AMBULANCES } from '../src/data/demo';
import en from '../src/i18n/locales/en.json';
import hi from '../src/i18n/locales/hi.json';
import ta from '../src/i18n/locales/ta.json';

describe('Phase 1 - MediCare 360 Verification', () => {
  it('should have demo credentials configured for all 5 roles', () => {
    const roles = ['patient', 'doctor', 'nurse', 'staff', 'admin'];
    roles.forEach((role) => {
      const user = DEMO_USERS.find((u) => u.role === role);
      expect(user).toBeDefined();
      expect(user?.email).toBe(`${role}@demo.com`);
      expect(user?.password).toBe('demo1234');
    });
  });

  it('should have emergency ambulance fleet configured with 24/7 readiness', () => {
    expect(AMBULANCES.length).toBeGreaterThanOrEqual(4);
    const als = AMBULANCES.find((a) => a.type.includes('ALS'));
    const bls = AMBULANCES.find((a) => a.type.includes('BLS'));
    expect(als).toBeDefined();
    expect(bls).toBeDefined();
    expect(als?.status).toBe('Available');
    expect(als?.driverPhone).toBeDefined();
    expect(als?.paramedicName).toBeDefined();
  });

  it('should contain medical specialties and active departments', () => {
    expect(DOCTORS.length).toBeGreaterThanOrEqual(5);
    expect(DEPARTMENTS.length).toBeGreaterThanOrEqual(5);
    const physician = DOCTORS.find((d) => d.id === 'doc-001');
    expect(physician?.name).toBe('Dr. Ramesh Kumar');
    expect(physician?.available).toBe(true);
  });

  it('should maintain i18n key consistency across English, Hindi, and Tamil', () => {
    expect(en.nav.home).toBeDefined();
    expect(hi.nav.home).toBeDefined();
    expect(ta.nav.home).toBeDefined();

    expect(en.roles.patient).toBe('Patient');
    expect(hi.roles.patient).toBe('मरीज़');
    expect(ta.roles.patient).toBe('நோயாளர்');

    expect(en.roles.doctor).toBe('Doctor');
    expect(hi.roles.doctor).toBe('डॉक्टर');
    expect(ta.roles.doctor).toBe('மருத்துவர்');
  });
});
