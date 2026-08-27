import {
  FONT_FAMILIES,
  TEXT_LINE_HEIGHT,
  TEXT_MIN_WIDTH_EM,
  TEXT_SIZE_UNITS,
} from '@/constants/text.constants';
import type { FontToken, SizeToken } from '@/types';

export function fontSize(size: SizeToken, scale: number): number {
  return TEXT_SIZE_UNITS[size] * scale;
}

export function cssFont(size: SizeToken, scale: number, font: FontToken): string {
  return `${fontSize(size, scale)}px ${FONT_FAMILIES[font]}`;
}

export function lineHeight(size: SizeToken, scale: number): number {
  return fontSize(size, scale) * TEXT_LINE_HEIGHT;
}

export function minWidth(size: SizeToken, scale: number): number {
  return fontSize(size, scale) * TEXT_MIN_WIDTH_EM;
}

export function textLines(text: string): string[] {
  return text.split('\n');
}
