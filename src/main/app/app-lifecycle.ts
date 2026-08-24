import { app, BrowserWindow } from 'electron';
import { fileOpener } from '@/main/app/file-opener';
import { registerIpc } from '@/main/ipc/ipc-registry';
import { saveQueue } from '@/main/library/save-queue';
import { settingsService } from '@/main/settings/settings.service';
import { themeService } from '@/main/theme/theme.service';
import { createMainWindow } from '@/main/windows/main-window.factory';

let flushed = false;

function focusExistingWindow(): void {
  const [window] = BrowserWindow.getAllWindows();
  if (window === undefined) return;

  if (window.isMinimized()) window.restore();
  window.focus();
}

async function flushPendingWrites(): Promise<void> {
  await new Promise((resolve) => setImmediate(resolve));
  await saveQueue.drain();

  flushed = true;
  app.quit();
}

function flushBeforeExit(event: Electron.Event): void {
  if (flushed) return;

  event.preventDefault();
  void flushPendingWrites();
}

async function start(): Promise<void> {
  registerIpc();
  themeService.adopt((await settingsService.get()).theme);

  const window = createMainWindow();
  window.webContents.once('did-finish-load', () => {
    void fileOpener.deliver();
  });

  fileOpener.fromArguments(process.argv);
}

export function startApp(): void {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }

  fileOpener.watch();

  app.on('second-instance', (_event, argv) => {
    focusExistingWindow();
    fileOpener.fromArguments(argv);
  });

  app.on('will-quit', flushBeforeExit);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });

  void app.whenReady().then(start);
}
