import type { DragEvent } from 'react';
import { BOARD_DRAG_TYPE } from '@/constants/folder.constants';

export function startBoardDrag(event: DragEvent<HTMLElement>, id: string): void {
  event.dataTransfer.setData(BOARD_DRAG_TYPE, id);
  event.dataTransfer.effectAllowed = 'move';
}

export function carriesBoard(event: DragEvent<HTMLElement>): boolean {
  return event.dataTransfer.types.includes(BOARD_DRAG_TYPE);
}

export function draggedBoardId(event: DragEvent<HTMLElement>): string | null {
  const id = event.dataTransfer.getData(BOARD_DRAG_TYPE);

  return id === '' ? null : id;
}
