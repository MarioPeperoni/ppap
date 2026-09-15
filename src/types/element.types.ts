import type { ImageMime } from './asset.types';
import type { StrokeColor } from './color.types';

export type SizeToken = 's' | 'm' | 'l' | 'xl';

export type NibToken = 'pen' | 'pencil';

export type FontToken = 'sans' | 'serif' | 'mono' | 'hand';

export type StrokePoint = [x: number, y: number, pressure: number];

export interface ElementBase {
  id: string;
  createdAt: number;
}

/** A rect placed on the board, turned clockwise by `rotation` radians about its own centre. */
export interface PlacedElement extends ElementBase {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface StrokeElement extends ElementBase {
  type: 'stroke';
  points: StrokePoint[];
  color: StrokeColor;
  size: SizeToken;
  nib: NibToken;
  scale: number;
}

export interface ImageElement extends PlacedElement {
  type: 'image';
  assetId: string;
  mime: ImageMime;
  naturalWidth: number;
  naturalHeight: number;
}

export interface TextElement extends PlacedElement {
  type: 'text';
  text: string;
  color: StrokeColor;
  size: SizeToken;
  font: FontToken;
  scale: number;
}

export type Element = StrokeElement | ImageElement | TextElement;

export type ElementType = Element['type'];
