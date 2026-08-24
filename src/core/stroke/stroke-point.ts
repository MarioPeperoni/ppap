import type { Point, StrokePoint } from '@/types';

export function toPoint(point: StrokePoint): Point {
  return { x: point[0], y: point[1] };
}

export function lerpStrokePoint(from: StrokePoint, to: StrokePoint, ratio: number): StrokePoint {
  return [
    from[0] + (to[0] - from[0]) * ratio,
    from[1] + (to[1] - from[1]) * ratio,
    from[2] + (to[2] - from[2]) * ratio,
  ];
}

export function polylineLength(points: readonly StrokePoint[]): number {
  let length = 0;
  let previous: StrokePoint | undefined;

  for (const point of points) {
    if (previous !== undefined)
      length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    previous = point;
  }

  return length;
}
