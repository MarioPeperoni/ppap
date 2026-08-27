import {
  MAX_CUSTOM_COLORS,
  MAX_PALETTE_NAME,
  MAX_SAVED_PALETTES,
} from '@/constants/color.constants';
import type { SavedPalette } from '@/types';
import { parseHexColor } from '@/validation/color.validator';
import { expectArray, expectRecord, expectString } from '@/validation/primitive.validator';

function parsePalette(value: unknown, label: string): SavedPalette {
  const source = expectRecord(value, label);
  const colors = expectArray(source.colors, label);
  if (colors.length > MAX_CUSTOM_COLORS)
    throw new Error(`${label} holds more than ${MAX_CUSTOM_COLORS} colours`);

  return {
    id: expectString(source.id, label),
    name: expectString(source.name, label).slice(0, MAX_PALETTE_NAME),
    colors: colors.map((color) => parseHexColor(color, label)),
  };
}

export function parsePaletteId(value: unknown, label: string): string | null {
  return value === null ? null : expectString(value, label);
}

export function parseSavedPalettes(value: unknown, label: string): SavedPalette[] {
  const palettes = expectArray(value, label);
  if (palettes.length > MAX_SAVED_PALETTES)
    throw new Error(`${label} holds more than ${MAX_SAVED_PALETTES} palettes`);

  return palettes.map((palette) => parsePalette(palette, label));
}
