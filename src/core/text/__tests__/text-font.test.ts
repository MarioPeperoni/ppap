import { describe, expect, it } from 'vitest';
import { TEXT_SIZE_UNITS } from '@/constants/text.constants';
import { cssFont, fontSize, lineHeight, minWidth, textLines } from '@/core/text/text-font';

describe('text font', () => {
  it('grows the face with the scale a resize left behind', () => {
    expect(fontSize('m', 1)).toBe(TEXT_SIZE_UNITS.m);
    expect(fontSize('m', 2)).toBe(TEXT_SIZE_UNITS.m * 2);
  });

  it('names the size and the family the canvas draws with', () => {
    expect(cssFont('l', 1, 'mono')).toBe(
      `${TEXT_SIZE_UNITS.l}px ui-monospace, Menlo, Consolas, "Courier New", monospace`,
    );
  });

  it('keeps the line height above the face', () => {
    expect(lineHeight('s', 1)).toBeGreaterThan(fontSize('s', 1));
  });

  it('holds an empty box wide enough to click back into', () => {
    expect(minWidth('s', 1)).toBeGreaterThan(0);
  });
});

describe('text lines', () => {
  it('splits on newlines and keeps the empty ones', () => {
    expect(textLines('one\n\ntwo')).toEqual(['one', '', 'two']);
  });

  it('reads an empty body as a single line', () => {
    expect(textLines('')).toEqual(['']);
  });
});
