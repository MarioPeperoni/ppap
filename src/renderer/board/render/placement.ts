import { placedCenter } from '@/core/element/element-placement';
import type { PlacedElement } from '@/types';

/** Puts the canvas origin at the element's top-left corner, turned about its centre. */
export function applyPlacement(ctx: CanvasRenderingContext2D, element: PlacedElement): void {
  const center = placedCenter(element);

  ctx.translate(center.x, center.y);
  ctx.rotate(element.rotation);
  ctx.translate(-element.width / 2, -element.height / 2);
}
