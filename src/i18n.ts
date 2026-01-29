import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";
import { LanguageDetectorModule } from "i18next";
import en from "./assets/i18n/translation/en.json";
import hi from "./assets/i18n/translation/hi.json";
import mr from "./assets/i18n/translation/mr.json";

type TranslationKeys = Record<string, any>;

const resources: Record<string, { translation: TranslationKeys }> = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
};

const languageDetector: LanguageDetectorModule = {
  type: "languageDetector",
  detect: () => {
    const locales = getLocales();
    return locales[0]?.languageCode || "en";
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

const __DEV__ = process.env.NODE_ENV === "development";

i18n
  .use(languageDetector) 
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    compatibilityJSON: "v4",
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
