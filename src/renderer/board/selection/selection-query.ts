import { boundsOfElements } from '@/core/element/element-bounds';
import { useBoardStore } from '@/renderer/stores/board.store';
import type { Bounds, Element } from '@/types';

export function selectedElements(): Element[] {
  const { elements, selection } = useBoardStore.getState();
  const selected: Element[] = [];

  for (const [id, element] of elements) {
    if (selection.has(id)) selected.push(element);
  }

  return selected;
}

export function selectedBounds(): Bounds | null {
  return boundsOfElements(selectedElements());
}
