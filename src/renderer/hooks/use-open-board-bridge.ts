import { useEffect } from 'react';
import { openBoard } from '@/renderer/session/board-session';
import { useLibraryStore } from '@/renderer/stores/library.store';

export function useOpenBoardBridge(): void {
  useEffect(
    () =>
      window.ppap.library.onOpenBoard((meta) => {
        useLibraryStore.getState().adopt(meta);
        void openBoard(meta.id);
      }),
    [],
  );
}
