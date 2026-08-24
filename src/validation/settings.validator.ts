import { DEFAULT_SETTINGS, SORT_ORDERS } from '@/constants/settings.constants';
import { ERASER_RADII, TOOL_COLORS, TOOL_IDS, TOOL_SIZES } from '@/constants/tool.constants';
import type { Settings, SettingsPatch } from '@/types';
import { expectOneOf, expectRecord, expectString } from '@/validation/primitive.validator';
import { parseTheme } from '@/validation/theme.validator';

export function parseSettingsPatch(value: unknown): SettingsPatch {
  const source = expectRecord(value, 'Settings');
  const patch: SettingsPatch = {};

  if (source.theme !== undefined) patch.theme = parseTheme(source.theme);
  if (source.tool !== undefined) patch.tool = expectOneOf(source.tool, TOOL_IDS, 'Tool');
  if (source.color !== undefined) patch.color = expectOneOf(source.color, TOOL_COLORS, 'Color');
  if (source.penSize !== undefined) {
    patch.penSize = expectOneOf(source.penSize, TOOL_SIZES, 'Pen size');
  }
  if (source.eraserRadius !== undefined) {
    patch.eraserRadius = expectOneOf(source.eraserRadius, ERASER_RADII, 'Eraser radius');
  }
  if (source.sortOrder !== undefined) {
    patch.sortOrder = expectOneOf(source.sortOrder, SORT_ORDERS, 'Sort order');
  }
  if (source.lastSeenVersion !== undefined) {
    patch.lastSeenVersion = expectString(source.lastSeenVersion, 'Last seen version');
  }

  return patch;
}

export function parseSettings(value: unknown): Settings {
  return { ...DEFAULT_SETTINGS, ...parseSettingsPatch(value) };
}
