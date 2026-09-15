import type { StrokeElement } from './element.types';

export interface EraseHit {
  source: StrokeElement;
  fragments: StrokeElement[];
}
