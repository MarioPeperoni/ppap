import { BrowserWindow, nativeTheme } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { WINDOW_BACKGROUND_DARK, WINDOW_BACKGROUND_LIGHT } from '@/constants/theme.constants';
import type { Theme } from '@/types';

class ThemeService {
  private current: Theme = 'system';

  get(): Theme {
    return this.current;
  }

  set(theme: Theme): void {
    this.current = theme;
    nativeTheme.themeSource = theme;

    for (const window of BrowserWindow.getAllWindows()) {
      window.setBackgroundColor(this.backgroundColor());
      window.webContents.send(IPC_CHANNELS.themeChanged, theme);
    }
  }

  backgroundColor(): string {
    return nativeTheme.shouldUseDarkColors ? WINDOW_BACKGROUND_DARK : WINDOW_BACKGROUND_LIGHT;
  }
}

export const themeService = new ThemeService();
