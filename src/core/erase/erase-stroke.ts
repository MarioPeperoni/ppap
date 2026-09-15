import { splitStroke } from '@/core/erase/stroke-splitter';
import { boundsIntersect, expandBounds, segmentBounds } from '@/core/geometry/bounds';
import { strokeBounds } from '@/core/stroke/stroke-bounds';
import type { Element, EraseHit, Point } from '@/types';

/** The eraser is an ink tool: it cuts strokes and leaves images and text boxes standing. */
export function eraseSegment(
  elements: Iterable<Element>,
  from: Point,
  to: Point,
  radius: number,
): EraseHit[] {
  const region = expandBounds(segmentBounds(from, to), radius);
  const hits: EraseHit[] = [];

  for (const element of elements) {
    if (element.type !== 'stroke') continue;
    if (!boundsIntersect(strokeBounds(element), region)) continue;

    const fragments = splitStroke(element, from, to, radius);
    if (fragments !== null) hits.push({ source: element, fragments });
  }

  return hits;
}
