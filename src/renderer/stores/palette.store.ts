import { create } from 'zustand';
import {
  MAX_CUSTOM_COLORS,
  MAX_PALETTE_NAME,
  MAX_SAVED_PALETTES,
} from '@/constants/color.constants';
import { paletteWith, paletteWithout, renamed, replaced } from '@/core/color/palettes';
import type { HexColor, SavedPalette, Settings } from '@/types';

interface PaletteStore {
  palettes: SavedPalette[];
  adopt: (settings: Settings) => void;
  createPalette: () => SavedPalette | null;
  renamePalette: (id: string, name: string) => void;
  addColor: (id: string, color: HexColor) => void;
  removeColor: (id: string, color: HexColor) => void;
  deletePalette: (id: string) => void;
}

function edited(
  palettes: SavedPalette[],
  id: string,
  edit: (palette: SavedPalette) => SavedPalette,
): SavedPalette[] {
  const palette = palettes.find((kept) => kept.id === id);
  if (palette === undefined) return palettes;

  return replaced(palettes, edit(palette));
}

export const usePaletteStore = create<PaletteStore>()((set, get) => ({
  palettes: [],

  adopt: ({ savedPalettes }) => {
    set({ palettes: savedPalettes });
  },

  createPalette: () => {
    const { palettes } = get();
    if (palettes.length >= MAX_SAVED_PALETTES) return null;

    const palette: SavedPalette = {
      id: crypto.randomUUID(),
      name: `Palette ${palettes.length + 1}`,
      colors: [],
    };

    set({ palettes: [...palettes, palette] });

    return palette;
  },

  renamePalette: (id, name) => {
    set({ palettes: edited(get().palettes, id, (p) => renamed(p, name, MAX_PALETTE_NAME)) });
  },

  addColor: (id, color) => {
    set({ palettes: edited(get().palettes, id, (p) => paletteWith(p, color, MAX_CUSTOM_COLORS)) });
  },

  removeColor: (id, color) => {
    set({ palettes: edited(get().palettes, id, (p) => paletteWithout(p, color)) });
  },

  deletePalette: (id) => {
    set({ palettes: get().palettes.filter((kept) => kept.id !== id) });
  },
}));
