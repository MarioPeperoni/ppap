import { create } from 'zustand';
import { cssPalette } from '@/renderer/theme/css-palette';
import type { Theme } from '@/types';

function applyToDocument(theme: Theme): void {
  if (theme === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);

  cssPalette.invalidate();
}

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  adopt: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()((set) => ({
  theme: 'system',

  setTheme: (theme) => {
    applyToDocument(theme);
    window.ppap.theme.set(theme);
    set({ theme });
  },

  adopt: (theme) => {
    applyToDocument(theme);
    set({ theme });
  },
}));
