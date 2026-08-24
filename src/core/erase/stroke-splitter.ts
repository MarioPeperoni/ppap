import {
  MAX_STROKE_FRAGMENTS,
  MIN_FRAGMENT_LENGTH,
  MIN_FRAGMENT_POINTS,
} from '@/constants/erase.constants';
import { STROKE_SIZE_UNITS } from '@/constants/stroke.constants';
import { createStroke } from '@/core/element/element.factory';
import { segmentCapsuleOverlap } from '@/core/geometry/capsule';
import { pointSegmentDistance } from '@/core/geometry/distance';
import { lerpStrokePoint, polylineLength, toPoint } from '@/core/stroke/stroke-point';
import type { Point, StrokeElement, StrokePoint } from '@/types';

/** How far the eraser reaches from its centre, so it clears exactly the ink its circle covers. */
export function eraserReach(stroke: StrokeElement, radius: number): number {
  return radius + STROKE_SIZE_UNITS[stroke.size] / 2;
}

function keptRuns(
  points: readonly StrokePoint[],
  from: Point,
  to: Point,
  reach: number,
): StrokePoint[][] | null {
  const runs: StrokePoint[][] = [];
  let run: StrokePoint[] = [];
  let touched = false;

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    if (start === undefined || end === undefined) continue;

    const covered = segmentCapsuleOverlap(toPoint(start), toPoint(end), from, to, reach);

    if (covered === null) {
      if (run.length === 0) run.push(start);
      run.push(end);
      continue;
    }

    touched = true;

    if (covered.start > 0) {
      if (run.length === 0) run.push(start);
      run.push(lerpStrokePoint(start, end, covered.start));
    }

    if (run.length > 0) {
      runs.push(run);
      run = [];
    }

    if (covered.end < 1) run.push(lerpStrokePoint(start, end, covered.end), end);
  }

  if (run.length > 0) runs.push(run);

  return touched ? runs : null;
}

function isSubstantial(points: StrokePoint[]): boolean {
  return points.length >= MIN_FRAGMENT_POINTS && polylineLength(points) >= MIN_FRAGMENT_LENGTH;
}

/**
 * Cuts the ink covered by the eraser out of a stroke. Returns the surviving fragments, or null
 * when the eraser never touched it.
 */
export function splitStroke(
  stroke: StrokeElement,
  from: Point,
  to: Point,
  radius: number,
): StrokeElement[] | null {
  const reach = eraserReach(stroke, radius);
  const only = stroke.points[0];

  if (stroke.points.length === 1 && only !== undefined) {
    return pointSegmentDistance(toPoint(only), from, to) <= reach ? [] : null;
  }

  const runs = keptRuns(stroke.points, from, to, reach);
  if (runs === null) return null;

  const kept = runs.filter(isSubstantial);
  if (kept.length > MAX_STROKE_FRAGMENTS) return [];

  return kept.map((points) => createStroke(points, stroke.color, stroke.size));
}
