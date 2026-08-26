import { WHEEL_ACTIONS } from '@/constants/camera.constants';
import { CARRIED_PALETTE_ID } from '@/constants/color.constants';
import { DEFAULT_SETTINGS, SORT_ORDERS } from '@/constants/settings.constants';
import { ERASER_RADII, TOOL_IDS, TOOL_SIZES } from '@/constants/tool.constants';
import { paletteOf } from '@/core/color/palettes';
import type { SavedPalette, Settings, SettingsPatch } from '@/types';
import { parseCustomColors, parseStrokeColor, parseSwapColor } from '@/validation/color.validator';
import { parseKeymap } from '@/validation/keymap.validator';
import { parsePaletteId, parseSavedPalettes } from '@/validation/palette.validator';
import { expectOneOf, expectRecord, expectString } from '@/validation/primitive.validator';
import { parseTheme } from '@/validation/theme.validator';

export function parseSettingsPatch(value: unknown): SettingsPatch {
  const source = expectRecord(value, 'Settings');
  const patch: SettingsPatch = {};

  if (source.theme !== undefined) patch.theme = parseTheme(source.theme);
  if (source.tool !== undefined) patch.tool = expectOneOf(source.tool, TOOL_IDS, 'Tool');
  if (source.color !== undefined) patch.color = parseStrokeColor(source.color, 'Color');
  if (source.swapColor !== undefined) {
    patch.swapColor = parseSwapColor(source.swapColor, 'Swap color');
  }
  if (source.activePaletteId !== undefined) {
    patch.activePaletteId = parsePaletteId(source.activePaletteId, 'Active palette');
  }
  if (source.savedPalettes !== undefined) {
    patch.savedPalettes = parseSavedPalettes(source.savedPalettes, 'Saved palettes');
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
  if (source.keymap !== undefined) patch.keymap = parseKeymap(source.keymap, 'Keymap');
  if (source.sortOrder !== undefined) {
    patch.sortOrder = expectOneOf(source.sortOrder, SORT_ORDERS, 'Sort order');
  }
  if (source.lastSeenVersion !== undefined) {
    patch.lastSeenVersion = expectString(source.lastSeenVersion, 'Last seen version');
  }

  return patch;
}

export function parseSettings(value: unknown): Settings {
  const source = expectRecord(value, 'Settings');
  const settings: Settings = { ...DEFAULT_SETTINGS, ...parseSettingsPatch(source) };
  const carried = paletteOf(settings.savedPalettes, settings.activePaletteId);
  if (carried !== null) return settings;
  if (settings.savedPalettes.length > 0 || source.customColors === undefined) {
    return { ...settings, activePaletteId: null };
  }

  return startedFrom(settings, source.customColors);
}

/** A file that names loose colours reads them as the one palette the pen carries. */
function startedFrom(settings: Settings, value: unknown): Settings {
  const colors = parseCustomColors(value, 'Custom colors');
  if (colors.length === 0) return { ...settings, activePaletteId: null };

  const palette: SavedPalette = { id: CARRIED_PALETTE_ID, name: 'Mine', colors };

  return { ...settings, savedPalettes: [palette], activePaletteId: palette.id };
}
