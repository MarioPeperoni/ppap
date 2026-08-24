import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { subscribe } from '@/preload/ipc/ipc-subscription';
import type { WindowApi } from '@/types';
import { parseBoolean } from '@/validation/ipc-payload.validator';

export const windowApi: WindowApi = {
  minimize: () => {
    ipcRenderer.send(IPC_CHANNELS.windowMinimize);
  },
  toggleMaximize: () => {
    ipcRenderer.send(IPC_CHANNELS.windowToggleMaximize);
  },
  close: () => {
    ipcRenderer.send(IPC_CHANNELS.windowClose);
  },
  onMaximizeChange: (callback) =>
    subscribe(IPC_CHANNELS.windowMaximizeChanged, parseBoolean, callback),
};
