import type { SizeToken } from '@/types';

export const STROKE_SIZE_UNITS: Record<SizeToken, number> = { s: 2, m: 4, l: 8 };

export const FREEHAND_THINNING = 0.5;
export const FREEHAND_SMOOTHING = 0.5;

/** Streamlining is an input filter, so stored points stay the geometry that gets drawn. */
export const FREEHAND_STREAMLINE = 0;
export const POINTER_STREAMLINE = 0.5;
