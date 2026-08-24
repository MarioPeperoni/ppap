import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import type { ClipboardApi } from '@/types';

export const clipboardApi: ClipboardApi = {
  writeImage: async (png) => {
    await ipcRenderer.invoke(IPC_CHANNELS.clipboardWriteImage, png);
  },
};
