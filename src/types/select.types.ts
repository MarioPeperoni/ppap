import type { ViewState } from './canvas.types';
import type { Element, StrokePoint } from './element.types';
import type { Bounds, Point } from './geometry.types';
import type { ScenePatch } from './scene.types';
import type { Palette } from './theme.types';
import type { PointerSample } from './tool.types';

export type SelectionHandle = 'nw' | 'ne' | 'se' | 'sw';

export type SelectionGrip =
  { kind: 'move' } | { kind: 'scale'; handle: SelectionHandle } | { kind: 'rotate' };

export type SelectionGesture = 'idle' | 'region' | 'transform';

/** The box drawn around a selection: a lone placed element keeps its turn, a group is upright. */
export interface SelectionFrame {
  center: Point;
  width: number;
  height: number;
  rotation: number;
}

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
