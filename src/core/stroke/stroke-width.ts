import { NIB_THINNING, NIB_WIDTH_PRESSURE, STROKE_SIZE_UNITS } from '@/constants/stroke.constants';
import type { NibToken, SizeToken } from '@/types';

function nibWidthScale(nib: NibToken): number {
  return 1 / (1 - NIB_THINNING[nib] * (1 - 2 * NIB_WIDTH_PRESSURE));
}

export function strokeWidth(size: SizeToken, scale: number, nib: NibToken): number {
  return STROKE_SIZE_UNITS[size] * scale * nibWidthScale(nib);
}
