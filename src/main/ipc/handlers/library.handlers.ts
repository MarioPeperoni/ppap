import { readFile, writeFile } from 'node:fs/promises';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { fileSafeName } from '@/core/board/board-name';
import {
  chooseArchiveSource,
  chooseArchiveTarget,
  chooseImageTarget,
} from '@/main/dialogs/board-file.dialog';
import { boardRepository } from '@/main/library/file-board.repository';
import type { IpcInvokeTable } from '@/types/main-ipc.types';
import {
  parseBoardRequest,
  parseImageRequest,
  parseRenameRequest,
  parseSaveRequest,
  parseSetFolderRequest,
} from '@/validation/library-payload.validator';

export const libraryInvokeHandlers: IpcInvokeTable = {
  [IPC_CHANNELS.libraryList]: () => boardRepository.list(),

  [IPC_CHANNELS.libraryCreate]: () => boardRepository.create(),

  [IPC_CHANNELS.libraryLoad]: (_window, payload) =>
    boardRepository.load(parseBoardRequest(payload).id),

  [IPC_CHANNELS.librarySave]: (_window, payload) => {
    const { id, content, assets, thumbnail } = parseSaveRequest(payload);

    return boardRepository.save(id, content, assets, thumbnail);
  },

  [IPC_CHANNELS.libraryRename]: (_window, payload) => {
    const { id, name } = parseRenameRequest(payload);

    return boardRepository.rename(id, name);
  },

  [IPC_CHANNELS.libraryRemove]: (_window, payload) =>
    boardRepository.remove(parseBoardRequest(payload).id),

  [IPC_CHANNELS.librarySetFolder]: (_window, payload) => {
    const { id, folderId } = parseSetFolderRequest(payload);

    return boardRepository.setFolder(id, folderId);
  },

  [IPC_CHANNELS.libraryThumbnail]: (_window, payload) =>
    boardRepository.thumbnail(parseBoardRequest(payload).id),

  [IPC_CHANNELS.libraryExportFile]: async (window, payload) => {
    const { id } = parseBoardRequest(payload);
    const meta = await boardRepository.meta(id);
    const target = await chooseArchiveTarget(window, fileSafeName(meta.name));
    if (target === null) return false;

    await writeFile(target, await boardRepository.read(id));

    return true;
  },

  [IPC_CHANNELS.libraryExportImage]: async (window, payload) => {
    const { name, png } = parseImageRequest(payload);
    const target = await chooseImageTarget(window, fileSafeName(name));
    if (target === null) return false;

    await writeFile(target, png);

    return true;
  },

  [IPC_CHANNELS.libraryImportFile]: async (window) => {
    const source = await chooseArchiveSource(window);
    if (source === null) return null;

    return boardRepository.adopt(await readFile(source));
  },
};
