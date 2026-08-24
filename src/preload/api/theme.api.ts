import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { subscribe } from '@/preload/ipc/ipc-subscription';
import type { ThemeApi } from '@/types';
import { parseTheme } from '@/validation/ipc-payload.validator';

export const themeApi: ThemeApi = {
  get: async () => parseTheme(await ipcRenderer.invoke(IPC_CHANNELS.themeGet)),
  set: (theme) => {
    ipcRenderer.send(IPC_CHANNELS.themeSet, theme);
  },
  onChange: (callback) => subscribe(IPC_CHANNELS.themeChanged, parseTheme, callback),
};
