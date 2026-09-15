import { boundsOfElements } from '@/core/element/element-bounds';
import { placedCenter } from '@/core/element/element-placement';
import { boundsCenter } from '@/core/geometry/bounds';
import { rotatePoint } from '@/core/geometry/rotation';
import type { Element, Point, SelectionFrame, SelectionHandle } from '@/types';

export const SELECTION_HANDLES: readonly SelectionHandle[] = ['nw', 'ne', 'se', 'sw'];

const CORNER_SIGNS: Record<SelectionHandle, Point> = {
  nw: { x: -1, y: -1 },
  ne: { x: 1, y: -1 },
  se: { x: 1, y: 1 },
  sw: { x: -1, y: 1 },
};

const OPPOSITE: Record<SelectionHandle, SelectionHandle> = {
  nw: 'se',
  ne: 'sw',
  se: 'nw',
  sw: 'ne',
};

export function frameOfElements(elements: readonly Element[]): SelectionFrame | null {
  const only = elements.length === 1 ? elements[0] : undefined;

  if (only !== undefined && only.type !== 'stroke') {
    return {
      center: placedCenter(only),
      width: only.width,
      height: only.height,
      rotation: only.rotation,
    };
  }

  const bounds = boundsOfElements(elements);
  if (bounds === null) return null;

  return {
    center: boundsCenter(bounds),
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
    rotation: 0,
  };
}

export function padFrame(frame: SelectionFrame, padding: number): SelectionFrame {
  return { ...frame, width: frame.width + padding * 2, height: frame.height + padding * 2 };
}

export function frameCorner(frame: SelectionFrame, handle: SelectionHandle): Point {
  const sign = CORNER_SIGNS[handle];

  return rotatePoint(
    {
      x: frame.center.x + (sign.x * frame.width) / 2,
      y: frame.center.y + (sign.y * frame.height) / 2,
    },
    frame.center,
    frame.rotation,
  );
}

export function frameCorners(frame: SelectionFrame): Point[] {
  return SELECTION_HANDLES.map((handle) => frameCorner(frame, handle));
}

export function oppositeCorner(frame: SelectionFrame, handle: SelectionHandle): Point {
  return frameCorner(frame, OPPOSITE[handle]);
}

/** The rotation grip stands off the top edge, turning with the frame it belongs to. */
export function frameGrip(frame: SelectionFrame, reach: number): Point {
  return rotatePoint(
    { x: frame.center.x, y: frame.center.y - frame.height / 2 - reach },
    frame.center,
    frame.rotation,
  );
}

export function frameContainsPoint(frame: SelectionFrame, point: Point): boolean {
  const local = rotatePoint(point, frame.center, -frame.rotation);

  return (
    Math.abs(local.x - frame.center.x) <= frame.width / 2 &&
    Math.abs(local.y - frame.center.y) <= frame.height / 2
  );
}

export function handleAngle(handle: SelectionHandle): number {
  const sign = CORNER_SIGNS[handle];

  return Math.atan2(sign.y, sign.x);
}
