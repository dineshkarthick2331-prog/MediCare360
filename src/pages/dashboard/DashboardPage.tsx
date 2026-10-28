import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { role = 'patient' } = useParams();
  const { t } = useTranslation();
  const allowed = ['patient', 'doctor', 'nurse', 'staff', 'admin'];
  if (!allowed.includes(role)) return <p>{t('common.notFound')}</p>;

  return (
    <section>
      <p className="muted">{t('dashboard.demoNotice')}</p>
      <h1>{t('dashboard.title', { role: t(`roles.${role}`) })}</h1>
      <p>{t('dashboard.placeholder')}</p>
      <div className="card-grid">
        {['appointments', 'medicalRecords', 'prescriptions', 'reports', 'billing', 'insurance'].map(item => (
          <article className="card" key={item}>
            <h2>{t(`modules.${item}`)}</h2>
            <p className="muted">{t('dashboard.modulePlaceholder')}</p>
          </article>
        ))}
      </div>
      <p><Link to="/">{t('common.backHome')}</Link></p>
    </section>
  );
}
