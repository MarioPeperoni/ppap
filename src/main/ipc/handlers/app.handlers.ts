import { app } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import type { IpcInvokeTable } from '@/types/main-ipc.types';

export const appInvokeHandlers: IpcInvokeTable = {
  [IPC_CHANNELS.appVersion]: () => app.getVersion(),
};
