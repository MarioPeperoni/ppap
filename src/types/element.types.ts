import type { ImageMime } from './asset.types';

export type ColorToken = 'ink' | 'blue' | 'red' | 'green';

export type SizeToken = 's' | 'm' | 'l';

export type NibToken = 'pen' | 'pencil';

export type StrokePoint = [x: number, y: number, pressure: number];

export interface ElementBase {
  id: string;
  createdAt: number;
}

export interface StrokeElement extends ElementBase {
  type: 'stroke';
  points: StrokePoint[];
  color: ColorToken;
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

export type Element = StrokeElement | ImageElement;

export type ElementType = Element['type'];
