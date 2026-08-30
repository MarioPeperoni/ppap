import { BrowserWindow, ipcMain, type IpcMainEvent, type IpcMainInvokeEvent } from 'electron';
import { appInvokeHandlers } from '@/main/ipc/handlers/app.handlers';
import { clipboardInvokeHandlers } from '@/main/ipc/handlers/clipboard.handlers';
import { folderInvokeHandlers } from '@/main/ipc/handlers/folder.handlers';
import { libraryInvokeHandlers } from '@/main/ipc/handlers/library.handlers';
import {
  settingsInvokeHandlers,
  settingsSendHandlers,
} from '@/main/ipc/handlers/settings.handlers';
import { themeInvokeHandlers, themeSendHandlers } from '@/main/ipc/handlers/theme.handlers';
import { windowSendHandlers } from '@/main/ipc/handlers/window.handlers';
import type { IpcInvokeTable, IpcSendTable } from '@/types/main-ipc.types';

const SEND_HANDLERS: IpcSendTable = {
  ...windowSendHandlers,
  ...themeSendHandlers,
  ...settingsSendHandlers,
};

const INVOKE_HANDLERS: IpcInvokeTable = {
  ...appInvokeHandlers,
  ...themeInvokeHandlers,
  ...libraryInvokeHandlers,
  ...folderInvokeHandlers,
  ...settingsInvokeHandlers,
  ...clipboardInvokeHandlers,
};

function senderWindow(event: IpcMainEvent | IpcMainInvokeEvent): BrowserWindow | null {
  return BrowserWindow.fromWebContents(event.sender);
}

export function registerIpc(): void {
  for (const [channel, handler] of Object.entries(SEND_HANDLERS)) {
    ipcMain.on(channel, (event: IpcMainEvent, payload: unknown) => {
      const window = senderWindow(event);
      if (window === null) return;

      handler(window, payload);
    });
  }

  for (const [channel, handler] of Object.entries(INVOKE_HANDLERS)) {
    ipcMain.handle(channel, (event: IpcMainInvokeEvent, payload: unknown) => {
      const window = senderWindow(event);
      if (window === null) throw new Error('The request came from no window');

      return handler(window, payload);
    });
  }
}
