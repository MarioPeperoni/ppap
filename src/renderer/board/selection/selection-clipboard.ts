import { cloneElement } from '@/core/element/element.factory';
import type { Element } from '@/types';

let held: readonly Element[] = [];

export function writeClipboard(elements: readonly Element[]): void {
  held = elements.map(cloneElement);
}

export function readClipboard(): readonly Element[] {
  return held;
}
