import {
  HANDLE_SIZE_PX,
  REGION_DASH_PX,
  SELECTION_FILL_ALPHA,
  SELECTION_LINE_PX,
} from '@/constants/select.constants';
import { toScreen } from '@/core/camera/camera-transform';
import {
  handleCorner,
  SELECTION_HANDLES,
  selectionFrame,
} from '@/renderer/board/selection/selection-handles';
import type { Bounds, Palette, Point, ViewState } from '@/types';

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
  bounds: Bounds,
): void {
  const frame = selectionFrame(bounds, view.camera.zoom);
  const topLeft = toScreen(view.camera, { x: frame.minX, y: frame.minY });
  const bottomRight = toScreen(view.camera, { x: frame.maxX, y: frame.maxY });

  ctx.strokeStyle = colors.blue;
  ctx.lineWidth = SELECTION_LINE_PX;
  ctx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);

  ctx.fillStyle = colors.canvas;

  for (const handle of SELECTION_HANDLES) {
    const corner = toScreen(view.camera, handleCorner(frame, handle));
    const origin = { x: corner.x - HANDLE_SIZE_PX / 2, y: corner.y - HANDLE_SIZE_PX / 2 };

    ctx.fillRect(origin.x, origin.y, HANDLE_SIZE_PX, HANDLE_SIZE_PX);
    ctx.strokeRect(origin.x, origin.y, HANDLE_SIZE_PX, HANDLE_SIZE_PX);
  }
}
