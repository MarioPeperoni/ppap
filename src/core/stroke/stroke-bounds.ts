import { boundsOf, expandBounds } from '@/core/geometry/bounds';
import { ORIGIN, rotatePoint } from '@/core/geometry/rotation';
import { strokeWidth } from '@/core/stroke/stroke-width';
import type { Bounds, StrokeElement } from '@/types';

const EMPTY_BOUNDS: Bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

const boundsCache = new WeakMap<StrokeElement, Bounds>();

function inkBounds(stroke: StrokeElement, angle: number): Bounds {
  const points = boundsOf(stroke.points.map(([x, y]) => rotatePoint({ x, y }, ORIGIN, angle)));

  return expandBounds(points ?? EMPTY_BOUNDS, strokeWidth(stroke.size, stroke.scale, stroke.nib));
}

export function strokeBounds(stroke: StrokeElement): Bounds {
  const cached = boundsCache.get(stroke);
  if (cached !== undefined) return cached;

  const bounds = inkBounds(stroke, 0);
  boundsCache.set(stroke, bounds);

  return bounds;
}

/** The ink measured with its turn undone, so the box hugs it at any angle. */
export function uprightStrokeBounds(stroke: StrokeElement): Bounds {
  return inkBounds(stroke, -stroke.rotation);
}
