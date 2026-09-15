import { elementBounds } from '@/core/element/element-bounds';
import { placedContainsPoint } from '@/core/element/element-placement';
import { boundsContainPoint, expandBounds } from '@/core/geometry/bounds';
import { pointSegmentDistance } from '@/core/geometry/distance';
import { toPoint } from '@/core/stroke/stroke-point';
import { strokeWidth } from '@/core/stroke/stroke-width';
import type { Element, Point, StrokeElement } from '@/types';

function touchesStroke(stroke: StrokeElement, point: Point, slop: number): boolean {
  const reach = strokeWidth(stroke.size, stroke.scale, stroke.nib) / 2 + slop;
  const only = stroke.points[0];
  if (only === undefined) return false;

  if (stroke.points.length === 1) {
    return Math.hypot(point.x - only[0], point.y - only[1]) <= reach;
  }

  for (let index = 0; index < stroke.points.length - 1; index += 1) {
    const start = stroke.points[index];
    const end = stroke.points[index + 1];
    if (start === undefined || end === undefined) continue;

    if (pointSegmentDistance(point, toPoint(start), toPoint(end)) <= reach) return true;
  }

  return false;
}

function touchesElement(element: Element, point: Point, slop: number): boolean {
  switch (element.type) {
    case 'stroke':
      return touchesStroke(element, point, slop);
    case 'image':
    case 'text':
      return placedContainsPoint(element, point, slop);
  }
}

/** The topmost element under the point, or null when the point sits on bare canvas. */
export function pickElement(
  elements: Iterable<Element>,
  point: Point,
  slop: number,
): string | null {
  let picked: string | null = null;

  for (const element of elements) {
    if (!boundsContainPoint(expandBounds(elementBounds(element), slop), point)) continue;

    if (touchesElement(element, point, slop)) picked = element.id;
  }

  return picked;
}
