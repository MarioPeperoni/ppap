import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { MAX_THUMBNAIL_BYTES } from '@/constants/library.constants';
import { subscribe } from '@/preload/ipc/ipc-subscription';
import type { BoardMeta, LibraryApi } from '@/types';
import { parseBoardFile, parseBoardMeta } from '@/validation/board-file.validator';
import { expectArray, expectBoolean, expectBytes } from '@/validation/primitive.validator';

function parseBoardList(value: unknown): BoardMeta[] {
  return expectArray(value, 'Board list').map(parseBoardMeta);
}

function parseThumbnail(value: unknown): Uint8Array | null {
  return value === null ? null : expectBytes(value, 'Thumbnail', MAX_THUMBNAIL_BYTES);
}

function parseOutcome(value: unknown): boolean {
  return expectBoolean(value, 'Dialog outcome');
}

export const libraryApi: LibraryApi = {
  list: async () => parseBoardList(await ipcRenderer.invoke(IPC_CHANNELS.libraryList)),

  create: async () => parseBoardMeta(await ipcRenderer.invoke(IPC_CHANNELS.libraryCreate)),

  load: async (id) => parseBoardFile(await ipcRenderer.invoke(IPC_CHANNELS.libraryLoad, { id })),

  save: async (id, content, assets, thumbnail) => {
    await ipcRenderer.invoke(IPC_CHANNELS.librarySave, { id, content, assets, thumbnail });
  },

  rename: async (id, name) => {
    await ipcRenderer.invoke(IPC_CHANNELS.libraryRename, { id, name });
  },

  remove: async (id) => {
    await ipcRenderer.invoke(IPC_CHANNELS.libraryRemove, { id });
  },

  setFolder: async (id, folderId) => {
    await ipcRenderer.invoke(IPC_CHANNELS.librarySetFolder, { id, folderId });
  },

  thumbnail: async (id) =>
    parseThumbnail(await ipcRenderer.invoke(IPC_CHANNELS.libraryThumbnail, { id })),

  exportFile: async (id) =>
    parseOutcome(await ipcRenderer.invoke(IPC_CHANNELS.libraryExportFile, { id })),

  exportImage: async (name, png) =>
    parseOutcome(await ipcRenderer.invoke(IPC_CHANNELS.libraryExportImage, { name, png })),

  importFile: async () => {
    const imported: unknown = await ipcRenderer.invoke(IPC_CHANNELS.libraryImportFile);

    return imported === null ? null : parseBoardMeta(imported);
  },

  onOpenBoard: (callback) => subscribe(IPC_CHANNELS.libraryOpenBoard, parseBoardMeta, callback),
};
