import { describe, expect, it } from 'vitest';
import {
  CARRIED_PALETTE_ID,
  MAX_CUSTOM_COLORS,
  MAX_PALETTE_NAME,
  MAX_SAVED_PALETTES,
} from '@/constants/color.constants';
import { DEFAULT_KEYMAP } from '@/constants/keymap.constants';
import { DEFAULT_SETTINGS } from '@/constants/settings.constants';
import { ERASER_RADII, TOOL_SIZES } from '@/constants/tool.constants';
import { parseSettings, parseSettingsPatch } from '@/validation/settings.validator';

describe('settings validation', () => {
  it('fills every missing field from the defaults', () => {
    expect(parseSettings({ theme: 'dark' })).toEqual({ ...DEFAULT_SETTINGS, theme: 'dark' });
  });

  it('keeps only the fields a patch carries', () => {
    expect(parseSettingsPatch({ sortOrder: 'name' })).toEqual({ sortOrder: 'name' });
  });

  it('keeps the last seen version as written', () => {
    expect(parseSettingsPatch({ lastSeenVersion: '1.2.0' })).toEqual({ lastSeenVersion: '1.2.0' });
    expect(() => parseSettings({ lastSeenVersion: 3 })).toThrow('Last seen version');
  });

  it('takes a hex as the active colour and an id as the palette in hand', () => {
    expect(parseSettingsPatch({ color: '#7c3aed', activePaletteId: 'sketch' })).toEqual({
      color: '#7c3aed',
      activePaletteId: 'sketch',
    });
  });

  it('reads loose colours as the palette the pen carries', () => {
    const settings = parseSettings({ customColors: ['#7c3aed', '#0ea5e9'] });

    expect(settings.savedPalettes).toEqual([
      { id: CARRIED_PALETTE_ID, name: 'Mine', colors: ['#7c3aed', '#0ea5e9'] },
    ]);
    expect(settings.activePaletteId).toBe(CARRIED_PALETTE_ID);
  });

  it('carries no palette when the id names none', () => {
    expect(parseSettings({ activePaletteId: 'ghost' }).activePaletteId).toBeNull();
  });

  it('rejects a custom colour that is not a hex', () => {
    expect(() => parseSettings({ customColors: ['#7C3AED'] })).toThrow('Custom colors');
    expect(() => parseSettings({ customColors: 'blue' })).toThrow('Custom colors');
  });

  it('rejects more custom colours than the palette holds', () => {
    const many = Array.from({ length: MAX_CUSTOM_COLORS + 1 }, () => '#7c3aed');

    expect(() => parseSettings({ customColors: many })).toThrow('Custom colors');
  });

  it('keeps a saved palette as written', () => {
    const palette = { id: 'a', name: 'Sketch', colors: ['#7c3aed', '#0ea5e9'] };

    expect(parseSettingsPatch({ savedPalettes: [palette] })).toEqual({ savedPalettes: [palette] });
  });

  it('rejects a palette that is malformed or outgrows its limits', () => {
    const many = Array.from({ length: MAX_SAVED_PALETTES + 1 }, () => ({
      id: 'a',
      name: 'Sketch',
      colors: [],
    }));
    const wide = { id: 'a', name: 'Sketch', colors: Array(MAX_CUSTOM_COLORS + 1).fill('#7c3aed') };

    expect(() => parseSettings({ savedPalettes: many })).toThrow('Saved palettes');
    expect(() => parseSettings({ savedPalettes: [wide] })).toThrow('Saved palettes');
    expect(() => parseSettings({ savedPalettes: ['#7c3aed'] })).toThrow('Saved palettes');
    expect(() => parseSettings({ savedPalettes: [{ id: 'a', colors: [] }] })).toThrow(
      'Saved palettes',
    );
  });

  it('cuts a palette name to the limit it keeps', () => {
    const palette = { id: 'a', name: 'x'.repeat(MAX_PALETTE_NAME + 10), colors: [] };
    const [saved] = parseSettings({ savedPalettes: [palette] }).savedPalettes;

    expect(saved?.name).toHaveLength(MAX_PALETTE_NAME);
  });

  it('keeps a stored binding and defaults the rest of the keymap', () => {
    const binding = { primary: 'ctrl+1', secondary: '9' };
    const { keymap } = parseSettings({ keymap: { 'tool.pen': binding } });

    expect(keymap).toEqual({ ...DEFAULT_KEYMAP, 'tool.pen': binding });
  });

  it('defaults the slot a binding leaves out', () => {
    const { keymap } = parseSettings({ keymap: { 'tool.lasso': { primary: 'k' } } });

    expect(keymap['tool.lasso']).toEqual({ primary: 'k', secondary: '5' });
  });

  it('keeps an unbound slot unbound', () => {
    const { keymap } = parseSettings({ keymap: { 'tool.hand': { secondary: '' } } });

    expect(keymap['tool.hand']).toEqual({ primary: 'h', secondary: '' });
  });

  it('drops an unknown action, a malformed stroke and a stray shape', () => {
    const { keymap } = parseSettings({
      keymap: {
        'tool.brush': { primary: 'b' },
        'tool.pen': { primary: 'Ctrl+Z', secondary: 7 },
        'tool.lasso': 'l',
      },
    });

    expect(keymap).toEqual(DEFAULT_KEYMAP);
  });

  it('rejects a keymap that is not an object', () => {
    expect(() => parseSettings({ keymap: 'p' })).toThrow('Keymap');
  });

  it('takes every width and radius the toolbar can pick', () => {
    for (const size of TOOL_SIZES) {
      expect(parseSettingsPatch({ penSize: size })).toEqual({ penSize: size });
    }
    for (const radius of ERASER_RADII) {
      expect(parseSettingsPatch({ eraserRadius: radius })).toEqual({ eraserRadius: radius });
    }
  });

  it('rejects a value outside its set', () => {
    expect(() => parseSettings({ penSize: 'xxl' })).toThrow('Pen size');
    expect(() => parseSettings({ wheelAction: 'scroll' })).toThrow('Wheel action');
    expect(() => parseSettings({ eraserRadius: 999 })).toThrow('Eraser radius');
  });
});
