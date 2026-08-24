import { app } from 'electron';
import { updateElectronApp } from 'update-electron-app';

export function startAutoUpdates(): void {
  if (!app.isPackaged) return;

  updateElectronApp();
}
