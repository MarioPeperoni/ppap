import type { Point } from '@/types';

const FULL_TURN = Math.PI * 2;

export const ORIGIN: Point = { x: 0, y: 0 };

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

export function normalizeAngle(angle: number): number {
  const turn = angle % FULL_TURN;
  if (turn > Math.PI) return turn - FULL_TURN;
  if (turn <= -Math.PI) return turn + FULL_TURN;

  return turn;
}

export function snapAngle(angle: number, step: number): number {
  return Math.round(angle / step) * step;
}

/** Snaps where a turn lands rather than how far it goes, so a snapped element sits square. */
export function snapTurn(rotation: number, angle: number, step: number): number {
  return snapAngle(rotation + angle, step) - rotation;
}
