import { imageCache } from '@/renderer/assets/image-cache';
import { clearAssets } from '@/renderer/assets/pending-assets';
import { commitOpenText } from '@/renderer/board/text/text-draft';
import { autosave } from '@/renderer/persistence/autosave';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useHistoryStore } from '@/renderer/stores/history.store';
import { useLibraryStore } from '@/renderer/stores/library.store';
import { useTextStore } from '@/renderer/stores/text.store';
import { useUiStore } from '@/renderer/stores/ui.store';

async function enter(id: string): Promise<void> {
  const file = await window.ppap.library.load(id);

  useTextStore.getState().close();
  autosave.stop();
  clearAssets();
  imageCache.open(id);
  useBoardStore.getState().open(file);
  useHistoryStore.getState().reset();
  useUiStore.getState().showBoard();
  imageCache.prime(file.content.elements);
  autosave.start(id);
}

export function openBoard(id: string): Promise<void> {
  return enter(id);
}

export async function createBoard(): Promise<void> {
  const meta = await window.ppap.library.create();

  useLibraryStore.getState().adopt(meta);
  await enter(meta.id);
}

export async function leaveBoard(): Promise<void> {
  commitOpenText();
  await autosave.close();
  useUiStore.getState().showLibrary();
  useBoardStore.getState().close();
  imageCache.close();
  clearAssets();
  await useLibraryStore.getState().refresh();
}

export async function renameBoard(id: string, name: string): Promise<void> {
  await window.ppap.library.rename(id, name);

  if (useBoardStore.getState().id === id) useBoardStore.getState().setName(name);
  await useLibraryStore.getState().refresh();
}

export async function deleteBoard(id: string): Promise<void> {
  await window.ppap.library.remove(id);
  useLibraryStore.getState().drop(id);
}

export async function exportBoard(): Promise<void> {
  const { id } = useBoardStore.getState();
  if (id === '') return;

  await autosave.flush();
  await window.ppap.library.exportFile(id);
}

export async function importBoard(): Promise<void> {
  const meta = await window.ppap.library.importFile();
  if (meta === null) return;

  useLibraryStore.getState().adopt(meta);
  await enter(meta.id);
}
