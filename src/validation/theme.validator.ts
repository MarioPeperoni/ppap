import { THEMES } from '@/constants/theme.constants';
import type { Theme } from '@/types';
import { expectOneOf } from '@/validation/primitive.validator';

export function parseTheme(value: unknown): Theme {
  return expectOneOf(value, THEMES, 'Theme');
}
