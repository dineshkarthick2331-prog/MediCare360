import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return <section className="card"><h1>{t('common.notFound')}</h1><Link to="/">{t('common.backHome')}</Link></section>;
}
