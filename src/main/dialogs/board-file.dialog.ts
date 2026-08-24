import { dialog, type BrowserWindow, type FileFilter } from 'electron';
import { BOARD_EXTENSION } from '@/constants/library.constants';

const BOARD_FILTER: FileFilter = { name: 'ppap board', extensions: ['ppap'] };
const IMAGE_FILTER: FileFilter = { name: 'PNG image', extensions: ['png'] };

async function chooseTarget(
  window: BrowserWindow,
  defaultPath: string,
  filter: FileFilter,
): Promise<string | null> {
  const result = await dialog.showSaveDialog(window, { defaultPath, filters: [filter] });
  if (result.canceled || result.filePath.length === 0) return null;

  return result.filePath;
}

export function chooseArchiveTarget(window: BrowserWindow, name: string): Promise<string | null> {
  return chooseTarget(window, `${name}${BOARD_EXTENSION}`, BOARD_FILTER);
}

export function chooseImageTarget(window: BrowserWindow, name: string): Promise<string | null> {
  return chooseTarget(window, `${name}.png`, IMAGE_FILTER);
}

export async function chooseArchiveSource(window: BrowserWindow): Promise<string | null> {
  const result = await dialog.showOpenDialog(window, {
    properties: ['openFile'],
    filters: [BOARD_FILTER],
  });
  if (result.canceled) return null;

  return result.filePaths[0] ?? null;
}
