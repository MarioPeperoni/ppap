import type { ColorToken } from './element.types';

export type Theme = 'system' | 'light' | 'dark';

export type Palette = Record<ColorToken, string> & {
  canvas: string;
  dots: string;
};
