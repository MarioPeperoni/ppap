import { getStroke } from 'perfect-freehand';
import {
  FREEHAND_SMOOTHING,
  FREEHAND_STREAMLINE,
  FREEHAND_THINNING,
} from '@/constants/stroke.constants';
import { strokeWidth } from '@/core/stroke/stroke-width';
import type { StrokeElement, StrokeOutline, StrokePoint } from '@/types';

const outlineCache = new WeakMap<StrokeElement, StrokeOutline>();

export function hasRealPressure(points: readonly StrokePoint[]): boolean {
  const first = points[0];
  if (first === undefined) return false;

  return points.some((point) => point[2] !== first[2]);
}

export function outlineForPoints(points: readonly StrokePoint[], width: number): StrokeOutline {
  return getStroke(
    points.map(([x, y, pressure]) => ({ x, y, pressure })),
    {
      size: width,
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

  const outline = outlineForPoints(stroke.points, strokeWidth(stroke.size, stroke.scale));
  outlineCache.set(stroke, outline);

  return outline;
}
