import { describe, expect, it } from 'vitest';
import { MAX_CUSTOM_COLORS } from '@/constants/color.constants';
import { DEFAULT_SETTINGS } from '@/constants/settings.constants';
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

  it('takes a custom colour list and a hex as the active colour', () => {
    expect(parseSettingsPatch({ color: '#7c3aed', customColors: ['#7c3aed', '#0ea5e9'] })).toEqual({
      color: '#7c3aed',
      customColors: ['#7c3aed', '#0ea5e9'],
    });
  });

  it('rejects a custom colour that is not a hex', () => {
    expect(() => parseSettings({ customColors: ['#7C3AED'] })).toThrow('Custom colors');
    expect(() => parseSettings({ customColors: 'blue' })).toThrow('Custom colors');
  });

  it('rejects more custom colours than the palette holds', () => {
    const many = Array.from({ length: MAX_CUSTOM_COLORS + 1 }, () => '#7c3aed');

    expect(() => parseSettings({ customColors: many })).toThrow('Custom colors');
  });

  it('rejects a value outside its set', () => {
    expect(() => parseSettings({ penSize: 'xl' })).toThrow('Pen size');
    expect(() => parseSettings({ eraserRadius: 999 })).toThrow('Eraser radius');
  });
});
