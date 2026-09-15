import { rotatePoint } from '@/core/geometry/rotation';
import type { Bounds, PlacedElement, Point } from '@/types';

export function placedCenter(element: PlacedElement): Point {
  return { x: element.x + element.width / 2, y: element.y + element.height / 2 };
}

export function placedBounds(element: PlacedElement): Bounds {
  const center = placedCenter(element);
  const cos = Math.abs(Math.cos(element.rotation));
  const sin = Math.abs(Math.sin(element.rotation));
  const halfWidth = (element.width * cos + element.height * sin) / 2;
  const halfHeight = (element.width * sin + element.height * cos) / 2;

  return {
    minX: center.x - halfWidth,
    minY: center.y - halfHeight,
    maxX: center.x + halfWidth,
    maxY: center.y + halfHeight,
  };
}

/** Turns the point back into the element's own frame, so a hit lands where the ink is drawn. */
export function placedContainsPoint(element: PlacedElement, point: Point, slop: number): boolean {
  const local = rotatePoint(point, placedCenter(element), -element.rotation);

  return (
    local.x >= element.x - slop &&
    local.x <= element.x + element.width + slop &&
    local.y >= element.y - slop &&
    local.y <= element.y + element.height + slop
  );
}
