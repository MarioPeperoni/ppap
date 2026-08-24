import { DEFAULT_NIB, DEFAULT_STROKE_SCALE } from '@/constants/stroke.constants';
import type {
  ColorToken,
  Element,
  ImageElement,
  NibToken,
  SizeToken,
  StrokeElement,
  StrokePoint,
} from '@/types';

export function createStroke(
  points: StrokePoint[],
  color: ColorToken,
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
  }
}
