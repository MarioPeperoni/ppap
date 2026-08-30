import { unionBounds } from '@/core/geometry/bounds';
import { strokeBounds } from '@/core/stroke/stroke-bounds';
import type { Bounds, Element } from '@/types';

export function elementBounds(element: Element): Bounds {
  switch (element.type) {
    case 'stroke':
      return strokeBounds(element);
    case 'image':
    case 'text':
      return {
        minX: element.x,
        minY: element.y,
        maxX: element.x + element.width,
        maxY: element.y + element.height,
      };
  }
}

export function boundsOfElements(elements: Iterable<Element>): Bounds | null {
  let bounds: Bounds | null = null;

  for (const element of elements) {
    const box = elementBounds(element);
    bounds = bounds === null ? box : unionBounds(bounds, box);
  }

  return bounds;
}
