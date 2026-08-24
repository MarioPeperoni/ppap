import { imageCache } from '@/renderer/assets/image-cache';
import type { ImageElement } from '@/types';

export function drawImage(ctx: CanvasRenderingContext2D, element: ImageElement): void {
  const source = imageCache.get(element.assetId);
  if (source === undefined) return;

  ctx.drawImage(source, element.x, element.y, element.width, element.height);
}
