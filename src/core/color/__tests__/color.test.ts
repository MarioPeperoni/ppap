import { describe, expect, it } from 'vitest';
import { MIN_INK_CONTRAST } from '@/constants/color.constants';
import { LIGHT_PALETTE } from '@/constants/palette.constants';
import { hsvToRgb, rgbToHsv } from '@/core/color/hsv';
import { inkOn, readableOn } from '@/core/color/ink-contrast';
import { fitToGamut, oklchToRgb, rgbToOklch } from '@/core/color/oklch';
import { hexToRgb, isDisplayable, isHexColor, rgbToHex } from '@/core/color/srgb';
import { strokeColor } from '@/core/color/stroke-color';
import type { HexColor, Palette } from '@/types';

const DARK_CANVAS: HexColor = '#191919';
const SAMPLES: HexColor[] = ['#000000', '#ffffff', '#2563eb', '#dc2626', '#16a34a', '#facc15'];

function lightness(color: HexColor): number {
  return rgbToOklch(hexToRgb(color)).l;
}

describe('srgb', () => {
  it('accepts only a lowercase six digit hex', () => {
    expect(isHexColor('#7c3aed')).toBe(true);
    expect(isHexColor('#7C3AED')).toBe(false);
    expect(isHexColor('#fff')).toBe(false);
    expect(isHexColor('rgb(0,0,0)')).toBe(false);
    expect(isHexColor(17)).toBe(false);
  });

  it('survives the trip through channels', () => {
    for (const hex of SAMPLES) expect(rgbToHex(hexToRgb(hex))).toBe(hex);
  });

  it('clamps a channel that left the cube', () => {
    expect(rgbToHex({ r: 1.4, g: -0.2, b: 0.5 })).toBe('#ff0080');
    expect(isDisplayable({ r: 1.4, g: -0.2, b: 0.5 })).toBe(false);
    expect(isDisplayable({ r: 1, g: 0, b: 0.5 })).toBe(true);
  });
});

describe('oklch', () => {
  it('survives the trip through the perceptual space', () => {
    for (const hex of SAMPLES) expect(rgbToHex(oklchToRgb(rgbToOklch(hexToRgb(hex))))).toBe(hex);
  });

  it('keeps white and black at the ends of the lightness scale', () => {
    expect(lightness('#ffffff')).toBeCloseTo(1, 3);
    expect(lightness('#000000')).toBeCloseTo(0, 3);
  });

  it('drops chroma until an impossible colour fits the cube', () => {
    const impossible = { ...rgbToOklch(hexToRgb('#16a34a')), c: 0.5 };
    const fitted = fitToGamut(impossible);

    expect(isDisplayable(fitted)).toBe(true);
    expect(rgbToOklch(fitted).l).toBeCloseTo(impossible.l, 2);
  });
});

describe('hsv', () => {
  it('survives the trip through hue, saturation and value', () => {
    for (const hex of SAMPLES) expect(rgbToHex(hsvToRgb(rgbToHsv(hexToRgb(hex))))).toBe(hex);
  });

  it('reads a pure hue off the wheel', () => {
    expect(rgbToHsv(hexToRgb('#ff0000'))).toEqual({ h: 0, s: 1, v: 1 });
    expect(rgbToHsv(hexToRgb('#00ff00')).h).toBeCloseTo(120, 6);
    expect(rgbToHsv(hexToRgb('#0000ff')).h).toBeCloseTo(240, 6);
  });
});

describe('ink contrast', () => {
  it('leaves ink that already stands out alone', () => {
    expect(inkOn('#2563eb', LIGHT_PALETTE.canvas)).toBe('#2563eb');
    expect(inkOn('#facc15', DARK_CANVAS)).toBe('#facc15');
  });

  it('lifts ink that would sink into a dark canvas', () => {
    const lifted = inkOn('#1e3a8a', DARK_CANVAS);

    expect(lifted).not.toBe('#1e3a8a');
    expect(lightness(lifted) - lightness(DARK_CANVAS)).toBeCloseTo(MIN_INK_CONTRAST, 2);
  });

  it('darkens ink that would vanish on paper', () => {
    const darkened = inkOn('#facc15', LIGHT_PALETTE.canvas);

    expect(lightness(LIGHT_PALETTE.canvas) - lightness(darkened)).toBeCloseTo(MIN_INK_CONTRAST, 2);
  });

  it('keeps the hue it was given', () => {
    const before = rgbToOklch(hexToRgb('#1e3a8a'));
    const after = rgbToOklch(hexToRgb(inkOn('#1e3a8a', DARK_CANVAS)));

    expect(after.h).toBeCloseTo(before.h, 2);
  });
});

describe('stroke colour', () => {
  const darkPalette: Palette = { ...LIGHT_PALETTE, ink: '#ededed', canvas: DARK_CANVAS };

  it('reads a token from the palette of the moment', () => {
    expect(strokeColor('ink', LIGHT_PALETTE)).toBe(LIGHT_PALETTE.ink);
    expect(strokeColor('ink', darkPalette)).toBe('#ededed');
  });

  it('marks a pale colour dark and a deep one light', () => {
    expect(readableOn('#ffffff')).toBe(LIGHT_PALETTE.ink);
    expect(readableOn('#facc15')).toBe(LIGHT_PALETTE.ink);
    expect(readableOn('#000000')).toBe(LIGHT_PALETTE.canvas);
    expect(readableOn('#2563eb')).toBe(LIGHT_PALETTE.canvas);
  });

  it('adapts custom ink to the canvas under it', () => {
    expect(strokeColor('#1e3a8a', LIGHT_PALETTE)).toBe('#1e3a8a');
    expect(strokeColor('#1e3a8a', darkPalette)).not.toBe('#1e3a8a');
  });
});
