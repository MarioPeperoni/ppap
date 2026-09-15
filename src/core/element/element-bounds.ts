import { placedBounds } from '@/core/element/element-placement';
import { unionBounds } from '@/core/geometry/bounds';
import { strokeBounds } from '@/core/stroke/stroke-bounds';
import type { Bounds, Element } from '@/types';

export function elementBounds(element: Element): Bounds {
  switch (element.type) {
    case 'stroke':
      return strokeBounds(element);
    case 'image':
    case 'text':
      return placedBounds(element);
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
