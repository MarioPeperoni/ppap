import { describe, expect, it } from 'vitest';
import { boundsOfElements, elementBounds } from '@/core/element/element-bounds';
import { createImage, createStroke } from '@/core/element/element.factory';
import { boundsCorners } from '@/core/geometry/bounds';
import { pickElement } from '@/core/select/select-pick';
import { selectInShape } from '@/core/select/select-region';
import { scaleElement, translateElement } from '@/core/select/select-transform';
import { polygonShape } from '@/core/select/selection-shape';
import { strokeWidth } from '@/core/stroke/stroke-width';
import type { Bounds, Element, Point, SelectionResult, StrokeElement, StrokePoint } from '@/types';

const SQUARE: Point[] = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];

function line(from: number, to: number, y: number): StrokePoint[] {
  const points: StrokePoint[] = [];
  for (let x = from; x <= to; x += 10) points.push([x, y, 0.5]);

  return points;
}

function image(x: number, y: number): Element {
  return createImage({
    assetId: 'asset',
    mime: 'image/png',
    x,
    y,
    width: 40,
    height: 40,
    naturalWidth: 40,
    naturalHeight: 40,
  });
}

function rectShape(rect: Bounds) {
  return polygonShape(boundsCorners(rect));
}

function fragments(result: SelectionResult): StrokeElement[] {
  return result.patch.added.map(({ element }) => element as StrokeElement);
}

function spanOf(fragment: StrokeElement | undefined): [number, number] {
  return [fragment?.points[0]?.[0] ?? NaN, fragment?.points.at(-1)?.[0] ?? NaN];
}

function selectedFragment(result: SelectionResult): StrokeElement | undefined {
  return fragments(result).find((element) => element.id === result.ids[0]);
}

function aspect(bounds: Bounds): number {
  return (bounds.maxX - bounds.minX) / (bounds.maxY - bounds.minY);
}

describe('selection region', () => {
  it('takes exactly the span of a stroke the marquee covers', () => {
    const stroke = createStroke(line(0, 100, 0), 'ink', 'm');
    const result = selectInShape([stroke], rectShape({ minX: 45, minY: -20, maxX: 65, maxY: 20 }));

    expect(result.patch.removed).toEqual([stroke.id]);
    expect(result.ids).toHaveLength(1);
    expect(spanOf(selectedFragment(result))).toEqual([45, 65]);
  });

  it('leaves the rest of the cut stroke behind, unselected and abutting', () => {
    const stroke = createStroke(line(0, 100, 0), 'ink', 'm');
    const result = selectInShape([stroke], rectShape({ minX: 45, minY: -20, maxX: 65, maxY: 20 }));
    const [head, covered, tail] = fragments(result);

    expect(result.patch.added).toHaveLength(3);
    expect(spanOf(head)).toEqual([0, 45]);
    expect(spanOf(covered)).toEqual([45, 65]);
    expect(spanOf(tail)).toEqual([65, 100]);
    expect(result.ids).toEqual([covered?.id]);
  });

  it('cuts at the sample point when the boundary runs through one', () => {
    const stroke = createStroke(line(-50, 150, 50), 'ink', 'm');
    const result = selectInShape([stroke], polygonShape(SQUARE));

    expect(spanOf(selectedFragment(result))).toEqual([0, 100]);
  });

  it('takes a stroke whole when the shape holds all of it', () => {
    const stroke = createStroke(line(20, 80, 50), 'ink', 'm');
    const result = selectInShape([stroke], polygonShape(SQUARE));

    expect(result.ids).toEqual([stroke.id]);
    expect(result.patch.added).toEqual([]);
    expect(result.patch.removed).toEqual([]);
  });

  it('ignores a stroke the shape never reaches', () => {
    const stroke = createStroke(line(300, 400, 50), 'ink', 'm');
    const result = selectInShape([stroke], polygonShape(SQUARE));

    expect(result.ids).toEqual([]);
    expect(result.patch.added).toEqual([]);
  });

  it('takes every covered span when a stroke enters the shape twice', () => {
    const zigzag = createStroke(
      [
        [50, 50, 0.5],
        [50, 200, 0.5],
        [70, 200, 0.5],
        [70, 50, 0.5],
      ],
      'ink',
      'm',
    );
    const result = selectInShape([zigzag], polygonShape(SQUARE));

    expect(result.ids).toHaveLength(2);
  });

  it('takes an image when the shape holds the centre of its box', () => {
    const held = image(40, 40);
    const grazing = image(90, 40);
    const result = selectInShape([held, grazing], polygonShape(SQUARE));

    expect(result.ids).toEqual([held.id]);
  });

  it('keeps the z-order of the scene in the selected ids', () => {
    const first = createStroke(line(0, 10, 10), 'ink', 'm');
    const second = createStroke(line(0, 10, 20), 'ink', 'm');
    const result = selectInShape([first, second], polygonShape(SQUARE));

    expect(result.ids).toEqual([first.id, second.id]);
  });
});

