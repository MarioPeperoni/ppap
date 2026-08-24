import { IPC_CHANNELS } from '@/constants/ipc.constants';
import type { IpcSendTable } from '@/types/main-ipc.types';

export const windowSendHandlers: IpcSendTable = {
  [IPC_CHANNELS.windowMinimize]: (window) => {
    window.minimize();
  },
  [IPC_CHANNELS.windowToggleMaximize]: (window) => {
    if (window.isMaximized()) window.unmaximize();
    else window.maximize();
  },
  [IPC_CHANNELS.windowClose]: (window) => {
    window.close();
  },
};
