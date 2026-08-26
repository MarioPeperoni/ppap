import { clipboard, ClipboardItem } from 'electron';
import { PNG_MIME } from '@/constants/export.constants';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { MAX_IMAGE_BYTES } from '@/constants/library.constants';
import type { Bytes } from '@/types/bytes.types';
import type { IpcInvokeTable } from '@/types/main-ipc.types';
import { expectBytes } from '@/validation/primitive.validator';

async function readClipboardImage(): Promise<Bytes | null> {
  if (!(await clipboard.has(PNG_MIME))) return null;

  const item = (await clipboard.read()).find((entry) => entry.types.includes(PNG_MIME));
  if (item === undefined) return null;

  const png = await item.getType(PNG_MIME);
  if (!(png instanceof Blob)) return null;

  return new Uint8Array(await png.arrayBuffer());
}

export const clipboardInvokeHandlers: IpcInvokeTable = {
  [IPC_CHANNELS.clipboardWriteImage]: async (_window, payload) => {
    const png = expectBytes(payload, 'Clipboard image', MAX_IMAGE_BYTES);

    await clipboard.write([new ClipboardItem({ [PNG_MIME]: new Blob([png], { type: PNG_MIME }) })]);
  },

  [IPC_CHANNELS.clipboardReadImage]: () => readClipboardImage(),
};
