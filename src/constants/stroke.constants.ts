import type { NibToken, SizeToken } from '@/types';

export const STROKE_SIZE_UNITS: Record<SizeToken, number> = { s: 4, m: 8, l: 16, xl: 32 };

export const DEFAULT_STROKE_SCALE = 1;

export const NIB_TOKENS: readonly NibToken[] = ['pen', 'pencil'];
export const DEFAULT_NIB: NibToken = 'pen';

/** How far pressure narrows a stroke: the pencil holds one width, the pen tapers. */
export const NIB_THINNING: Record<NibToken, number> = { pen: 0.5, pencil: 0 };

/** The pressure that draws the picked width, so the pen lands mid-taper rather than at its top. */
export const NIB_WIDTH_PRESSURE = 0.25;

export const FREEHAND_SMOOTHING = 0.5;

/** Streamlining is an input filter, so stored points stay the geometry that gets drawn. */
export const FREEHAND_STREAMLINE = 0;
export const POINTER_STREAMLINE = 0.5;
