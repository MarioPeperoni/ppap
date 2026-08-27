import { beforeEach, describe, expect, it } from 'vitest';
import { useToolStore } from '@/renderer/stores/tool.store';

beforeEach(() => {
  useToolStore.setState({ color: 'ink', swapColor: null, activePaletteId: null });
});

describe('the colour pair', () => {
  it('keeps the pinned colour when another one is picked', () => {
    useToolStore.getState().pairColor('red');
    useToolStore.getState().setColor('blue');

    expect(useToolStore.getState()).toMatchObject({ color: 'blue', swapColor: 'red' });
  });

  it('swaps when the pinned colour is picked', () => {
    useToolStore.getState().pairColor('red');
    useToolStore.getState().setColor('red');

    expect(useToolStore.getState()).toMatchObject({ color: 'red', swapColor: 'ink' });
  });

  it('swaps back and forth', () => {
    useToolStore.getState().pairColor('red');
    useToolStore.getState().swapColors();
    useToolStore.getState().swapColors();

    expect(useToolStore.getState()).toMatchObject({ color: 'ink', swapColor: 'red' });
  });

  it('leaves an unpaired colour alone', () => {
    useToolStore.getState().swapColors();

    expect(useToolStore.getState()).toMatchObject({ color: 'ink', swapColor: null });
  });

  it('refuses to pin the active colour', () => {
    useToolStore.getState().pairColor('ink');

    expect(useToolStore.getState().swapColor).toBeNull();
  });

  it('unpins on a second pin of the same colour', () => {
    useToolStore.getState().pairColor('green');
    useToolStore.getState().pairColor('green');

    expect(useToolStore.getState().swapColor).toBeNull();
  });

  it('never lets a cycle land on the pinned colour', () => {
    useToolStore.getState().pairColor('blue');
    useToolStore.getState().cycleColor(1, []);

    expect(useToolStore.getState()).toMatchObject({ color: 'blue', swapColor: 'ink' });
  });

  it('keeps the pair when the pen picks up another palette', () => {
    useToolStore.getState().setColor('#7c3aed');
    useToolStore.getState().pairColor('ink');
    useToolStore.getState().carryPalette('other');

    expect(useToolStore.getState()).toMatchObject({ color: '#7c3aed', swapColor: 'ink' });
  });
});

describe('the palette in hand', () => {
  it('carries a palette by its id, and none at all', () => {
    useToolStore.getState().carryPalette('sketch');
    expect(useToolStore.getState().activePaletteId).toBe('sketch');

    useToolStore.getState().carryPalette(null);
    expect(useToolStore.getState().activePaletteId).toBeNull();
  });

  it('cycles the tokens and the colours it is handed', () => {
    useToolStore.getState().setColor('#7c3aed');
    useToolStore.getState().cycleColor(1, ['#7c3aed']);

    expect(useToolStore.getState().color).toBe('ink');
  });

  it('falls back to ink when the colour in hand is off the palette', () => {
    useToolStore.getState().setColor('#7c3aed');
    useToolStore.getState().cycleColor(1, []);

    expect(useToolStore.getState().color).toBe('ink');
  });
});
