import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { app } from 'electron';
import {
  BOARD_EXTENSION,
  BOARDS_DIRECTORY,
  INDEX_FILE,
  LIBRARY_DIRECTORY,
  SETTINGS_FILE,
} from '@/constants/library.constants';
import { parseBoardId } from '@/validation/board-id.validator';

let ready: Promise<void> | null = null;

export function libraryDirectory(): string {
  return path.join(app.getPath('userData'), LIBRARY_DIRECTORY);
}

export function boardsDirectory(): string {
  return path.join(libraryDirectory(), BOARDS_DIRECTORY);
}

export function indexPath(): string {
  return path.join(libraryDirectory(), INDEX_FILE);
}

export function settingsPath(): string {
  return path.join(libraryDirectory(), SETTINGS_FILE);
}

export function boardPath(id: string): string {
  const resolved = path.join(boardsDirectory(), `${parseBoardId(id)}${BOARD_EXTENSION}`);
  if (path.dirname(resolved) !== boardsDirectory())
    throw new Error('Board path escapes the library');

  return resolved;
}

export function boardIdFromFile(file: string): string | null {
  if (path.extname(file) !== BOARD_EXTENSION) return null;

  try {
    return parseBoardId(path.basename(file, BOARD_EXTENSION));
  } catch {
    return null;
  }
}

export function ensureLibrary(): Promise<void> {
  ready ??= mkdir(boardsDirectory(), { recursive: true }).then(() => undefined);

  return ready;
}
