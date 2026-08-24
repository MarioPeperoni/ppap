import { ELEMENT_TYPES } from '@/constants/element.constants';
import { IMAGE_MIMES } from '@/constants/image.constants';
import { DEFAULT_NIB, NIB_TOKENS } from '@/constants/stroke.constants';
import { TOOL_COLORS, TOOL_SIZES } from '@/constants/tool.constants';
import type { Element, ImageElement, StrokeElement, StrokePoint } from '@/types';
import { parseAssetId } from '@/validation/asset.validator';
import {
  expectArray,
  expectNumber,
  expectOneOf,
  expectRecord,
  expectString,
} from '@/validation/primitive.validator';

function parseStrokePoint(value: unknown): StrokePoint {
  const point = expectArray(value, 'Stroke point');

  return [
    expectNumber(point[0], 'Stroke point x'),
    expectNumber(point[1], 'Stroke point y'),
    expectNumber(point[2], 'Stroke point pressure'),
  ];
}

function parseStroke(source: Record<string, unknown>): StrokeElement {
  return {
    id: expectString(source.id, 'Element id'),
    createdAt: expectNumber(source.createdAt, 'Element createdAt'),
    type: 'stroke',
    points: expectArray(source.points, 'Stroke points').map(parseStrokePoint),
    color: expectOneOf(source.color, TOOL_COLORS, 'Stroke color'),
    size: expectOneOf(source.size, TOOL_SIZES, 'Stroke size'),
    nib: source.nib === undefined ? DEFAULT_NIB : expectOneOf(source.nib, NIB_TOKENS, 'Stroke nib'),
    scale: expectNumber(source.scale, 'Stroke scale'),
  };
}

function parseImage(source: Record<string, unknown>): ImageElement {
  return {
    id: expectString(source.id, 'Element id'),
    createdAt: expectNumber(source.createdAt, 'Element createdAt'),
    type: 'image',
    assetId: parseAssetId(source.assetId),
    mime: expectOneOf(source.mime, IMAGE_MIMES, 'Image mime'),
    x: expectNumber(source.x, 'Image x'),
    y: expectNumber(source.y, 'Image y'),
    width: expectNumber(source.width, 'Image width'),
    height: expectNumber(source.height, 'Image height'),
    naturalWidth: expectNumber(source.naturalWidth, 'Image naturalWidth'),
    naturalHeight: expectNumber(source.naturalHeight, 'Image naturalHeight'),
  };
}

export function parseElement(value: unknown): Element {
  const source = expectRecord(value, 'Element');

  switch (expectOneOf(source.type, ELEMENT_TYPES, 'Element type')) {
    case 'stroke':
      return parseStroke(source);
    case 'image':
      return parseImage(source);
  }
}
