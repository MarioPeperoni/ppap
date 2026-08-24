import { MIN_FRAGMENT_LENGTH, MIN_FRAGMENT_POINTS } from '@/constants/fragment.constants';
import { createStroke } from '@/core/element/element.factory';
import { polylineLength } from '@/core/stroke/stroke-point';
import type { StrokeElement, StrokePoint } from '@/types';

export function isSubstantialRun(points: readonly StrokePoint[]): boolean {
  return points.length >= MIN_FRAGMENT_POINTS && polylineLength(points) >= MIN_FRAGMENT_LENGTH;
}

export function fragmentOf(source: StrokeElement, points: StrokePoint[]): StrokeElement {
  return createStroke(points, source.color, source.size, source.nib, source.scale);
}
