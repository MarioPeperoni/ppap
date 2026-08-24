import { app, BrowserWindow } from 'electron';
import { registerIpc } from '@/main/ipc/ipc-registry';
import { createMainWindow } from '@/main/windows/main-window.factory';

function focusExistingWindow(): void {
  const [window] = BrowserWindow.getAllWindows();
  if (window === undefined) return;

  if (window.isMinimized()) window.restore();
  window.focus();
}

export function startApp(): void {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }

  app.on('second-instance', focusExistingWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });

  void app.whenReady().then(() => {
    registerIpc();
    createMainWindow();
  });
}
