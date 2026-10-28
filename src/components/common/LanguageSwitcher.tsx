import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <label className="lang-switcher" aria-label="Choose language">
      🌐
      <select
        value={i18n.language}
        onChange={e => i18n.changeLanguage(e.target.value)}
        aria-label="Choose language"
      >
        <option value="en">English</option>
        <option value="ta">தமிழ்</option>
        <option value="hi">हिन्दी</option>
      </select>
    </label>
  );
}
