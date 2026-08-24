import { describe, expect, it } from 'vitest';
import { MAX_STROKE_FRAGMENTS } from '@/constants/fragment.constants';
import { createImage, createStroke } from '@/core/element/element.factory';
import { eraseSegment } from '@/core/erase/erase-stroke';
import type { EraseHit, StrokeElement, StrokePoint } from '@/types';

function line(from: number, to: number, step = 1, y = 0): StrokePoint[] {
  const points: StrokePoint[] = [];
  for (let x = from; x <= to; x += step) points.push([x, y, 0.5]);

  return points;
}

function fragmentsOf(hit: EraseHit | undefined): StrokeElement[] {
  return hit?.fragments ?? [];
}

function spanOf(fragment: StrokeElement | undefined): [number, number] {
  return [fragment?.points[0]?.[0] ?? NaN, fragment?.points.at(-1)?.[0] ?? NaN];
}

describe('erase stroke', () => {
  it('cuts exactly the ink the eraser covers, no more', () => {
    const stroke = createStroke(line(0, 100), 'ink', 'm');
    const fragments = fragmentsOf(eraseSegment([stroke], { x: 50, y: 0 }, { x: 50, y: 0 }, 5)[0]);

    expect(fragments).toHaveLength(2);
    expect(spanOf(fragments[0])[1]).toBeCloseTo(43, 6);
    expect(spanOf(fragments[1])[0]).toBeCloseTo(57, 6);
  });

  it('cuts a sparsely sampled stroke at the same place as a dense one', () => {
    const sparse = createStroke(
      [
        [0, 0, 0.5],
        [100, 0, 0.5],
      ],
      'ink',
      'm',
    );
    const fragments = fragmentsOf(eraseSegment([sparse], { x: 50, y: 0 }, { x: 50, y: 0 }, 5)[0]);

    expect(fragments).toHaveLength(2);
    expect(spanOf(fragments[0])[1]).toBeCloseTo(43, 6);
    expect(spanOf(fragments[1])[0]).toBeCloseTo(57, 6);
  });

  it('widens the cut by half the stroke width so the circle clears its own area', () => {
    const thin = createStroke(line(0, 100), 'ink', 's');
    const thick = createStroke(line(0, 100), 'ink', 'l');
    const at = { x: 50, y: 0 };

    expect(spanOf(fragmentsOf(eraseSegment([thin], at, at, 5)[0])[0])[1]).toBeCloseTo(44, 6);
    expect(spanOf(fragmentsOf(eraseSegment([thick], at, at, 5)[0])[0])[1]).toBeCloseTo(41, 6);
  });

  it('follows the swept path between two pointer samples', () => {
    const stroke = createStroke(line(0, 100), 'ink', 'm');
    const fragments = fragmentsOf(eraseSegment([stroke], { x: 30, y: 0 }, { x: 70, y: 0 }, 5)[0]);

    expect(fragments).toHaveLength(2);
    expect(spanOf(fragments[0])[1]).toBeCloseTo(23, 6);
    expect(spanOf(fragments[1])[0]).toBeCloseTo(77, 6);
  });

  it('trims a stroke touched at one end', () => {
    const stroke = createStroke(line(0, 100), 'ink', 'm');
    const fragments = fragmentsOf(eraseSegment([stroke], { x: 0, y: 0 }, { x: 0, y: 0 }, 10)[0]);

    expect(fragments).toHaveLength(1);
    expect(spanOf(fragments[0])).toEqual([expect.closeTo(12, 6), 100]);
  });

  it('keeps the ink outside a long erase drag', () => {
    const stroke = createStroke(line(0, 30, 10), 'ink', 'm');
    const fragments = fragmentsOf(eraseSegment([stroke], { x: 10, y: 0 }, { x: 30, y: 0 }, 4)[0]);

    expect(fragments).toHaveLength(1);
    expect(spanOf(fragments[0])).toEqual([0, expect.closeTo(4, 6)]);
  });

  it('drops a surviving sliver shorter than a board unit', () => {
    const stroke = createStroke(
      [
        [0, 0, 0.5],
        [100, 0, 0.5],
      ],
      'ink',
      's',
    );
    const fragments = fragmentsOf(
      eraseSegment([stroke], { x: 2.4, y: 0 }, { x: 2.4, y: 0 }, 0.5)[0],
    );

    expect(fragments).toHaveLength(1);
    expect(spanOf(fragments[0])[0]).toBeCloseTo(3.9, 6);
  });

  it('removes a stroke covered end to end', () => {
    const stroke = createStroke(line(0, 20), 'ink', 'm');
    const hits = eraseSegment([stroke], { x: 0, y: 0 }, { x: 20, y: 0 }, 5);

    expect(hits).toHaveLength(1);
    expect(fragmentsOf(hits[0])).toHaveLength(0);
  });

  it('removes a single-point dot under the eraser', () => {
    const dot = createStroke([[10, 10, 0.5]], 'ink', 'm');

    expect(fragmentsOf(eraseSegment([dot], { x: 10, y: 10 }, { x: 10, y: 10 }, 4)[0])).toHaveLength(
      0,
    );
    expect(eraseSegment([dot], { x: 40, y: 10 }, { x: 40, y: 10 }, 4)).toHaveLength(0);
  });

  it('leaves untouched strokes out of the result', () => {
    const stroke = createStroke(line(0, 100), 'ink', 'm');

    expect(eraseSegment([stroke], { x: 50, y: 400 }, { x: 60, y: 400 }, 5)).toHaveLength(0);
  });

  it('gives fragments the colour and size of their source', () => {
    const stroke = createStroke(line(0, 100), 'red', 'l');
    const fragments = fragmentsOf(eraseSegment([stroke], { x: 50, y: 0 }, { x: 50, y: 0 }, 4)[0]);

    expect(fragments).toHaveLength(2);
    for (const fragment of fragments) {
      expect(fragment.color).toBe('red');
      expect(fragment.size).toBe('l');
    }
  });

  it('removes a stroke outright past the fragment cap', () => {
    const points: StrokePoint[] = [];
    for (let index = 0; index < MAX_STROKE_FRAGMENTS + 4; index += 1) {
      points.push([index * 40, 60, 0.5], [index * 40 + 20, 60, 0.5], [index * 40 + 30, 0, 0.5]);
    }
    const stroke = createStroke(points, 'ink', 'm');
    const hits = eraseSegment([stroke], { x: 0, y: 0 }, { x: points.length * 40, y: 0 }, 2);

    expect(hits).toHaveLength(1);
    expect(fragmentsOf(hits[0])).toHaveLength(0);
  });

  it('removes an image when the eraser centre enters it', () => {
    const image = createImage({
      assetId: 'a'.repeat(64),
      mime: 'image/png',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      naturalWidth: 100,
      naturalHeight: 100,
    });

    expect(eraseSegment([image], { x: 50, y: 50 }, { x: 50, y: 50 }, 4)).toHaveLength(1);
    expect(eraseSegment([image], { x: -20, y: 50 }, { x: -12, y: 50 }, 4)).toHaveLength(0);
  });
});
