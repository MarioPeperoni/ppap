import { getStroke } from 'perfect-freehand';
import {
  FREEHAND_SMOOTHING,
  FREEHAND_STREAMLINE,
  NIB_THINNING,
} from '@/constants/stroke.constants';
import { strokeWidth } from '@/core/stroke/stroke-width';
import type { NibToken, StrokeElement, StrokeOutline, StrokePoint } from '@/types';

const outlineCache = new WeakMap<StrokeElement, StrokeOutline>();

export function hasRealPressure(points: readonly StrokePoint[]): boolean {
  const first = points[0];
  if (first === undefined) return false;

  return points.some((point) => point[2] !== first[2]);
}

export function outlineForPoints(
  points: readonly StrokePoint[],
  width: number,
  nib: NibToken,
): StrokeOutline {
  return getStroke(
    points.map(([x, y, pressure]) => ({ x, y, pressure })),
    {
      size: width,
      thinning: NIB_THINNING[nib],
      smoothing: FREEHAND_SMOOTHING,
      streamline: FREEHAND_STREAMLINE,
      simulatePressure: !hasRealPressure(points),
    },
  );
}

export function strokeOutline(stroke: StrokeElement): StrokeOutline {
  const cached = outlineCache.get(stroke);
  if (cached !== undefined) return cached;

  const outline = outlineForPoints(
    stroke.points,
    strokeWidth(stroke.size, stroke.scale, stroke.nib),
    stroke.nib,
  );
  outlineCache.set(stroke, outline);

  return outline;
}
