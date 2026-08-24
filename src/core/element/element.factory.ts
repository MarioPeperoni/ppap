import type { ColorToken, ImageElement, SizeToken, StrokeElement, StrokePoint } from '@/types';

export function createStroke(
  points: StrokePoint[],
  color: ColorToken,
  size: SizeToken,
): StrokeElement {
  return { id: crypto.randomUUID(), createdAt: Date.now(), type: 'stroke', points, color, size };
}

export function createImage(source: Omit<ImageElement, 'id' | 'createdAt' | 'type'>): ImageElement {
  return { id: crypto.randomUUID(), createdAt: Date.now(), type: 'image', ...source };
}
