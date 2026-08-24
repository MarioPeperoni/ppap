import type { Platform } from './platform.types';
import type { Theme } from './theme.types';

export type Unsubscribe = () => void;

export interface WindowApi {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
  onMaximizeChange: (callback: (maximized: boolean) => void) => Unsubscribe;
}

export interface ThemeApi {
  get: () => Promise<Theme>;
  set: (theme: Theme) => void;
  onChange: (callback: (theme: Theme) => void) => Unsubscribe;
}

export interface PpapApi {
  platform: Platform;
  window: WindowApi;
  theme: ThemeApi;
}

declare global {
  interface Window {
    ppap: PpapApi;
  }
}
