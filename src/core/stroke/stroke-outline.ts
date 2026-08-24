import { getStroke } from 'perfect-freehand';
import {
  FREEHAND_SMOOTHING,
  FREEHAND_STREAMLINE,
  FREEHAND_THINNING,
  STROKE_SIZE_UNITS,
} from '@/constants/stroke.constants';
import type { SizeToken, StrokeElement, StrokeOutline, StrokePoint } from '@/types';

const outlineCache = new WeakMap<StrokeElement, StrokeOutline>();

export function hasRealPressure(points: readonly StrokePoint[]): boolean {
  const first = points[0];
  if (first === undefined) return false;

  return points.some((point) => point[2] !== first[2]);
}

export function outlineForPoints(points: readonly StrokePoint[], size: SizeToken): StrokeOutline {
  return getStroke(
    points.map(([x, y, pressure]) => ({ x, y, pressure })),
    {
      size: STROKE_SIZE_UNITS[size],
      thinning: FREEHAND_THINNING,
      smoothing: FREEHAND_SMOOTHING,
      streamline: FREEHAND_STREAMLINE,
      simulatePressure: !hasRealPressure(points),
    },
  );
}

export function strokeOutline(stroke: StrokeElement): StrokeOutline {
  const cached = outlineCache.get(stroke);
  if (cached !== undefined) return cached;

  const outline = outlineForPoints(stroke.points, stroke.size);
  outlineCache.set(stroke, outline);

  return outline;
}
