import type { ViewState } from './canvas.types';
import type { Element, StrokePoint } from './element.types';
import type { Bounds, Point } from './geometry.types';
import type { ScenePatch } from './scene.types';
import type { Palette } from './theme.types';
import type { PointerSample } from './tool.types';

export type SelectionHandle = 'nw' | 'ne' | 'se' | 'sw';

export type SelectionGesture = 'idle' | 'region' | 'transform';

export interface SelectionShape {
  readonly bounds: Bounds;
  contains: (point: Point) => boolean;
  crossings: (from: Point, to: Point) => number[];
}

export interface StrokeRun {
  points: StrokePoint[];
  inside: boolean;
}

export interface SelectionResult {
  ids: readonly string[];
  patch: ScenePatch;
}

export interface SelectionRegion {
  begin: (sample: PointerSample) => void;
  extend: (sample: PointerSample) => void;
  select: (elements: Iterable<Element>) => SelectionResult;
  clear: () => void;
  draw: (ctx: CanvasRenderingContext2D, view: ViewState, colors: Palette) => void;
}
