import type { HexColor } from '@/types';

/** Above this OKLCh lightness a colour carries dark marks, below it light ones. */
export const READABLE_LIGHTNESS = 0.62;

/** How far a custom ink must sit from its canvas in lightness, matched to the built-in palette. */
export const MIN_INK_CONTRAST = 0.35;

export const GAMUT_TOLERANCE = 0.0001;
export const GAMUT_STEPS = 12;

/** Colours one palette holds, and how many palettes the library keeps. */
export const MAX_CUSTOM_COLORS = 5;
export const MAX_SAVED_PALETTES = 24;
export const MAX_PALETTE_NAME = 32;

export const CARRIED_PALETTE_ID = 'carried';

export const PICKER_START: HexColor = '#0ea5e9';
