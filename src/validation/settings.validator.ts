import { WHEEL_ACTIONS } from '@/constants/camera.constants';
import { DEFAULT_SETTINGS, SORT_ORDERS } from '@/constants/settings.constants';
import { ERASER_RADII, TOOL_IDS, TOOL_SIZES } from '@/constants/tool.constants';
import type { Settings, SettingsPatch } from '@/types';
import { parseCustomColors, parseStrokeColor } from '@/validation/color.validator';
import { expectOneOf, expectRecord, expectString } from '@/validation/primitive.validator';
import { parseTheme } from '@/validation/theme.validator';

export function parseSettingsPatch(value: unknown): SettingsPatch {
  const source = expectRecord(value, 'Settings');
  const patch: SettingsPatch = {};

  if (source.theme !== undefined) patch.theme = parseTheme(source.theme);
  if (source.tool !== undefined) patch.tool = expectOneOf(source.tool, TOOL_IDS, 'Tool');
  if (source.color !== undefined) patch.color = parseStrokeColor(source.color, 'Color');
  if (source.customColors !== undefined) {
    patch.customColors = parseCustomColors(source.customColors, 'Custom colors');
  }
  if (source.penSize !== undefined) {
    patch.penSize = expectOneOf(source.penSize, TOOL_SIZES, 'Pen size');
  }
  if (source.eraserRadius !== undefined) {
    patch.eraserRadius = expectOneOf(source.eraserRadius, ERASER_RADII, 'Eraser radius');
  }
  if (source.wheelAction !== undefined) {
    patch.wheelAction = expectOneOf(source.wheelAction, WHEEL_ACTIONS, 'Wheel action');
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
