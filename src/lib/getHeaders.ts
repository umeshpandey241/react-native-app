export const getAuthHeaders = (token?: string | unknown, language?: string) => {
  let lang = 'en';
  let selectedLang = 'en';

  if (language) {
    selectedLang = language;
  } else if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('language='))
      ?.split('=')[1];
    selectedLang = cookieValue || 'en';
  } else {
    selectedLang = 'en';
  }
  
  lang = selectedLang === 'en' ? '' : selectedLang === 'mr' ? 'Mr' : 'Hi';

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Lang": lang,
  };

  if (token && typeof token === "string") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};
