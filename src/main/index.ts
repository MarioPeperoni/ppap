import { app } from 'electron';
import started from 'electron-squirrel-startup';
import { startApp } from '@/main/app/app-lifecycle';
import { startAutoUpdates } from '@/main/app/auto-update';

if (started) app.quit();

startAutoUpdates();
startApp();
