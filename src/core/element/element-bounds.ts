import { strokeBounds } from '@/core/stroke/stroke-bounds';
import type { Bounds, Element } from '@/types';

export function elementBounds(element: Element): Bounds {
  switch (element.type) {
    case 'stroke':
      return strokeBounds(element);
    case 'image':
      return {
        minX: element.x,
        minY: element.y,
        maxX: element.x + element.width,
        maxY: element.y + element.height,
      };
  }
}
