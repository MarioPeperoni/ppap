import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { MAX_IMAGE_BYTES } from '@/constants/library.constants';
import type { ClipboardApi } from '@/types';
import { expectBytes } from '@/validation/primitive.validator';

export const clipboardApi: ClipboardApi = {
  writeImage: async (png) => {
    await ipcRenderer.invoke(IPC_CHANNELS.clipboardWriteImage, png);
  },

  readImage: async () => {
    const png: unknown = await ipcRenderer.invoke(IPC_CHANNELS.clipboardReadImage);

    return png === null ? null : expectBytes(png, 'Clipboard image', MAX_IMAGE_BYTES);
  },
};
