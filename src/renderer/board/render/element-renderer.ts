import { drawImage } from '@/renderer/board/render/image-renderer';
import { drawStroke } from '@/renderer/board/render/stroke-renderer';
import type { Element, Palette } from '@/types';

export function drawElement(
  ctx: CanvasRenderingContext2D,
  element: Element,
  colors: Palette,
): void {
  switch (element.type) {
    case 'stroke':
      drawStroke(ctx, element, colors);
      return;
    case 'image':
      drawImage(ctx, element);
      return;
  }
}
