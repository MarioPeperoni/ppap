import { useEffect } from 'react';
import { isTypingTarget } from '@/renderer/board/input/typing-target';
import { createBoard, leaveBoard } from '@/renderer/session/board-session';
import { useUiStore } from '@/renderer/stores/ui.store';

export function useAppShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (isTypingTarget(event.target)) return;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        void createBoard();
        return;
      }

      if (event.altKey && event.key === 'ArrowLeft' && useUiStore.getState().route === 'board') {
        event.preventDefault();
        void leaveBoard();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
}
