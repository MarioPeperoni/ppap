import { BrowserWindow, nativeTheme } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { DEFAULT_SETTINGS } from '@/constants/settings.constants';
import { WINDOW_BACKGROUND_DARK, WINDOW_BACKGROUND_LIGHT } from '@/constants/theme.constants';
import { settingsService } from '@/main/settings/settings.service';
import type { Theme } from '@/types';

class ThemeService {
  private current: Theme = DEFAULT_SETTINGS.theme;

  get(): Theme {
    return this.current;
  }

  adopt(theme: Theme): void {
    this.current = theme;
    nativeTheme.themeSource = theme;
  }

  set(theme: Theme): void {
    this.adopt(theme);
    void settingsService.patch({ theme });

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
