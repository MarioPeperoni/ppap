import { inkOn } from '@/core/color/ink-contrast';
import { isHexColor } from '@/core/color/srgb';
import type { HexColor, Palette, StrokeColor } from '@/types';

const adapted = new Map<string, HexColor>();

export function strokeColor(color: StrokeColor, colors: Palette): HexColor {
  if (!isHexColor(color)) return colors[color];

  const key = `${color}${colors.canvas}`;
  const cached = adapted.get(key);
  if (cached !== undefined) return cached;

  const ink = inkOn(color, colors.canvas);
  adapted.set(key, ink);

  return ink;
}
