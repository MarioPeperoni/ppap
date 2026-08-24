import { contextBridge } from 'electron';
import { appApi } from '@/preload/api/app.api';
import { clipboardApi } from '@/preload/api/clipboard.api';
import { libraryApi } from '@/preload/api/library.api';
import { settingsApi } from '@/preload/api/settings.api';
import { themeApi } from '@/preload/api/theme.api';
import { windowApi } from '@/preload/api/window.api';
import type { PpapApi } from '@/types';
import { resolvePlatform } from '@/validation/platform.validator';

const api: PpapApi = {
  platform: resolvePlatform(process.platform),
  app: appApi,
  window: windowApi,
  theme: themeApi,
  library: libraryApi,
  settings: settingsApi,
  clipboard: clipboardApi,
};

contextBridge.exposeInMainWorld('ppap', api);
