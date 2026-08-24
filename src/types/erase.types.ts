import type { Element, StrokeElement } from './element.types';

export interface EraseHit {
  source: Element;
  fragments: StrokeElement[];
}
