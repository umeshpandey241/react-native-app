import { create } from 'zustand';
import { AsyncStorage } from '../sharedBase/globalImport';

interface LanguageStore {
  selectedLanguage: string;
  setLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageStore & { initializeLanguage: () => Promise<void> }>((set) => ({
  selectedLanguage: "en", // Default value
  setLanguage: async (language) => {
    await AsyncStorage.setItem("app_language", language);
    set({ selectedLanguage: language });
  },
  initializeLanguage: async () => {
    const storedLanguage = await AsyncStorage.getItem("app_language");
    if (storedLanguage) {
      set({ selectedLanguage: storedLanguage });
    }
  },
}));
