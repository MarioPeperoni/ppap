import { MIN_INK_CONTRAST, READABLE_LIGHTNESS } from '@/constants/color.constants';
import { LIGHT_PALETTE } from '@/constants/palette.constants';
import { fitToGamut, rgbToOklch } from '@/core/color/oklch';
import { hexToRgb, rgbToHex } from '@/core/color/srgb';
import type { HexColor } from '@/types';

function legibleLightness(ink: number, ground: number): number {
  const lighter = ground + MIN_INK_CONTRAST;
  const darker = ground - MIN_INK_CONTRAST;

  if (ink >= lighter || ink <= darker) return ink;
  if (darker < 0) return lighter;
  if (lighter > 1) return darker;

  return ink >= ground ? lighter : darker;
}

/** The mark a colour can carry on top of itself and still be read. */
export function readableOn(color: HexColor): HexColor {
  const { l } = rgbToOklch(hexToRgb(color));

  return l > READABLE_LIGHTNESS ? LIGHT_PALETTE.ink : LIGHT_PALETTE.canvas;
}

/** Keeps a custom ink's hue but never lets it sink into the canvas it is drawn on. */
export function inkOn(ink: HexColor, canvas: HexColor): HexColor {
  const color = rgbToOklch(hexToRgb(ink));
  const lightness = legibleLightness(color.l, rgbToOklch(hexToRgb(canvas)).l);
  if (lightness === color.l) return ink;

  return rgbToHex(fitToGamut({ ...color, l: lightness }));
}
