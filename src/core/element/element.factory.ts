import { DEFAULT_NIB, DEFAULT_STROKE_SCALE } from '@/constants/stroke.constants';
import type {
  Element,
  ImageElement,
  NibToken,
  SizeToken,
  StrokeColor,
  StrokeElement,
  StrokePoint,
  TextElement,
} from '@/types';

export function createStroke(
  points: StrokePoint[],
  color: StrokeColor,
  size: SizeToken,
  nib: NibToken = DEFAULT_NIB,
  scale: number = DEFAULT_STROKE_SCALE,
): StrokeElement {
  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    type: 'stroke',
    points,
    color,
    size,
    nib,
    scale,
  };
}

export function createImage(source: Omit<ImageElement, 'id' | 'createdAt' | 'type'>): ImageElement {
  return { id: crypto.randomUUID(), createdAt: Date.now(), type: 'image', ...source };
}

export function createText(source: Omit<TextElement, 'id' | 'createdAt' | 'type'>): TextElement {
  return { id: crypto.randomUUID(), createdAt: Date.now(), type: 'text', ...source };
}

export function cloneElement(element: Element): Element {
  switch (element.type) {
    case 'stroke':
      return createStroke(
        element.points.map((point) => [...point]),
        element.color,
        element.size,
        element.nib,
        element.scale,
      );
    case 'image':
      return createImage({
        assetId: element.assetId,
        mime: element.mime,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
      });
    case 'text':
      return createText({
        text: element.text,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        color: element.color,
        size: element.size,
        font: element.font,
        scale: element.scale,
      });
  }
}
