import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { themeService } from '@/main/theme/theme.service';
import type { IpcInvokeTable, IpcSendTable } from '@/types/main-ipc.types';
import { parseTheme } from '@/validation/theme.validator';

export const themeSendHandlers: IpcSendTable = {
  [IPC_CHANNELS.themeSet]: (_window, payload) => {
    themeService.set(parseTheme(payload));
  },
};

export const themeInvokeHandlers: IpcInvokeTable = {
  [IPC_CHANNELS.themeGet]: () => themeService.get(),
};
