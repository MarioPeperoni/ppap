import { beforeEach, describe, expect, it } from 'vitest';
import { MAX_SAVED_PALETTES } from '@/constants/color.constants';
import { usePaletteStore } from '@/renderer/stores/palette.store';
import type { SavedPalette } from '@/types';

function only(): SavedPalette {
  const [palette] = usePaletteStore.getState().palettes;
  if (palette === undefined) throw new Error('no palette');

  return palette;
}

beforeEach(() => {
  usePaletteStore.setState({ palettes: [] });
});

describe('the palette library', () => {
  it('makes an empty palette with a name of its own', () => {
    usePaletteStore.getState().createPalette();

    expect(only()).toMatchObject({ name: 'Palette 1', colors: [] });
  });

  it('stops making palettes at the limit', () => {
    for (let n = 0; n < MAX_SAVED_PALETTES; n += 1) usePaletteStore.getState().createPalette();

    expect(usePaletteStore.getState().createPalette()).toBeNull();
    expect(usePaletteStore.getState().palettes).toHaveLength(MAX_SAVED_PALETTES);
  });

  it('fills only the palette it is asked for', () => {
    usePaletteStore.getState().createPalette();
    usePaletteStore.getState().createPalette();
    const [first, second] = usePaletteStore.getState().palettes;
    usePaletteStore.getState().addColor(first?.id ?? '', '#7c3aed');

    expect(usePaletteStore.getState().palettes[0]?.colors).toEqual(['#7c3aed']);
    expect(usePaletteStore.getState().palettes[1]?.colors).toEqual(second?.colors);
  });

  it('drops a colour and renames a palette', () => {
    usePaletteStore.getState().createPalette();
    usePaletteStore.getState().addColor(only().id, '#7c3aed');
    usePaletteStore.getState().removeColor(only().id, '#7c3aed');
    usePaletteStore.getState().renamePalette(only().id, 'Warm greys');

    expect(only()).toMatchObject({ name: 'Warm greys', colors: [] });
  });

  it('leaves the library alone when the id is unknown', () => {
    usePaletteStore.getState().createPalette();
    usePaletteStore.getState().addColor('nothing', '#7c3aed');

    expect(only().colors).toEqual([]);
  });

  it('deletes a palette', () => {
    usePaletteStore.getState().createPalette();
    usePaletteStore.getState().deletePalette(only().id);

    expect(usePaletteStore.getState().palettes).toEqual([]);
  });
});
