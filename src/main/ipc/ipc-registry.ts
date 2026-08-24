import { BrowserWindow, ipcMain, type IpcMainEvent } from 'electron';
import { themeInvokeHandlers, themeSendHandlers } from '@/main/ipc/handlers/theme.handlers';
import { windowSendHandlers } from '@/main/ipc/handlers/window.handlers';
import type { IpcInvokeTable, IpcSendTable } from '@/types/main-ipc.types';

const SEND_HANDLERS: IpcSendTable = { ...windowSendHandlers, ...themeSendHandlers };

const INVOKE_HANDLERS: IpcInvokeTable = { ...themeInvokeHandlers };

export function registerIpc(): void {
  for (const [channel, handler] of Object.entries(SEND_HANDLERS)) {
    ipcMain.on(channel, (event: IpcMainEvent, payload: unknown) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      if (window === null) return;

      handler(window, payload);
    });
  }

  for (const [channel, handler] of Object.entries(INVOKE_HANDLERS)) {
    ipcMain.handle(channel, () => handler());
  }
}
