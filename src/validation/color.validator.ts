import { MAX_CUSTOM_COLORS } from '@/constants/color.constants';
import { TOOL_COLORS } from '@/constants/tool.constants';
import { isHexColor } from '@/core/color/srgb';
import type { HexColor, StrokeColor } from '@/types';
import { expectArray, expectOneOf } from '@/validation/primitive.validator';

export function parseHexColor(value: unknown, label: string): HexColor {
  if (!isHexColor(value)) throw new Error(`${label} must be a #rrggbb colour`);

  return value;
}

export function parseStrokeColor(value: unknown, label: string): StrokeColor {
  return isHexColor(value) ? value : expectOneOf(value, TOOL_COLORS, label);
}

export function parseCustomColors(value: unknown, label: string): HexColor[] {
  const colors = expectArray(value, label);
  if (colors.length > MAX_CUSTOM_COLORS)
    throw new Error(`${label} holds more than ${MAX_CUSTOM_COLORS} colours`);

  return colors.map((color) => parseHexColor(color, label));
}
