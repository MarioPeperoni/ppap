import { describe, expect, it } from 'vitest';
import { paletteOf, paletteWith, paletteWithout, renamed, replaced } from '@/core/color/palettes';
import type { SavedPalette } from '@/types';

const PALETTE: SavedPalette = { id: 'a', name: 'Sketch', colors: ['#111111', '#222222'] };

describe('a palette', () => {
  it('takes a colour it does not hold', () => {
    expect(paletteWith(PALETTE, '#333333', 6).colors).toEqual([...PALETTE.colors, '#333333']);
  });

  it('takes a colour only once', () => {
    expect(paletteWith(PALETTE, '#111111', 6)).toBe(PALETTE);
  });

  it('takes nothing once it is full', () => {
    expect(paletteWith(PALETTE, '#333333', 2)).toBe(PALETTE);
  });

  it('drops a colour it holds', () => {
    expect(paletteWithout(PALETTE, '#111111').colors).toEqual(['#222222']);
  });

  it('takes a name without its padding, cut to the limit', () => {
    expect(renamed(PALETTE, '  Warm greys  ', 32).name).toBe('Warm greys');
    expect(renamed(PALETTE, 'Warm greys', 4).name).toBe('Warm');
  });
});

describe('a library of palettes', () => {
  it('finds the palette an id names, and nothing for a stray one', () => {
    expect(paletteOf([PALETTE], 'a')).toBe(PALETTE);
    expect(paletteOf([PALETTE], 'ghost')).toBeNull();
    expect(paletteOf([PALETTE], null)).toBeNull();
  });

  it('swaps in the palette that carries the same id', () => {
    const other: SavedPalette = { id: 'b', name: 'Ink', colors: [] };
    const edited: SavedPalette = { ...PALETTE, name: 'Sketchbook' };

    expect(replaced([PALETTE, other], edited)).toEqual([edited, other]);
  });
});
