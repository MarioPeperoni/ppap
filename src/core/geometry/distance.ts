import type { Point } from '@/types';

export function pointSegmentDistance(point: Point, from: Point, to: Point): number {
  const runX = to.x - from.x;
  const runY = to.y - from.y;
  const lengthSquared = runX * runX + runY * runY;

  if (lengthSquared === 0) return Math.hypot(point.x - from.x, point.y - from.y);

  const projection = ((point.x - from.x) * runX + (point.y - from.y) * runY) / lengthSquared;
  const clamped = Math.max(0, Math.min(1, projection));

  return Math.hypot(point.x - (from.x + clamped * runX), point.y - (from.y + clamped * runY));
}
