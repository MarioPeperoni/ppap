import type { Point } from '@/types';

/** Where segment `p0 → p1` crosses `q0 → q1`, as a fraction of its own length. */
export function segmentCrossing(p0: Point, p1: Point, q0: Point, q1: Point): number | null {
  const runX = p1.x - p0.x;
  const runY = p1.y - p0.y;
  const edgeX = q1.x - q0.x;
  const edgeY = q1.y - q0.y;

  const denominator = runX * edgeY - runY * edgeX;
  if (denominator === 0) return null;

  const offsetX = q0.x - p0.x;
  const offsetY = q0.y - p0.y;
  const along = (offsetX * edgeY - offsetY * edgeX) / denominator;
  const acrossEdge = (offsetX * runY - offsetY * runX) / denominator;

  if (along <= 0 || along >= 1) return null;
  if (acrossEdge < 0 || acrossEdge > 1) return null;

  return along;
}
