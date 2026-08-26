import { paletteOf } from '@/core/color/palettes';
import { usePaletteStore } from '@/renderer/stores/palette.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import type { SavedPalette } from '@/types';

/** The palette the pen carries, or nothing when it was dropped from the library. */
export function useActivePalette(): SavedPalette | null {
  const activePaletteId = useToolStore((state) => state.activePaletteId);

  return usePaletteStore((state) => paletteOf(state.palettes, activePaletteId));
}
