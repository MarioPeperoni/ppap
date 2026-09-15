import {
  HANDLE_SIZE_PX,
  REGION_DASH_PX,
  SELECTION_FILL_ALPHA,
  SELECTION_LINE_PX,
} from '@/constants/select.constants';
import { toScreen } from '@/core/camera/camera-transform';
import { frameCorner, frameCorners } from '@/core/select/selection-frame';
import { paddedFrame, rotateGrip } from '@/renderer/board/selection/selection-handles';
import type { Palette, Point, SelectionFrame, ViewState } from '@/types';

function screenPath(camera: ViewState['camera'], points: readonly Point[]): Path2D {
  const path = new Path2D();
  const first = points[0];
  if (first === undefined) return path;

  const start = toScreen(camera, first);
  path.moveTo(start.x, start.y);

  for (const point of points.slice(1)) {
    const at = toScreen(camera, point);
    path.lineTo(at.x, at.y);
  }

  path.closePath();

  return path;
}

function drawHandle(ctx: CanvasRenderingContext2D, at: Point): void {
  ctx.fillRect(
    at.x - HANDLE_SIZE_PX / 2,
    at.y - HANDLE_SIZE_PX / 2,
    HANDLE_SIZE_PX,
    HANDLE_SIZE_PX,
  );
  ctx.strokeRect(
    at.x - HANDLE_SIZE_PX / 2,
    at.y - HANDLE_SIZE_PX / 2,
    HANDLE_SIZE_PX,
    HANDLE_SIZE_PX,
  );
}

function drawRotateGrip(
  ctx: CanvasRenderingContext2D,
  view: ViewState,
  frame: SelectionFrame,
): void {
  const grip = toScreen(view.camera, rotateGrip(frame, view.camera.zoom));
  const north = toScreen(view.camera, frameCorner(frame, 'nw'));
  const east = toScreen(view.camera, frameCorner(frame, 'ne'));

  ctx.beginPath();
  ctx.moveTo((north.x + east.x) / 2, (north.y + east.y) / 2);
  ctx.lineTo(grip.x, grip.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(grip.x, grip.y, HANDLE_SIZE_PX / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

export function drawRegion(
  ctx: CanvasRenderingContext2D,
  view: ViewState,
  colors: Palette,
  points: readonly Point[],
): void {
  const path = screenPath(view.camera, points);

  ctx.fillStyle = colors.blue;
  ctx.globalAlpha = SELECTION_FILL_ALPHA;
  ctx.fill(path);

  ctx.globalAlpha = 1;
  ctx.strokeStyle = colors.blue;
  ctx.lineWidth = SELECTION_LINE_PX;
  ctx.setLineDash(REGION_DASH_PX);
  ctx.stroke(path);
  ctx.setLineDash([]);
}

export function drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  view: ViewState,
  colors: Palette,
  frame: SelectionFrame,
): void {
  const padded = paddedFrame(frame, view.camera.zoom);

  ctx.strokeStyle = colors.blue;
  ctx.lineWidth = SELECTION_LINE_PX;
  ctx.stroke(screenPath(view.camera, frameCorners(padded)));

  ctx.fillStyle = colors.canvas;
  drawRotateGrip(ctx, view, padded);

  for (const corner of frameCorners(padded)) drawHandle(ctx, toScreen(view.camera, corner));
}
