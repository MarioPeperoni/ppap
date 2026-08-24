import { describe, expect, it } from 'vitest';
import { segmentCapsuleOverlap } from '@/core/geometry/capsule';

const LEFT = { x: 0, y: 0 };
const RIGHT = { x: 100, y: 0 };

describe('segment capsule overlap', () => {
  it('reports the exact chord a stationary eraser cuts out', () => {
    const covered = segmentCapsuleOverlap(LEFT, RIGHT, { x: 50, y: 0 }, { x: 50, y: 0 }, 10);

    expect(covered).not.toBeNull();
    expect(covered?.start).toBeCloseTo(0.4, 10);
    expect(covered?.end).toBeCloseTo(0.6, 10);
  });

  it('shortens the chord as the eraser moves off the line', () => {
    const covered = segmentCapsuleOverlap(LEFT, RIGHT, { x: 50, y: 6 }, { x: 50, y: 6 }, 10);

    expect(covered?.start).toBeCloseTo(0.42, 10);
    expect(covered?.end).toBeCloseTo(0.58, 10);
  });

  it('covers the span swept by a moving eraser', () => {
    const covered = segmentCapsuleOverlap(LEFT, RIGHT, { x: 30, y: 0 }, { x: 70, y: 0 }, 5);

    expect(covered?.start).toBeCloseTo(0.25, 10);
    expect(covered?.end).toBeCloseTo(0.75, 10);
  });

  it('reaches round the end caps of the swept capsule', () => {
    const covered = segmentCapsuleOverlap(LEFT, RIGHT, { x: 50, y: 8 }, { x: 50, y: 40 }, 10);

    expect(covered?.start).toBeCloseTo(0.44, 10);
    expect(covered?.end).toBeCloseTo(0.56, 10);
  });

  it('misses a segment that stays outside the capsule', () => {
    expect(segmentCapsuleOverlap(LEFT, RIGHT, { x: 50, y: 40 }, { x: 60, y: 40 }, 10)).toBeNull();
  });

  it('clamps to the segment when the capsule swallows it whole', () => {
    const covered = segmentCapsuleOverlap(LEFT, RIGHT, { x: -20, y: 0 }, { x: 120, y: 0 }, 10);

    expect(covered).toEqual({ start: 0, end: 1 });
  });

  it('trims only the leading part when the eraser sits on the start', () => {
    const covered = segmentCapsuleOverlap(LEFT, RIGHT, { x: 0, y: 0 }, { x: 0, y: 0 }, 20);

    expect(covered?.start).toBe(0);
    expect(covered?.end).toBeCloseTo(0.2, 10);
  });
});
