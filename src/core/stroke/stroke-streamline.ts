import { POINTER_STREAMLINE } from '@/constants/stroke.constants';
import type { StrokePoint } from '@/types';

/**
 * Pulls a raw pointer sample toward the previous one, damping the jitter of the input device
 * before the point is stored.
 */
export function streamlinePoint(
  previous: StrokePoint | undefined,
  raw: StrokePoint,
  factor = POINTER_STREAMLINE,
): StrokePoint {
  if (previous === undefined) return raw;

  const weight = 1 - factor;

  return [
    previous[0] + (raw[0] - previous[0]) * weight,
    previous[1] + (raw[1] - previous[1]) * weight,
    raw[2],
  ];
}
