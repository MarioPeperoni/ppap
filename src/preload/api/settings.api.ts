import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import type { SettingsApi } from '@/types';
import { parseSettings } from '@/validation/settings.validator';

export const settingsApi: SettingsApi = {
  get: async () => parseSettings(await ipcRenderer.invoke(IPC_CHANNELS.settingsGet)),

  patch: (patch) => {
    ipcRenderer.send(IPC_CHANNELS.settingsPatch, patch);
  },
};
