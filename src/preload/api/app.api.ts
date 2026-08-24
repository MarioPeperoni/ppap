import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import type { AppApi } from '@/types';
import { expectString } from '@/validation/primitive.validator';

export const appApi: AppApi = {
  version: async () => expectString(await ipcRenderer.invoke(IPC_CHANNELS.appVersion), 'Version'),
};
