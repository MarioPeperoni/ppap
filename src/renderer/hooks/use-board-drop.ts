import { useState, type DragEvent } from 'react';
import { carriesBoard, draggedBoardId } from '@/renderer/library/board-drag';
import type { BoardDrop } from '@/types';

export function useBoardDrop(onBoard: (id: string) => void): BoardDrop {
  const [over, setOver] = useState(false);

  return {
    over,
    handlers: {
      onDragOver: (event: DragEvent<HTMLElement>) => {
        if (!carriesBoard(event)) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setOver(true);
      },

      onDragLeave: () => {
        setOver(false);
      },

      onDrop: (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        setOver(false);

        const id = draggedBoardId(event);
        if (id !== null) onBoard(id);
      },
    },
  };
}
