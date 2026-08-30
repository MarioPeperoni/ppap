import { describe, expect, it } from 'vitest';
import { elementBounds } from '@/core/element/element-bounds';
import { createImage, createStroke, createText } from '@/core/element/element.factory';

describe('element factory', () => {
  it('gives every element a unique id and a creation stamp', () => {
    const first = createStroke([[0, 0, 0.5]], 'ink', 'm');
    const second = createStroke([[0, 0, 0.5]], 'ink', 'm');

    expect(first.id).not.toBe(second.id);
    expect(first.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(first.createdAt).toBeGreaterThan(0);
    expect(first.type).toBe('stroke');
  });

  it('keeps the colour and size it was given', () => {
    const stroke = createStroke([[0, 0, 0.5]], 'red', 'l');

    expect(stroke.color).toBe('red');
    expect(stroke.size).toBe('l');
  });
});

describe('element bounds', () => {
  it('bounds an image by its placed rect', () => {
    const image = createImage({
      assetId: 'b'.repeat(64),
      mime: 'image/png',
      x: 10,
      y: 20,
      width: 200,
      height: 100,
      naturalWidth: 400,
      naturalHeight: 200,
    });

    expect(elementBounds(image)).toEqual({ minX: 10, minY: 20, maxX: 210, maxY: 120 });
  });

  it('bounds a text by the box it was measured into', () => {
    const text = createText({
      text: 'hello',
      x: 5,
      y: 15,
      width: 80,
      height: 30,
      color: 'ink',
      size: 'm',
      font: 'serif',
      scale: 1,
    });

    expect(elementBounds(text)).toEqual({ minX: 5, minY: 15, maxX: 85, maxY: 45 });
  });

  it('bounds a stroke through its cached stroke bounds', () => {
    const bounds = elementBounds(
      createStroke(
        [
          [0, 0, 0.5],
          [10, 10, 0.5],
        ],
        'ink',
        's',
      ),
    );

    expect(bounds.minX).toBeLessThan(0);
    expect(bounds.maxY).toBeGreaterThan(10);
  });
});
