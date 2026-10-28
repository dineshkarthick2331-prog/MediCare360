# MediCare 360 — Your Health, One Platform 🏥

A complete, modern, responsive hospital management and doctor appointment booking platform built with **React 19**, **TypeScript**, **Vite**, and **CSS Design System**. Designed for accessibility, low-bandwidth environments, first-time users, elderly patients, and multi-lingual support.

---

## 🌟 Key Features

### 1. 24/7 Emergency & Rapid Ambulance Dispatch 🚑
- Emergency Hotline banner (`108` National Emergency, `102` Maternal Support, and direct ER desk).
- Live ambulance request with triage categorization:
  - **Advanced Life Support (ALS)** — Mobile ICU with ventilator & paramedic.
  - **Basic Life Support (BLS)** — Oxygen support & first aid.
  - **Patient Transport (PTV)** — Wheelchair & non-emergency transfer.
- GPS auto-location detection and real-time dispatch simulator with live ETA countdown and pilot contact link.

### 2. Multi-Language Support 🌐
- Built-in live localization without reload:
  - **English**
  - **தமிழ் (Tamil)**
  - **हिन्दी (Hindi)**

### 3. Role-Based Dashboards & Dedicated Portals 👥
Separate portals and workflows for all 5 hospital roles:
- **Patient Portal**: Book appointments, track live queue token, view digital prescriptions, lab reports, and billing invoices.
- **Doctor Portal**: Daily appointment queue, consultation desk, e-prescription generation, and patient records.
- **Nurse Portal**: Inpatient ward bed occupancy management, vital signs recording modal, and clinical observation notes.
- **Staff / Reception Desk**: Walk-in patient registration, token announcements, and invoice lookup.
- **Administrator Command Center**: Operational KPIs, occupancy analytics, department control, ambulance fleet monitoring, and user accounts.

### 4. Appointment & Token Management 🎫
- 3-step appointment booking with specialist physicians across 25+ medical specialties.
- Automatic queue token generation and live waiting tracker with estimated wait times.

---

## 🔑 Demo Credentials

| Role | Email | Password | Portal URL |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@demo.com` | `demo1234` | `/patient/login` |
| **Doctor** | `doctor@demo.com` | `demo1234` | `/doctor/login` |
| **Nurse** | `nurse@demo.com` | `demo1234` | `/nurse/login` |
| **Staff** | `staff@demo.com` | `demo1234` | `/staff/login` |
| **Admin** | `admin@demo.com` | `demo1234` | `/admin/login` |

*Each login screen includes a **⚡ One-click Demo Login** button for instant access.*

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Run automated test suite
npm test
```

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Routing**: React Router v7
- **Internationalization**: i18next + react-i18next
- **Styling**: Curated CSS Design System with dark mode & HSL tokens
- **Testing**: Vitest
