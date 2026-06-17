import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import idTranslation from './locales/id/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      id: {
        translation: idTranslation,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupPath: 'lng',
      lookupFromPathIndex: 0,
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
