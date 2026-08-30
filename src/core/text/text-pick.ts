import { elementBounds } from '@/core/element/element-bounds';
import { boundsContainPoint } from '@/core/geometry/bounds';
import type { Element, Point, TextElement } from '@/types';

/** The topmost text under the point, so a click lands back in what it looks like it hit. */
export function pickText(elements: Iterable<Element>, point: Point): TextElement | null {
  let picked: TextElement | null = null;

  for (const element of elements) {
    if (element.type !== 'text') continue;
    if (boundsContainPoint(elementBounds(element), point)) picked = element;
  }

  return picked;
}
