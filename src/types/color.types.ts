export type ColorToken = 'ink' | 'blue' | 'red' | 'green';

export type HexColor = `#${string}`;

export type StrokeColor = ColorToken | HexColor;

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