describe('selection pick', () => {
  it('takes the stroke under the point', () => {
    const stroke = createStroke(line(0, 100, 0), 'ink', 'm');

    expect(pickElement([stroke], { x: 50, y: 1 }, 2)).toBe(stroke.id);
  });

  it('takes nothing from bare canvas inside the bounding box', () => {
    const stroke = createStroke(
      [
        [0, 0, 0.5],
        [100, 100, 0.5],
      ],
      'ink',
      'm',
    );

    expect(pickElement([stroke], { x: 90, y: 10 }, 2)).toBeNull();
  });

  it('takes the topmost of two overlapping strokes', () => {
    const under = createStroke(line(0, 100, 0), 'ink', 'm');
    const over = createStroke(line(0, 100, 0), 'red', 'm');

    expect(pickElement([under, over], { x: 50, y: 0 }, 2)).toBe(over.id);
  });
});

describe('selection transform', () => {
  it('moves every point by the same delta', () => {
    const stroke = createStroke(line(0, 100, 0), 'ink', 'm');
    const moved = translateElement(stroke, 10, -5) as StrokeElement;

    expect(moved.points[0]).toEqual([0 + 10, 0 - 5, 0.5]);
    expect(moved.points.at(-1)).toEqual([100 + 10, 0 - 5, 0.5]);
    expect(moved.id).toBe(stroke.id);
  });

  it('scales uniformly about the anchor and keeps the aspect ratio', () => {
    const elements: Element[] = [
      createStroke(line(0, 100, 0), 'ink', 'm'),
      createStroke(line(0, 100, 50), 'ink', 'm'),
    ];
    const anchor: Point = { x: 0, y: 0 };
    const before = boundsOfElements(elements)!;
    const scaled = elements.map((element) => scaleElement(element, anchor, 2));
    const after = boundsOfElements(scaled)!;

    expect(aspect(after)).toBeCloseTo(aspect(before), 6);
    expect(elementBounds(scaled[1]!).minY).toBeCloseTo(2 * elementBounds(elements[1]!).minY, 6);
  });

  it('scales stroke width with the selection', () => {
    const stroke = createStroke(line(0, 100, 0), 'ink', 'm');
    const scaled = scaleElement(stroke, { x: 0, y: 0 }, 3) as StrokeElement;

    expect(strokeWidth(scaled.size, scaled.scale, scaled.nib)).toBeCloseTo(
      strokeWidth(stroke.size, stroke.scale, stroke.nib) * 3,
      6,
    );
  });

  it('returns to the original geometry when scaled back', () => {
    const stroke = createStroke(line(0, 100, 0), 'ink', 'm');
    const anchor: Point = { x: 20, y: 20 };
    const restored = scaleElement(scaleElement(stroke, anchor, 4), anchor, 1 / 4) as StrokeElement;

    expect(restored.points.at(-1)?.[0]).toBeCloseTo(100, 6);
    expect(restored.scale).toBeCloseTo(stroke.scale, 6);
  });
});
