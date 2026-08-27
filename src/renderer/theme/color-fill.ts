import { isHexColor } from '@/core/color/srgb';
import type { StrokeColor } from '@/types';

/** The CSS paint for a stroke colour: a token follows the theme, a hex is itself. */
export function colorFill(color: StrokeColor): string {
  return isHexColor(color) ? color : `var(--color-${color})`;
}
