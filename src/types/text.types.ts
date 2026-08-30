import type { StrokeColor } from './color.types';
import type { FontToken, SizeToken } from './element.types';

/** The text being typed; the id is an element's when editing one, a fresh key when placing. */
export interface TextDraft {
  id: string;
  x: number;
  y: number;
  text: string;
  color: StrokeColor;
  size: SizeToken;
  font: FontToken;
  scale: number;
}

/** Measured with the font the canvas draws, so the editor and the element share one box. */
export interface TextLayout {
  lines: readonly string[];
  width: number;
  height: number;
  lineHeight: number;
  baseline: number;
}
