import { contextBridge } from 'electron';
import { themeApi } from '@/preload/api/theme.api';
import { windowApi } from '@/preload/api/window.api';
import type { PpapApi } from '@/types';
import { resolvePlatform } from '@/validation/platform.validator';

const api: PpapApi = {
  platform: resolvePlatform(process.platform),
  window: windowApi,
  theme: themeApi,
};

contextBridge.exposeInMainWorld('ppap', api);
