import { boundsIntersect, boundsOf, segmentBounds } from '@/core/geometry/bounds';
import { segmentCrossing } from '@/core/geometry/intersection';
import { pointInPolygon } from '@/core/geometry/polygon';
import type { Bounds, Point, SelectionShape } from '@/types';

interface PolygonEdge {
  from: Point;
  to: Point;
  bounds: Bounds;
}

const EMPTY_BOUNDS: Bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

function edgesOf(polygon: readonly Point[]): PolygonEdge[] {
  const edges: PolygonEdge[] = [];
  let previous = polygon[polygon.length - 1];
  if (previous === undefined) return edges;

  for (const current of polygon) {
    edges.push({ from: previous, to: current, bounds: segmentBounds(previous, current) });
    previous = current;
  }

  return edges;
}

export function polygonShape(polygon: readonly Point[]): SelectionShape {
  const edges = edgesOf(polygon);

  return {
    bounds: boundsOf(polygon) ?? EMPTY_BOUNDS,

    contains: (point) => pointInPolygon(point, polygon),

    crossings: (from, to) => {
      const reach = segmentBounds(from, to);
      const found: number[] = [];

      for (const edge of edges) {
        if (!boundsIntersect(reach, edge.bounds)) continue;

        const at = segmentCrossing(from, to, edge.from, edge.to);
        if (at !== null) found.push(at);
      }

      return [...new Set(found)].sort((first, second) => first - second);
    },
  };
}
