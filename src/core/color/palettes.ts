import type { HexColor, SavedPalette } from '@/types';

export function paletteOf(
  palettes: readonly SavedPalette[],
  id: string | null,
): SavedPalette | null {
  return palettes.find((palette) => palette.id === id) ?? null;
}

/** A palette takes a colour it does not hold, until it runs out of room. */
export function paletteWith(palette: SavedPalette, color: HexColor, limit: number): SavedPalette {
  if (palette.colors.includes(color) || palette.colors.length >= limit) return palette;

  return { ...palette, colors: [...palette.colors, color] };
}

export function paletteWithout(palette: SavedPalette, color: HexColor): SavedPalette {
  return { ...palette, colors: palette.colors.filter((kept) => kept !== color) };
}

export function renamed(palette: SavedPalette, name: string, limit: number): SavedPalette {
  return { ...palette, name: name.trim().slice(0, limit) };
}

export function replaced(palettes: readonly SavedPalette[], palette: SavedPalette): SavedPalette[] {
  return palettes.map((kept) => (kept.id === palette.id ? palette : kept));
}
