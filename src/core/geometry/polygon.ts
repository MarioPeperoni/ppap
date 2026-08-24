import type { Point } from '@/types';

export function pointInPolygon(point: Point, polygon: readonly Point[]): boolean {
  let previous = polygon[polygon.length - 1];
  if (previous === undefined) return false;

  let inside = false;

  for (const current of polygon) {
    const straddles = current.y > point.y !== previous.y > point.y;

    if (straddles) {
      const crossingX =
        ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;
      if (point.x < crossingX) inside = !inside;
    }

    previous = current;
  }

  return inside;
}
