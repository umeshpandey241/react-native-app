import 'react-i18next';
import translation from './assets/i18/en/translation.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof translation;
    };
  }
}
