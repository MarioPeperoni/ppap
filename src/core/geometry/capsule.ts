import type { Interval, Point } from '@/types';

const UNIT: Interval = { start: 0, end: 1 };

function cross(firstX: number, firstY: number, secondX: number, secondY: number): number {
  return firstX * secondY - firstY * secondX;
}

function solveAtMostZero(square: number, linear: number, constant: number): Interval | null {
  if (square === 0) {
    if (linear === 0) return constant <= 0 ? { start: -Infinity, end: Infinity } : null;

    const root = -constant / linear;

    return linear > 0 ? { start: -Infinity, end: root } : { start: root, end: Infinity };
  }

  const discriminant = linear * linear - 4 * square * constant;
  if (discriminant < 0) return null;

  const root = Math.sqrt(discriminant);

  return { start: (-linear - root) / (2 * square), end: (-linear + root) / (2 * square) };
}

function overlap(first: Interval | null, second: Interval | null): Interval | null {
  if (first === null || second === null) return null;

  const start = Math.max(first.start, second.start);
  const end = Math.min(first.end, second.end);

  return start <= end ? { start, end } : null;
}

function span(first: Interval | null, second: Interval | null): Interval | null {
  if (first === null) return second;
  if (second === null) return first;

  return { start: Math.min(first.start, second.start), end: Math.max(first.end, second.end) };
}

/**
 * The portion of segment `p0 → p1`, as a range of its own parameter t, that lies within `radius`
 * of the capsule swept from `from` to `to`. The capsule is convex, so the result is one range.
 */
export function segmentCapsuleOverlap(
  p0: Point,
  p1: Point,
  from: Point,
  to: Point,
  radius: number,
): Interval | null {
  const runX = p1.x - p0.x;
  const runY = p1.y - p0.y;
  const runLengthSquared = runX * runX + runY * runY;

  const startX = p0.x - from.x;
  const startY = p0.y - from.y;
  const nearStart = solveAtMostZero(
    runLengthSquared,
    2 * (startX * runX + startY * runY),
    startX * startX + startY * startY - radius * radius,
  );

  const axisX = to.x - from.x;
  const axisY = to.y - from.y;
  const axisLengthSquared = axisX * axisX + axisY * axisY;

  if (axisLengthSquared === 0) return overlap(nearStart, UNIT);

  const endX = p0.x - to.x;
  const endY = p0.y - to.y;
  const nearEnd = solveAtMostZero(
    runLengthSquared,
    2 * (endX * runX + endY * runY),
    endX * endX + endY * endY - radius * radius,
  );

  const runCross = cross(runX, runY, axisX, axisY);
  const startCross = cross(startX, startY, axisX, axisY);
  const besideAxis = solveAtMostZero(
    runCross * runCross,
    2 * startCross * runCross,
    startCross * startCross - radius * radius * axisLengthSquared,
  );

  const projection = startX * axisX + startY * axisY;
  const projectionRate = runX * axisX + runY * axisY;

  const beforeStart = solveAtMostZero(0, projectionRate, projection);
  const afterEnd = solveAtMostZero(0, -projectionRate, axisLengthSquared - projection);
  const alongAxis = overlap(
    solveAtMostZero(0, -projectionRate, -projection),
    solveAtMostZero(0, projectionRate, projection - axisLengthSquared),
  );

  const covered = span(
    span(overlap(nearStart, beforeStart), overlap(nearEnd, afterEnd)),
    overlap(besideAxis, alongAxis),
  );

  return overlap(covered, UNIT);
}
