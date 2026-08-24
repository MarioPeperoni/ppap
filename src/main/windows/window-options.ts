import path from 'node:path';
import { platform } from 'node:process';
import type { BrowserWindowConstructorOptions } from 'electron';
import {
  TRAFFIC_LIGHT_INSET,
  WINDOW_HEIGHT,
  WINDOW_MIN_HEIGHT,
  WINDOW_MIN_WIDTH,
  WINDOW_WIDTH,
} from '@/constants/window.constants';
import { themeService } from '@/main/theme/theme.service';

function chromeOptions(): BrowserWindowConstructorOptions {
  if (platform === 'darwin') {
    return { titleBarStyle: 'hiddenInset', trafficLightPosition: TRAFFIC_LIGHT_INSET };
  }

  return { frame: false };
}

export function mainWindowOptions(): BrowserWindowConstructorOptions {
  return {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minWidth: WINDOW_MIN_WIDTH,
    minHeight: WINDOW_MIN_HEIGHT,
    show: false,
    backgroundColor: themeService.backgroundColor(),
    ...chromeOptions(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  };
}
