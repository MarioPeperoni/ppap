import type { Point } from './geometry.types';

export interface BoardInputHandlers {
  setPanOverride: (active: boolean) => void;
  cancelGesture: () => void;
  pointerBoard: () => Point | null;
}
