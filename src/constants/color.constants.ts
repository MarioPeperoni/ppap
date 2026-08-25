import type { HexColor } from '@/types';

/** How far a custom ink must sit from its canvas in lightness, matched to the built-in palette. */
export const MIN_INK_CONTRAST = 0.35;

export const GAMUT_TOLERANCE = 0.0001;
export const GAMUT_STEPS = 12;

export const MAX_CUSTOM_COLORS = 4;

export const PICKER_START: HexColor = '#7c3aed';
