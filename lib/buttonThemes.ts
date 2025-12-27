/**
 * Button Theme Konfiguration
 * Vordefinierte Farbschemata für Link-Buttons
 */

export interface ButtonTheme {
  name: string;
  bg: string;
  text: string;
  preview: string; // Farbe für Preview im Admin Panel
}

export const BUTTON_THEMES: Record<string, ButtonTheme> = {
  default: {
    name: 'Standard (Rot)',
    bg: 'bg-red-900',
    text: 'text-white',
    preview: '#7f1d1d'
  },
  blue: {
    name: 'Blau',
    bg: 'bg-blue-600',
    text: 'text-white',
    preview: '#2563eb'
  },
  purple: {
    name: 'Lila',
    bg: 'bg-purple-600',
    text: 'text-white',
    preview: '#9333ea'
  },
  pink: {
    name: 'Pink',
    bg: 'bg-pink-600',
    text: 'text-white',
    preview: '#db2777'
  },
  green: {
    name: 'Grün',
    bg: 'bg-green-600',
    text: 'text-white',
    preview: '#16a34a'
  },
  red: {
    name: 'Rot',
    bg: 'bg-red-600',
    text: 'text-white',
    preview: '#dc2626'
  },
  orange: {
    name: 'Orange',
    bg: 'bg-orange-600',
    text: 'text-white',
    preview: '#ea580c'
  },
  cyan: {
    name: 'Cyan',
    bg: 'bg-cyan-600',
    text: 'text-white',
    preview: '#0891b2'
  },
  indigo: {
    name: 'Indigo',
    bg: 'bg-indigo-600',
    text: 'text-white',
    preview: '#4f46e5'
  },
  emerald: {
    name: 'Smaragd',
    bg: 'bg-emerald-600',
    text: 'text-white',
    preview: '#059669'
  },
  custom: {
    name: 'Benutzerdefiniert',
    bg: '',
    text: 'text-white',
    preview: '#6b7280'
  }
};

/**
 * Gibt das Theme-Objekt für einen gegebenen Theme-Key zurück
 * Falls kein Theme gefunden wird, wird das Default-Theme zurückgegeben
 */
export const getButtonTheme = (themeKey?: string): ButtonTheme => {
  if (!themeKey || !BUTTON_THEMES[themeKey]) {
    return BUTTON_THEMES.default;
  }
  return BUTTON_THEMES[themeKey];
};

/**
 * Gibt alle verfügbaren Themes als Array zurück
 */
export const getAvailableThemes = (): Array<{ key: string; theme: ButtonTheme }> => {
  return Object.entries(BUTTON_THEMES).map(([key, theme]) => ({ key, theme }));
};
