import { imageCache } from '@/renderer/assets/image-cache';
import { applyPlacement } from '@/renderer/board/render/placement';
import type { ImageElement } from '@/types';

export function drawImage(ctx: CanvasRenderingContext2D, element: ImageElement): void {
  const source = imageCache.get(element.assetId);
  if (source === undefined) return;

  ctx.save();
  applyPlacement(ctx, element);
  ctx.drawImage(source, 0, 0, element.width, element.height);
  ctx.restore();
}
