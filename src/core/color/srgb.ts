import { GAMUT_TOLERANCE } from '@/constants/color.constants';
import type { HexColor, Rgb } from '@/types';

const HEX_COLOR = /^#[0-9a-f]{6}$/;
const CHANNEL_STARTS = [1, 3, 5];

function clamped(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function toByte(value: number): string {
  return Math.round(clamped(value) * 255)
    .toString(16)
    .padStart(2, '0');
}

export function isHexColor(value: unknown): value is HexColor {
  return typeof value === 'string' && HEX_COLOR.test(value);
}

export function hexToRgb(hex: HexColor): Rgb {
  const [r = 0, g = 0, b = 0] = CHANNEL_STARTS.map(
    (start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255,
  );

  return { r, g, b };
}

export function rgbToHex({ r, g, b }: Rgb): HexColor {
  return `#${toByte(r)}${toByte(g)}${toByte(b)}`;
}

export function isDisplayable({ r, g, b }: Rgb): boolean {
  return [r, g, b].every((value) => value >= -GAMUT_TOLERANCE && value <= 1 + GAMUT_TOLERANCE);
}
