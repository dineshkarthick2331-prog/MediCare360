import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AMBULANCES, Ambulance } from '../../data/demo';

interface AmbulanceServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AmbulanceServiceModal({ isOpen, onClose }: AmbulanceServiceModalProps) {
  const { t, i18n } = useTranslation();

  // Form State
  const [callerName, setCallerName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [emergencyType, setEmergencyType] = useState('Cardiac / Chest Pain');
  const [ambulanceType, setAmbulanceType] = useState<string>('Advanced Life Support (ALS)');
  const [isLocating, setIsLocating] = useState(false);

  // Dispatch state
  const [isDispatched, setIsDispatched] = useState(false);
  const [assignedAmbulance, setAssignedAmbulance] = useState<Ambulance | null>(null);
  const [eta, setEta] = useState(8);
  const [statusStep, setStatusStep] = useState<'dispatched' | 'en_route' | 'arriving'>('dispatched');

  useEffect(() => {
    let timer: any;
    if (isDispatched && eta > 1) {
      timer = setInterval(() => {
        setEta((prev) => {
          if (prev <= 2) {
            setStatusStep('arriving');
            return 1;
          }
          if (prev <= 5) {
            setStatusStep('en_route');
          }
          return prev - 1;
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isDispatched, eta]);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setLocation('Door 42, Anna Nagar West Extension, Main Road, Chennai - 600101');
      setIsLocating(false);
    }, 800);
  };

  const handleRequestAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = AMBULANCES.find((a) => a.type.includes(ambulanceType.split(' ')[0])) || AMBULANCES[0];
    setAssignedAmbulance(matched);
    setEta(matched.etaMinutes);
    setStatusStep('dispatched');
    setIsDispatched(true);
  };

  const handleReset = () => {
    setIsDispatched(false);
    setAssignedAmbulance(null);
    setEta(8);
    setStatusStep('dispatched');
  };

  // Language specific labels
  const lang = i18n.language || 'en';
  const labels = {
    title: lang === 'ta' ? 'அவசர ஆம்புலன்ஸ் சேவை' : lang === 'hi' ? 'आपातकालीन एम्बुलेंस सेवा' : 'Emergency Ambulance Service',
    hotline: lang === 'ta' ? '24/7 அவசர உதவி எண்: 108 / 102' : lang === 'hi' ? '24/7 आपातकालीन नंबर: 108 / 102' : '24/7 Emergency Hotline: 108 / 102',
    reqBtn: lang === 'ta' ? 'உடனடி ஆம்புலன்ஸ் கோருங்கள்' : lang === 'hi' ? 'तुरंत एम्बुलेंस बुलाएं' : 'Request Ambulance Now',
    gpsBtn: lang === 'ta' ? '📍 தற்போதைய இடத்தைப் பெறுக' : lang === 'hi' ? '📍 वर्तमान स्थान प्राप्त करें' : '📍 Use Current GPS Location',
    trackingTitle: lang === 'ta' ? 'ஆம்புலன்ஸ் புறப்பட்டுவிட்டது!' : lang === 'hi' ? 'एम्बुलेंस रवाना हो चुकी है!' : 'Ambulance Dispatched!',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg, 16px)',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border)',
          position: 'relative',
        }}
      >
        {/* Header with emergency alert color */}
        <div
          style={{
            background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
            color: 'white',
            padding: '1.25rem 1.5rem',
            borderTopLeftRadius: 'var(--radius-lg, 16px)',
            borderTopRightRadius: 'var(--radius-lg, 16px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite' }}>🚑</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{labels.title}</h2>
              <div style={{ fontSize: '0.85rem', opacity: 0.95 }}>{labels.hotline}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Emergency Call Box */}
        <div
          style={{
            background: '#FEF2F2',
            borderBottom: '1px solid #FCA5A5',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ color: '#991B1B', fontSize: '0.875rem', fontWeight: 600 }}>
            🚨 Direct Hospital ER Dispatch Line:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href="tel:108"
              className="btn btn-sm"
              style={{ background: '#DC2626', color: 'white', textDecoration: 'none', fontWeight: 700 }}
            >
              📞 Dial 108
            </a>
            <a
              href="tel:+919876543210"
              className="btn btn-sm btn-outline"
              style={{ borderColor: '#DC2626', color: '#DC2626', textDecoration: 'none', fontWeight: 700 }}
            >
              📞 +91 98765 43210
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem' }}>
          {!isDispatched ? (
            <form onSubmit={handleRequestAmbulance}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Fill out the quick dispatch form below. Our emergency dispatch team will deploy the nearest mobile ICU /
                ambulance within seconds.
              </p>

              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  Emergency Type <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-primary)',
                  }}
                  required
                >
                  <option value="Cardiac / Chest Pain">❤️ Cardiac Emergency / Chest Pain</option>
                  <option value="Road Accident / Severe Trauma">🚗 Accident / Severe Physical Trauma</option>
                  <option value="Breathing Difficulty / Low SpO2">🫁 Breathing Difficulty / Oxygen Support</option>
                  <option value="Stroke / Unconscious Patient">🧠 Suspected Stroke / Unconscious</option>
                  <option value="Maternity / Labour Emergency">🤰 Maternity & Labor Support</option>
                  <option value="General Medical Transport">🏥 Non-Emergency Patient Transfer</option>
                </select>
              </div>

              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  Ambulance Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                  {[
                    { label: 'Advanced Life Support (ALS)', desc: 'Ventilator, Defibrillator, Paramedic' },
                    { label: 'Basic Life Support (BLS)', desc: 'Oxygen, Stretcher, First Aid' },
                    { label: 'Patient Transport (PTV)', desc: 'Wheelchair / Bed Transport' },
                  ].map((cat) => (
                    <div
                      key={cat.label}
                      onClick={() => setAmbulanceType(cat.label)}
                      style={{
                        padding: '0.65rem',
                        border: `2px solid ${ambulanceType === cat.label ? '#0D9488' : 'var(--border)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: ambulanceType === cat.label ? 'rgba(13, 148, 136, 0.08)' : 'transparent',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: ambulanceType === cat.label ? '#0D9488' : 'inherit' }}>
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {cat.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-field">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Caller / Patient Name <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Contact Phone Number <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>
                    Pickup Location & Landmark <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--teal)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {isLocating ? 'Detecting GPS…' : labels.gpsBtn}
                  </button>
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter house/building number, street, landmark, and pin code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-primary)',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg w-full"
                style={{
                  background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1rem',
                  padding: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>🚨</span> {labels.reqBtn}
              </button>
            </form>
          ) : (
            <div>
              {/* Dispatch Active Screen */}
              <div
                style={{
                  background: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚑💨</div>
                <h3 style={{ margin: 0, color: '#166534', fontWeight: 800, fontSize: '1.2rem' }}>
                  {labels.trackingTitle}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#15803D' }}>
                  Unit has been notified and is rushing to your location.
                </p>

                {/* Big ETA badge */}
                <div
                  style={{
                    display: 'inline-block',
                    background: '#15803D',
                    color: 'white',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '30px',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    marginTop: '1rem',
                  }}
                >
                  ⏱️ Estimated Arrival: {eta} Minutes
                </div>
              </div>

              {/* Progress Steps */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10%',
                    right: '10%',
                    height: '3px',
                    background: 'var(--border)',
                    zIndex: 1,
                  }}
                />
                {[
                  { step: 'dispatched', label: 'Unit Assigned' },
                  { step: 'en_route', label: 'En Route' },
                  { step: 'arriving', label: 'At Location' },
                ].map((s, idx) => {
                  const isActive =
                    s.step === statusStep ||
                    (statusStep === 'arriving' && s.step === 'en_route') ||
                    s.step === 'dispatched';
                  return (
                    <div
                      key={s.step}
                      style={{
                        zIndex: 2,
                        background: 'var(--surface)',
                        padding: '0 8px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isActive ? '#0D9488' : 'var(--border)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 4px',
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{s.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Assigned Vehicle Details */}
              {assignedAmbulance && (
                <div
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      🚑 Vehicle: <span style={{ color: 'var(--teal)' }}>{assignedAmbulance.vehicleNumber}</span>
                    </span>
                    <span
                      style={{
                        background: '#DCFCE7',
                        color: '#15803D',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {assignedAmbulance.type}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <div>
                      👨‍✈️ <strong>Pilot / Driver:</strong> {assignedAmbulance.driverName}
                    </div>
                    <div>
                      🩺 <strong>EMT Paramedic:</strong> {assignedAmbulance.paramedicName}
                    </div>
                    <div>
                      📍 <strong>Dispatched From:</strong> {assignedAmbulance.currentLocation}
                    </div>
                    <div>
                      🏠 <strong>Destination:</strong> {location || 'Pickup address provided'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                    <a
                      href={`tel:${assignedAmbulance.driverPhone}`}
                      className="btn btn-sm btn-primary"
                      style={{ flex: 1, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      📞 Call Driver ({assignedAmbulance.driverPhone})
                    </a>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                >
                  Book Another Ambulance
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Keep Tracking & Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
