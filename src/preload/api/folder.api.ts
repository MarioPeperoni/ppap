import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import type { FolderApi } from '@/types';
import { parseFolder, parseFolders } from '@/validation/folder.validator';

export const folderApi: FolderApi = {
  list: async () => parseFolders(await ipcRenderer.invoke(IPC_CHANNELS.foldersList)),

  create: async (name) =>
    parseFolder(await ipcRenderer.invoke(IPC_CHANNELS.foldersCreate, { name })),

  rename: async (id, name) => {
    await ipcRenderer.invoke(IPC_CHANNELS.foldersRename, { id, name });
  },

  remove: async (id) => {
    await ipcRenderer.invoke(IPC_CHANNELS.foldersRemove, { id });
  },
};
