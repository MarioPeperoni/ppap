import type { CameraState } from './camera.types';
import type { ViewState } from './canvas.types';
import type { Point } from './geometry.types';
import type { Palette } from './theme.types';

export type ToolId = 'pen' | 'eraser' | 'marquee' | 'lasso' | 'hand';

export interface PanOrigin {
  screen: Point;
  camera: CameraState;
}

export interface PointerSample {
  board: Point;
  screen: Point;
  pressure: number;
  pointerType: string;
  buttons: number;
  shiftKey: boolean;
}

export interface ToolContext {
  view: ViewState;
  requestOverlay: () => void;
  setCursor: (cursor: string | null) => void;
}

export interface Tool {
  readonly id: ToolId;
  readonly label: string;
  readonly keys: readonly string[];
  readonly cursor: string;
  onPointerDown: (sample: PointerSample, context: ToolContext) => void;
  onPointerMove: (sample: PointerSample, context: ToolContext) => void;
  onPointerUp: (sample: PointerSample, context: ToolContext) => void;
  onCancel: (context: ToolContext) => void;
  drawOverlay: (ctx: CanvasRenderingContext2D, view: ViewState, colors: Palette) => void;
}
