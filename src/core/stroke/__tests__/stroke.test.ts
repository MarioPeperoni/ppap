import { describe, expect, it } from 'vitest';
import {
  DEFAULT_NIB,
  DEFAULT_STROKE_SCALE,
  NIB_THINNING,
  NIB_TOKENS,
  NIB_WIDTH_PRESSURE,
  STROKE_SIZE_UNITS,
} from '@/constants/stroke.constants';
import { createStroke } from '@/core/element/element.factory';
import { strokeBounds } from '@/core/stroke/stroke-bounds';
import { hasRealPressure, outlineForPoints, strokeOutline } from '@/core/stroke/stroke-outline';
import { strokeWidth } from '@/core/stroke/stroke-width';
import type { NibToken, StrokePoint } from '@/types';

const RISING: StrokePoint[] = [
  [0, 0, 0.2],
  [10, 0, 0.5],
  [20, 0, 0.9],
];

const FALLING: StrokePoint[] = [
  [0, 0, 0.9],
  [10, 0, 0.5],
  [20, 0, 0.2],
];

/** What `perfect-freehand` draws for a nib at a given pressure. */
function widthAtPressure(nib: NibToken, pressure: number): number {
  const base = strokeWidth('m', DEFAULT_STROKE_SCALE, nib);

  return 2 * base * (0.5 - NIB_THINNING[nib] * (0.5 - pressure));
}

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

  it('holds one pencil width whatever the pressure', () => {
    expect(outlineForPoints(RISING, STROKE_SIZE_UNITS.m, 'pencil')).toEqual(
      outlineForPoints(FALLING, STROKE_SIZE_UNITS.m, 'pencil'),
    );
  });

  it('narrows the pen where pressure drops', () => {
    expect(outlineForPoints(RISING, STROKE_SIZE_UNITS.m, 'pen')).not.toEqual(
      outlineForPoints(FALLING, STROKE_SIZE_UNITS.m, 'pen'),
    );
  });

  it('produces a closed outline for a single point', () => {
    expect(
      outlineForPoints([[5, 5, 0.5]], STROKE_SIZE_UNITS.s, DEFAULT_NIB).length,
    ).toBeGreaterThan(2);
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

    const width = strokeWidth('l', DEFAULT_STROKE_SCALE, DEFAULT_NIB);

    expect(bounds.minX).toBe(-width);
    expect(bounds.maxX).toBe(100 + width);
    expect(bounds.maxY).toBe(50 + width);
  });
});

describe('stroke width', () => {
  it('draws the picked width at every nib', () => {
    for (const nib of NIB_TOKENS) {
      expect(widthAtPressure(nib, NIB_WIDTH_PRESSURE)).toBeCloseTo(STROKE_SIZE_UNITS.m, 6);
    }
  });

  it('keeps the picked width in the middle of the pen taper', () => {
    const thin = widthAtPressure('pen', 0);
    const thick = widthAtPressure('pen', 2 * NIB_WIDTH_PRESSURE);

    expect((thin + thick) / 2).toBeCloseTo(STROKE_SIZE_UNITS.m, 6);
  });
});
