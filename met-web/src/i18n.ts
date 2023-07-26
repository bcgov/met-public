import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// const enTranslation = require('./locales/en/eao.json');

i18n.use(initReactI18next).init({
    // resources: {
    //     en: {
    //         translation: enTranslation,
    //     },
    // },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
