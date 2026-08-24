import { useBoardStore } from '@/renderer/stores/board.store';
import type { BoardContent } from '@/types';

export function readBoardContent(): BoardContent {
  const { elements, camera, gridVisible } = useBoardStore.getState();

  return { gridVisible, camera, elements: [...elements.values()] };
}
