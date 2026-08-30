import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { folderRepository } from '@/main/library/file-folder.repository';
import type { IpcInvokeTable } from '@/types/main-ipc.types';
import {
  parseFolderNameRequest,
  parseFolderRenameRequest,
  parseFolderRequest,
} from '@/validation/folder-payload.validator';

export const folderInvokeHandlers: IpcInvokeTable = {
  [IPC_CHANNELS.foldersList]: () => folderRepository.list(),

  [IPC_CHANNELS.foldersCreate]: (_window, payload) =>
    folderRepository.create(parseFolderNameRequest(payload).name),

  [IPC_CHANNELS.foldersRename]: (_window, payload) => {
    const { id, name } = parseFolderRenameRequest(payload);

    return folderRepository.rename(id, name);
  },

  [IPC_CHANNELS.foldersRemove]: (_window, payload) =>
    folderRepository.remove(parseFolderRequest(payload).id),
};
