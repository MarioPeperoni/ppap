import { THEMES } from '@/constants/theme.constants';
import type { Theme } from '@/types';

export function parseTheme(value: unknown): Theme {
  const theme = THEMES.find((candidate) => candidate === value);
  if (theme === undefined) throw new Error(`Unknown theme: ${String(value)}`);

  return theme;
}

export function parseBoolean(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new Error(`Expected a boolean, got ${String(value)}`);

  return value;
}
