import { readableOn } from '@/core/color/ink-contrast';
import { isHexColor } from '@/core/color/srgb';
import type { StrokeColor } from '@/types';

/** The CSS paint for a stroke colour: a token follows the theme, a hex is itself. */
export function colorFill(color: StrokeColor): string {
  return isHexColor(color) ? color : `var(--color-${color})`;
}

/** The CSS paint for a mark drawn on a stroke colour: a token is an ink, so the canvas reads on it. */
export function markFill(color: StrokeColor): string {
  return isHexColor(color) ? readableOn(color) : 'var(--color-canvas)';
}
