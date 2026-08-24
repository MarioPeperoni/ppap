import { GAMUT_STEPS } from '@/constants/color.constants';
import { isDisplayable } from '@/core/color/srgb';
import type { Oklch, Rgb } from '@/types';

function toLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function toGamma(value: number): number {
  return value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;
}

export function rgbToOklch(rgb: Rgb): Oklch {
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);

  const long = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const medium = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const short = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const l = 0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short;
  const a = 1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short;
  const b2 = 0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short;

  return { l, c: Math.hypot(a, b2), h: Math.atan2(b2, a) };
}

export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const long = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const medium = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const short = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return {
    r: toGamma(4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short),
    g: toGamma(-1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short),
    b: toGamma(-0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short),
  };
}

/** Drops chroma until the colour fits sRGB, so lightness and hue survive the trip back. */
export function fitToGamut(color: Oklch): Rgb {
  const direct = oklchToRgb(color);
  if (isDisplayable(direct)) return direct;

  let fitting = 0;
  let excessive = color.c;
  for (let step = 0; step < GAMUT_STEPS; step += 1) {
    const middle = (fitting + excessive) / 2;
    if (isDisplayable(oklchToRgb({ ...color, c: middle }))) fitting = middle;
    else excessive = middle;
  }

  return oklchToRgb({ ...color, c: fitting });
}
