import { elementBounds } from '@/core/element/element-bounds';
import { splitStroke } from '@/core/erase/stroke-splitter';
import {
  boundsContainPoint,
  boundsIntersect,
  expandBounds,
  segmentBounds,
} from '@/core/geometry/bounds';
import type { Element, EraseHit, Point } from '@/types';

export function eraseSegment(
  elements: Iterable<Element>,
  from: Point,
  to: Point,
  radius: number,
): EraseHit[] {
  const region = expandBounds(segmentBounds(from, to), radius);
  const hits: EraseHit[] = [];

  for (const element of elements) {
    const bounds = elementBounds(element);
    if (!boundsIntersect(bounds, region)) continue;

    switch (element.type) {
      case 'image':
        if (boundsContainPoint(bounds, to) || boundsContainPoint(bounds, from)) {
          hits.push({ source: element, fragments: [] });
        }
        break;
      case 'stroke': {
        const fragments = splitStroke(element, from, to, radius);
        if (fragments !== null) hits.push({ source: element, fragments });
        break;
      }
    }
  }

  return hits;
}
