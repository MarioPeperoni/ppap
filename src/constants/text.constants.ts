import type { FontToken, SizeToken } from '@/types';

export const FONT_TOKENS: readonly FontToken[] = ['sans', 'serif', 'mono', 'hand'];

export const FONT_FAMILIES: Record<FontToken, string> = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  mono: 'ui-monospace, Menlo, Consolas, "Courier New", monospace',
  hand: '"Bradley Hand", "Segoe Script", "Comic Sans MS", cursive',
};

export const FONT_LABELS: Record<FontToken, string> = {
  sans: 'Sans',
  serif: 'Serif',
  mono: 'Mono',
  hand: 'Hand',
};

export const TEXT_SIZE_UNITS: Record<SizeToken, number> = { s: 16, m: 24, l: 36, xl: 56 };

export const TEXT_SIZE_LABELS: Record<SizeToken, string> = {
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'Huge',
};

export const TEXT_LINE_HEIGHT = 1.35;

/** An empty box still has to be wide enough to see and to click back into. */
export const TEXT_MIN_WIDTH_EM = 1.5;

/** Room for the caret past the longest line, so it stays visible at the end of a line. */
export const TEXT_CARET_PAD = 2;

export const DEFAULT_TEXT_SIZE: SizeToken = 'm';
export const DEFAULT_FONT: FontToken = 'sans';
export const DEFAULT_TEXT_SCALE = 1;
