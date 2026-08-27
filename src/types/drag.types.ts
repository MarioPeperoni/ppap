import type { DragEvent } from 'react';

export interface BoardDropHandlers {
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}

export interface BoardDrop {
  over: boolean;
  handlers: BoardDropHandlers;
}
