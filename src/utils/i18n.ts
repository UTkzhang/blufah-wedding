import en from '../i18n/en.json';
import zh from '../i18n/zh.json';

export type Language = 'en' | 'zh';

export const translations = { en, zh } as const;

export function getTranslation(lang: Language) {
  return translations[lang];
}

export function getDefaultLanguage(): Language {
  return 'en';
}

// Client-side language utilities
export const LANGUAGE_KEY = 'wedding-lang';

export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored === 'en' || stored === 'zh') return stored;
  return null;
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANGUAGE_KEY, lang);
}
