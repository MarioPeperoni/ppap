import type { ColorToken, HexColor } from './color.types';

export type Theme = 'system' | 'light' | 'dark';

export type Palette = Record<ColorToken, HexColor> & {
  canvas: HexColor;
  dots: HexColor;
};

export type SelectionState = 'idle' | 'selected' | 'paired';
