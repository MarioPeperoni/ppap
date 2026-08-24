import { PNG_MIME } from '@/constants/export.constants';
import { LIGHT_PALETTE } from '@/constants/palette.constants';
import { drawElement } from '@/renderer/board/render/element-renderer';
import type { Bounds, Element, Size } from '@/types';

export function renderElements(
  elements: readonly Element[],
  bounds: Bounds,
  canvas: Size,
  scale: number,
): HTMLCanvasElement {
  const surface = document.createElement('canvas');
  surface.width = Math.max(1, Math.round(canvas.width));
  surface.height = Math.max(1, Math.round(canvas.height));

  const ctx = surface.getContext('2d');
  if (ctx === null) throw new Error('Canvas 2D context unavailable');

  ctx.fillStyle = LIGHT_PALETTE.canvas;
  ctx.fillRect(0, 0, surface.width, surface.height);

  const width = (bounds.maxX - bounds.minX) * scale;
  const height = (bounds.maxY - bounds.minY) * scale;
  ctx.translate((surface.width - width) / 2, (surface.height - height) / 2);
  ctx.scale(scale, scale);
  ctx.translate(-bounds.minX, -bounds.minY);

  for (const element of elements) drawElement(ctx, element, LIGHT_PALETTE);

  return surface;
}

export async function canvasToPng(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, PNG_MIME);
  });
  if (blob === null) throw new Error('The canvas could not be encoded as PNG');

  return new Uint8Array(await blob.arrayBuffer());
}
