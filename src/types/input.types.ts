import type { PointerEvent } from 'react';
import type { Point } from './geometry.types';

export interface BoardInputHandlers {
  setPanOverride: (active: boolean) => void;
  cancelGesture: () => void;
  pointerBoard: () => Point | null;
}

export interface DragRatioHandlers {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
}
