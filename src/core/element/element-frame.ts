import { placedCenter } from '@/core/element/element-placement';
import { boundsCenter } from '@/core/geometry/bounds';
import { ORIGIN, rotatePoint } from '@/core/geometry/rotation';
import { uprightStrokeBounds } from '@/core/stroke/stroke-bounds';
import type { Element, SelectionFrame, StrokeElement } from '@/types';

function strokeFrame(stroke: StrokeElement): SelectionFrame {
  const bounds = uprightStrokeBounds(stroke);

  return {
    center: rotatePoint(boundsCenter(bounds), ORIGIN, stroke.rotation),
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
    rotation: stroke.rotation,
  };
}

/** The box an element fills upright, carried back out at the angle the element is turned to. */
export function elementFrame(element: Element): SelectionFrame {
  switch (element.type) {
    case 'stroke':
      return strokeFrame(element);
    case 'image':
    case 'text':
      return {
        center: placedCenter(element),
        width: element.width,
        height: element.height,
        rotation: element.rotation,
      };
  }
}
