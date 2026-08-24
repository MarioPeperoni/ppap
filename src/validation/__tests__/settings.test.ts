import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '@/constants/settings.constants';
import { parseSettings, parseSettingsPatch } from '@/validation/settings.validator';

describe('settings validation', () => {
  it('fills every missing field from the defaults', () => {
    expect(parseSettings({ theme: 'dark' })).toEqual({ ...DEFAULT_SETTINGS, theme: 'dark' });
  });

  it('keeps only the fields a patch carries', () => {
    expect(parseSettingsPatch({ sortOrder: 'name' })).toEqual({ sortOrder: 'name' });
  });

  it('rejects a value outside its set', () => {
    expect(() => parseSettings({ penSize: 'xl' })).toThrow('Pen size');
    expect(() => parseSettings({ eraserRadius: 999 })).toThrow('Eraser radius');
  });
});
