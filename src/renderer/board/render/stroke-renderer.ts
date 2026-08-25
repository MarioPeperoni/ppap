import { strokeColor } from '@/core/color/stroke-color';
import { strokeOutline } from '@/core/stroke/stroke-outline';
import type { Palette, StrokeElement, StrokeOutline } from '@/types';

const pathCache = new WeakMap<StrokeElement, Path2D>();

export function outlinePath(outline: StrokeOutline): Path2D {
  const path = new Path2D();
  const first = outline[0];
  if (first === undefined) return path;

  path.moveTo(first[0], first[1]);
  for (const [x, y] of outline) path.lineTo(x, y);
  path.closePath();

  return path;
}

function strokePath(stroke: StrokeElement): Path2D {
  const cached = pathCache.get(stroke);
  if (cached !== undefined) return cached;

  const path = outlinePath(strokeOutline(stroke));
  pathCache.set(stroke, path);

  return path;
}

export function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: StrokeElement,
  colors: Palette,
): void {
  ctx.fillStyle = strokeColor(stroke.color, colors);
  ctx.fill(strokePath(stroke));
}
