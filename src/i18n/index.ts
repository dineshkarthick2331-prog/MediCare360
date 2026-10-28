import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ta from './locales/ta.json';
import hi from './locales/hi.json';

const stored = typeof window !== 'undefined' ? localStorage.getItem('medicare360-language') : null;
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ta: { translation: ta },
    hi: { translation: hi },
  },
  lng: stored || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
i18n.on('languageChanged', language => {
  if (typeof window !== 'undefined') localStorage.setItem('medicare360-language', language);
});
export default i18n;
