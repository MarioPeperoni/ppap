import { describe, expect, it } from 'vitest';
import {
  boundsContainBounds,
  boundsIntersect,
  boundsOf,
  expandBounds,
} from '@/core/geometry/bounds';
import { pointSegmentDistance } from '@/core/geometry/distance';
import { pointInPolygon } from '@/core/geometry/polygon';

describe('distance', () => {
  it('measures distance to a segment, clamped at its ends', () => {
    const from = { x: 0, y: 0 };
    const to = { x: 10, y: 0 };

    expect(pointSegmentDistance({ x: 5, y: 3 }, from, to)).toBeCloseTo(3, 10);
    expect(pointSegmentDistance({ x: -4, y: 0 }, from, to)).toBeCloseTo(4, 10);
    expect(pointSegmentDistance({ x: 14, y: 3 }, from, to)).toBeCloseTo(5, 10);
    expect(pointSegmentDistance({ x: 3, y: 4 }, from, from)).toBeCloseTo(5, 10);
  });
});

describe('polygon', () => {
  it('contains points in a concave polygon', () => {
    const arrow = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 5, y: 4 },
      { x: 0, y: 10 },
    ];

    expect(pointInPolygon({ x: 5, y: 1 }, arrow)).toBe(true);
    expect(pointInPolygon({ x: 1, y: 8 }, arrow)).toBe(true);
    expect(pointInPolygon({ x: 5, y: 8 }, arrow)).toBe(false);
    expect(pointInPolygon({ x: -1, y: 5 }, arrow)).toBe(false);
  });

  it('contains points in a self-intersecting polygon by the even-odd rule', () => {
    const bowtie = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 10, y: 0 },
      { x: 0, y: 10 },
    ];

    expect(pointInPolygon({ x: 2, y: 5 }, bowtie)).toBe(true);
    expect(pointInPolygon({ x: 9, y: 8 }, bowtie)).toBe(true);
    expect(pointInPolygon({ x: 5, y: 2 }, bowtie)).toBe(false);
    expect(pointInPolygon({ x: 5, y: 8 }, bowtie)).toBe(false);
  });

  it('rejects every point of an empty polygon', () => {
    expect(pointInPolygon({ x: 0, y: 0 }, [])).toBe(false);
  });
});

describe('bounds', () => {
  it('intersects and contains rects', () => {
    const bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 };

    expect(boundsIntersect(bounds, { minX: 9, minY: 9, maxX: 20, maxY: 20 })).toBe(true);
    expect(boundsIntersect(bounds, { minX: 11, minY: 0, maxX: 20, maxY: 10 })).toBe(false);
    expect(boundsIntersect(bounds, { minX: -5, minY: -5, maxX: 15, maxY: 15 })).toBe(true);
    expect(boundsContainBounds(bounds, { minX: 2, minY: 2, maxX: 8, maxY: 8 })).toBe(true);
    expect(boundsContainBounds(bounds, { minX: 2, minY: 2, maxX: 12, maxY: 8 })).toBe(false);
  });

  it('builds bounds from points and expands them', () => {
    const bounds = boundsOf([
      { x: 4, y: -2 },
      { x: -3, y: 7 },
    ]);

    expect(bounds).toEqual({ minX: -3, minY: -2, maxX: 4, maxY: 7 });
    expect(boundsOf([])).toBeNull();
    expect(bounds && expandBounds(bounds, 1)).toEqual({ minX: -4, minY: -3, maxX: 5, maxY: 8 });
  });
});
