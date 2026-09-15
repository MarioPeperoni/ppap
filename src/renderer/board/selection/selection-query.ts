import { frameOfElements } from '@/core/select/selection-frame';
import { useBoardStore } from '@/renderer/stores/board.store';
import type { Element, SelectionFrame } from '@/types';

export function selectedElements(): Element[] {
  const { elements, selection } = useBoardStore.getState();
  const selected: Element[] = [];

  for (const [id, element] of elements) {
    if (selection.has(id)) selected.push(element);
  }

  return selected;
}

export function selectedFrame(): SelectionFrame | null {
  return frameOfElements(selectedElements());
}
