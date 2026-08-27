import { describe, expect, it } from 'vitest';
import { createStroke, createText } from '@/core/element/element.factory';
import { pickText } from '@/core/text/text-pick';
import type { TextElement } from '@/types';

function textAt(x: number, y: number): TextElement {
  return createText({
    text: 'note',
    x,
    y,
    width: 100,
    height: 40,
    color: 'ink',
    size: 'm',
    font: 'sans',
    scale: 1,
  });
}

describe('pickText', () => {
  it('takes the text whose box holds the point', () => {
    const text = textAt(0, 0);

    expect(pickText([text], { x: 50, y: 20 })?.id).toBe(text.id);
  });

  it('takes the topmost of two that overlap', () => {
    const under = textAt(0, 0);
    const over = textAt(10, 10);

    expect(pickText([under, over], { x: 50, y: 20 })?.id).toBe(over.id);
  });

  it('ignores everything that is not text', () => {
    const stroke = createStroke(
      [
        [0, 0, 0.5],
        [100, 40, 0.5],
      ],
      'ink',
      'm',
    );

    expect(pickText([stroke], { x: 50, y: 20 })).toBeNull();
  });

  it('returns nothing on bare canvas', () => {
    expect(pickText([textAt(0, 0)], { x: 400, y: 400 })).toBeNull();
  });
});
