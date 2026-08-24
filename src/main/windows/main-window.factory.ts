import path from 'node:path';
import { BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { DEV_SERVER_URL, RENDERER_NAME } from '@/main/windows/dev-server';
import { mainWindowOptions } from '@/main/windows/window-options';
import { hardenSession, hardenWindow } from '@/main/windows/window-security';

function reportMaximizeState(window: BrowserWindow): void {
  window.webContents.send(IPC_CHANNELS.windowMaximizeChanged, window.isMaximized());
}

function loadRenderer(window: BrowserWindow): void {
  if (DEV_SERVER_URL === undefined) {
    void window.loadFile(path.join(__dirname, `../renderer/${RENDERER_NAME}/index.html`));
    return;
  }

  void window.loadURL(DEV_SERVER_URL);
}

export function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow(mainWindowOptions());

  hardenSession(window.webContents.session, DEV_SERVER_URL);
  hardenWindow(window, DEV_SERVER_URL);

  window.once('ready-to-show', () => {
    window.show();
  });
  window.on('maximize', () => {
    reportMaximizeState(window);
  });
  window.on('unmaximize', () => {
    reportMaximizeState(window);
  });

  loadRenderer(window);

  return window;
}
