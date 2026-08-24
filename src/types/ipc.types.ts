import type { NewAsset } from './asset.types';
import type { BoardContent, BoardFile, BoardMeta } from './board.types';
import type { Bytes } from './bytes.types';
import type { Platform } from './platform.types';
import type { Settings, SettingsPatch } from './settings.types';
import type { Theme } from './theme.types';

export type Unsubscribe = () => void;

export interface BoardRequest {
  id: string;
}

export interface SaveRequest {
  id: string;
  content: BoardContent;
  assets: NewAsset[];
  thumbnail: Uint8Array | null;
}

export interface RenameRequest {
  id: string;
  name: string;
}

export interface ImageRequest {
  name: string;
  png: Uint8Array;
}

export interface WindowApi {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
  onMaximizeChange: (callback: (maximized: boolean) => void) => Unsubscribe;
}

export interface ThemeApi {
  get: () => Promise<Theme>;
  set: (theme: Theme) => void;
  onChange: (callback: (theme: Theme) => void) => Unsubscribe;
}

export interface LibraryApi {
  list: () => Promise<BoardMeta[]>;
  create: () => Promise<BoardMeta>;
  load: (id: string) => Promise<BoardFile>;
  save: (
    id: string,
    content: BoardContent,
    assets: readonly NewAsset[],
    thumbnail: Uint8Array | null,
  ) => Promise<void>;
  rename: (id: string, name: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  thumbnail: (id: string) => Promise<Uint8Array | null>;
  exportFile: (id: string) => Promise<boolean>;
  exportImage: (name: string, png: Uint8Array) => Promise<boolean>;
  importFile: () => Promise<BoardMeta | null>;
  onOpenBoard: (callback: (meta: BoardMeta) => void) => Unsubscribe;
}

export interface SettingsApi {
  get: () => Promise<Settings>;
  patch: (patch: SettingsPatch) => void;
}

export interface ClipboardApi {
  writeImage: (png: Uint8Array) => Promise<void>;
  readImage: () => Promise<Bytes | null>;
}

export interface AppApi {
  version: () => Promise<string>;
}

export interface PpapApi {
  platform: Platform;
  app: AppApi;
  window: WindowApi;
  theme: ThemeApi;
  library: LibraryApi;
  settings: SettingsApi;
  clipboard: ClipboardApi;
}

declare global {
  interface Window {
    ppap: PpapApi;
  }
}
