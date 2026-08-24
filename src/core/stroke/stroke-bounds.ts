import { STROKE_SIZE_UNITS } from '@/constants/stroke.constants';
import { boundsOf, expandBounds } from '@/core/geometry/bounds';
import type { Bounds, StrokeElement } from '@/types';

const EMPTY_BOUNDS: Bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

const boundsCache = new WeakMap<StrokeElement, Bounds>();

export function strokeBounds(stroke: StrokeElement): Bounds {
  const cached = boundsCache.get(stroke);
  if (cached !== undefined) return cached;

  const points = boundsOf(stroke.points.map(([x, y]) => ({ x, y })));
  const bounds = expandBounds(points ?? EMPTY_BOUNDS, STROKE_SIZE_UNITS[stroke.size]);
  boundsCache.set(stroke, bounds);

  return bounds;
}
