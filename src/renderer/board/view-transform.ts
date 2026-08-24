import type { ViewState } from '@/types';

export function applyBoardTransform(ctx: CanvasRenderingContext2D, view: ViewState): void {
  const scale = view.camera.zoom * view.dpr;

  ctx.setTransform(scale, 0, 0, scale, -view.camera.x * scale, -view.camera.y * scale);
}

export function applyScreenTransform(ctx: CanvasRenderingContext2D, view: ViewState): void {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
}

export function withBoardTransform(
  ctx: CanvasRenderingContext2D,
  view: ViewState,
  draw: () => void,
): void {
  ctx.save();
  applyBoardTransform(ctx, view);
  draw();
  ctx.restore();
}
