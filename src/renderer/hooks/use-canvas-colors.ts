import { useThemeStore } from '@/renderer/stores/theme.store';
import { cssPalette } from '@/renderer/theme/css-palette';
import type { Palette } from '@/types';

export function useCanvasColors(): Palette {
  useThemeStore((state) => state.theme);

  return cssPalette.read();
}
