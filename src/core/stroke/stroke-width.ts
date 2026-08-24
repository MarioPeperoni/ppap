import { STROKE_SIZE_UNITS } from '@/constants/stroke.constants';
import type { SizeToken } from '@/types';

export function strokeWidth(size: SizeToken, scale: number): number {
  return STROKE_SIZE_UNITS[size] * scale;
}
