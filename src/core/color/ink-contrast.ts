import { MIN_INK_CONTRAST } from '@/constants/color.constants';
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

/** Keeps a custom ink's hue but never lets it sink into the canvas it is drawn on. */
export function inkOn(ink: HexColor, canvas: HexColor): HexColor {
  const color = rgbToOklch(hexToRgb(ink));
  const lightness = legibleLightness(color.l, rgbToOklch(hexToRgb(canvas)).l);
  if (lightness === color.l) return ink;

  return rgbToHex(fitToGamut({ ...color, l: lightness }));
}
