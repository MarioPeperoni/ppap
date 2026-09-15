import { placedCenter } from '@/core/element/element-placement';
import { rotatePoint } from '@/core/geometry/rotation';
import type { Element, Point, StrokePoint } from '@/types';

export function translateElement(element: Element, deltaX: number, deltaY: number): Element {
  switch (element.type) {
    case 'stroke':
      return {
        ...element,
        points: element.points.map(([x, y, pressure]): StrokePoint => [
          x + deltaX,
          y + deltaY,
          pressure,
        ]),
      };
    case 'image':
    case 'text':
      return { ...element, x: element.x + deltaX, y: element.y + deltaY };
  }
}

export function scaleElement(element: Element, anchor: Point, factor: number): Element {
  switch (element.type) {
    case 'stroke':
      return {
        ...element,
        points: element.points.map(([x, y, pressure]): StrokePoint => [
          anchor.x + (x - anchor.x) * factor,
          anchor.y + (y - anchor.y) * factor,
          pressure,
        ]),
        scale: element.scale * factor,
      };
    case 'image':
      return {
        ...element,
        x: anchor.x + (element.x - anchor.x) * factor,
        y: anchor.y + (element.y - anchor.y) * factor,
        width: element.width * factor,
        height: element.height * factor,
      };
    case 'text':
      return {
        ...element,
        x: anchor.x + (element.x - anchor.x) * factor,
        y: anchor.y + (element.y - anchor.y) * factor,
        width: element.width * factor,
        height: element.height * factor,
        scale: element.scale * factor,
      };
  }
}

/** A stroke turns by its points; a placed rect carries the angle and swings its centre. */
export function rotateElement(element: Element, pivot: Point, angle: number): Element {
  switch (element.type) {
    case 'stroke':
      return {
        ...element,
        points: element.points.map(([x, y, pressure]): StrokePoint => {
          const turned = rotatePoint({ x, y }, pivot, angle);

          return [turned.x, turned.y, pressure];
        }),
      };
    case 'image':
    case 'text': {
      const center = rotatePoint(placedCenter(element), pivot, angle);

      return {
        ...element,
        x: center.x - element.width / 2,
        y: center.y - element.height / 2,
        rotation: element.rotation + angle,
      };
    }
  }
}
