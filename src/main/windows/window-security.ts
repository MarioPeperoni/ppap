import { shell, type BrowserWindow, type Session } from 'electron';
import { buildDevelopmentCsp, PRODUCTION_CSP } from '@/constants/security.constants';

export function hardenSession(session: Session, devServerUrl: string | undefined): void {
  const policy = devServerUrl === undefined ? PRODUCTION_CSP : buildDevelopmentCsp(devServerUrl);

  session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': [policy] },
    });
  });

  session.setPermissionRequestHandler((_contents, _permission, callback) => {
    callback(false);
  });
  session.setPermissionCheckHandler(() => false);
}

export function hardenWindow(window: BrowserWindow, devServerUrl: string | undefined): void {
  window.webContents.on('will-navigate', (event, url) => {
    if (devServerUrl !== undefined && url.startsWith(devServerUrl)) return;
    event.preventDefault();
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url);

    return { action: 'deny' };
  });
}
