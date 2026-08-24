import { describe, expect, it } from 'vitest';
import { STROKE_SIZE_UNITS } from '@/constants/stroke.constants';
import { createStroke } from '@/core/element/element.factory';
import { strokeBounds } from '@/core/stroke/stroke-bounds';
import { hasRealPressure, outlineForPoints, strokeOutline } from '@/core/stroke/stroke-outline';

describe('stroke outline', () => {
  it('caches the outline of an unchanged stroke', () => {
    const stroke = createStroke(
      [
        [0, 0, 0.5],
        [10, 10, 0.6],
        [20, 0, 0.4],
      ],
      'ink',
      'm',
    );

    expect(strokeOutline(stroke)).toBe(strokeOutline(stroke));
    expect(strokeOutline(stroke).length).toBeGreaterThan(0);
  });

  it('detects devices that report no real pressure', () => {
    expect(
      hasRealPressure([
        [0, 0, 0.5],
        [1, 0, 0.5],
      ]),
    ).toBe(false);
    expect(
      hasRealPressure([
        [0, 0, 0.5],
        [1, 0, 0.9],
      ]),
    ).toBe(true);
    expect(hasRealPressure([])).toBe(false);
  });

  it('produces a closed outline for a single point', () => {
    expect(outlineForPoints([[5, 5, 0.5]], 's').length).toBeGreaterThan(2);
  });
});

describe('stroke bounds', () => {
  it('wraps the points, widened by the stroke size', () => {
    const bounds = strokeBounds(
      createStroke(
        [
          [0, 0, 0.5],
          [100, 50, 0.5],
        ],
        'ink',
        'l',
      ),
    );

    expect(bounds.minX).toBe(-STROKE_SIZE_UNITS.l);
    expect(bounds.maxX).toBe(100 + STROKE_SIZE_UNITS.l);
    expect(bounds.maxY).toBe(50 + STROKE_SIZE_UNITS.l);
  });
});
