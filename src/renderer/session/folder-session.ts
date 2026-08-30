import { DEFAULT_FOLDER_NAME } from '@/constants/folder.constants';
import { useFolderStore } from '@/renderer/stores/folder.store';
import { useLibraryStore } from '@/renderer/stores/library.store';
import type { BoardMeta } from '@/types';

export async function createFolder(): Promise<void> {
  const folder = await window.ppap.folders.create(DEFAULT_FOLDER_NAME);
  const folders = useFolderStore.getState();

  folders.adopt(folder);
  folders.open(null);
  folders.setRenaming(folder.id);
}

export async function renameFolder(id: string, name: string): Promise<void> {
  await window.ppap.folders.rename(id, name);
  useFolderStore.getState().rename(id, name);
}

export async function deleteFolder(id: string): Promise<void> {
  await window.ppap.folders.remove(id);
  useFolderStore.getState().drop(id);
}

export async function fileBoard(id: string, folderId: string | null): Promise<void> {
  await window.ppap.library.setFolder(id, folderId);
  await useLibraryStore.getState().refresh();
}

export async function fileNewBoard(meta: BoardMeta): Promise<BoardMeta> {
  const folderId = useFolderStore.getState().currentId;
  if (folderId === null) return meta;

  await window.ppap.library.setFolder(meta.id, folderId);

  return { ...meta, folderId };
}
