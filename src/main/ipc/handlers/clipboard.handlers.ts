import { clipboard, nativeImage } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { MAX_IMAGE_BYTES } from '@/constants/library.constants';
import type { IpcInvokeTable } from '@/types/main-ipc.types';
import { expectBytes } from '@/validation/primitive.validator';

export const clipboardInvokeHandlers: IpcInvokeTable = {
  [IPC_CHANNELS.clipboardWriteImage]: (_window, payload) => {
    const png = expectBytes(payload, 'Clipboard image', MAX_IMAGE_BYTES);

    clipboard.writeImage(nativeImage.createFromBuffer(Buffer.from(png)));
  },
};
