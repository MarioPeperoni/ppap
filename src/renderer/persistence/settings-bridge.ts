import { useLibraryStore } from '@/renderer/stores/library.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import { watchStore } from '@/renderer/stores/watch-store';
import type { SettingsPatch, Unsubscribe } from '@/types';

function patch(change: SettingsPatch): void {
  window.ppap.settings.patch(change);
}

export async function hydrateSettings(): Promise<void> {
  const settings = await window.ppap.settings.get();

  useToolStore.getState().adopt(settings);
  useLibraryStore.getState().setSortOrder(settings.sortOrder);
}

export function watchSettings(): Unsubscribe {
  const unwatch = [
    watchStore(
      useToolStore,
      (state) => state.tool,
      (tool) => {
        patch({ tool });
      },
    ),
    watchStore(
      useToolStore,
      (state) => state.color,
      (color) => {
        patch({ color });
      },
    ),
    watchStore(
      useToolStore,
      (state) => state.customColors,
      (customColors) => {
        patch({ customColors });
      },
    ),
    watchStore(
      useToolStore,
      (state) => state.penSize,
      (penSize) => {
        patch({ penSize });
      },
    ),
    watchStore(
      useToolStore,
      (state) => state.eraserRadius,
      (eraserRadius) => {
        patch({ eraserRadius });
      },
    ),
    watchStore(
      useLibraryStore,
      (state) => state.sortOrder,
      (sortOrder) => {
        patch({ sortOrder });
      },
    ),
  ];

  return () => {
    for (const off of unwatch) off();
  };
}
