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

export interface StrokeElement extends ElementBase {
  type: 'stroke';
  points: StrokePoint[];
  color: StrokeColor;
  size: SizeToken;
  nib: NibToken;
  scale: number;
}

export interface ImageElement extends ElementBase {
  type: 'image';
  assetId: string;
  mime: ImageMime;
  x: number;
  y: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

export interface TextElement extends ElementBase {
  type: 'text';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: StrokeColor;
  size: SizeToken;
  font: FontToken;
  scale: number;
}

export type Element = StrokeElement | ImageElement | TextElement;

export type ElementType = Element['type'];
