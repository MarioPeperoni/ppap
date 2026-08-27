import type { Point } from './geometry.types';

export type ColorToken = 'ink' | 'blue' | 'red' | 'green' | 'violet' | 'orange';

export type HexColor = `#${string}`;

export type StrokeColor = ColorToken | HexColor;

/** A named set of custom colours the bar adopts in one go. */
export interface SavedPalette {
  id: string;
  name: string;
  colors: HexColor[];
}

/** sRGB channels, 0..1. */
export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Lightness 0..1, chroma, hue in radians. */
export interface Oklch {
  l: number;
  c: number;
  h: number;
}

/** Hue in degrees, saturation and value 0..1. */
export interface Hsv {
  h: number;
  s: number;
  v: number;
}

/** The active ink and the one it swaps with. */
export interface ColorPair {
  color: StrokeColor;
  swapColor: StrokeColor | null;
}

/** A colour cue shown beside the cursor; the id replays it when the colour repeats. */
export interface ColorCue {
  id: number;
  at: Point;
  color: StrokeColor;
}
