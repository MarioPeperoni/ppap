import type { Point } from '@/types';

export function rotatePoint(point: Point, pivot: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = point.x - pivot.x;
  const y = point.y - pivot.y;

  return { x: pivot.x + x * cos - y * sin, y: pivot.y + x * sin + y * cos };
}

export function angleTo(pivot: Point, point: Point): number {
  return Math.atan2(point.y - pivot.y, point.x - pivot.x);
}

export function snapAngle(angle: number, step: number): number {
  return Math.round(angle / step) * step;
}
