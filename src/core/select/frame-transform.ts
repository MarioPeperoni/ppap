import { normalizeAngle, rotatePoint } from '@/core/geometry/rotation';
import type { Point, SelectionFrame } from '@/types';

export function translateFrame(
  frame: SelectionFrame,
  deltaX: number,
  deltaY: number,
): SelectionFrame {
  return { ...frame, center: { x: frame.center.x + deltaX, y: frame.center.y + deltaY } };
}

export function scaleFrame(frame: SelectionFrame, anchor: Point, factor: number): SelectionFrame {
  return {
    ...frame,
    center: {
      x: anchor.x + (frame.center.x - anchor.x) * factor,
      y: anchor.y + (frame.center.y - anchor.y) * factor,
    },
    width: frame.width * factor,
    height: frame.height * factor,
  };
}

export function rotateFrame(frame: SelectionFrame, pivot: Point, angle: number): SelectionFrame {
  return {
    ...frame,
    center: rotatePoint(frame.center, pivot, angle),
    rotation: normalizeAngle(frame.rotation + angle),
  };
}
