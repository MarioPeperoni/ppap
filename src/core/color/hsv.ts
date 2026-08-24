import type { Hsv, Rgb } from '@/types';

function hueOf({ r, g, b }: Rgb, max: number, span: number): number {
  if (span === 0) return 0;
  if (max === r) return (60 * ((g - b) / span) + 360) % 360;
  if (max === g) return 60 * ((b - r) / span) + 120;

  return 60 * ((r - g) / span) + 240;
}

export function rgbToHsv(rgb: Rgb): Hsv {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const span = max - Math.min(rgb.r, rgb.g, rgb.b);

  return { h: hueOf(rgb, max, span), s: max === 0 ? 0 : span / max, v: max };
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const channel = (offset: number): number => {
    const position = (offset + h / 60) % 6;

    return v - v * s * Math.max(0, Math.min(position, 4 - position, 1));
  };

  return { r: channel(5), g: channel(3), b: channel(1) };
}
