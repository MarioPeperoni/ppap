import { beforeEach, describe, expect, it } from 'vitest';
import { useToolStore } from '@/renderer/stores/tool.store';

beforeEach(() => {
  useToolStore.setState({ color: 'ink', swapColor: null, customColors: [] });
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
    useToolStore.getState().cycleColor(1);

    expect(useToolStore.getState()).toMatchObject({ color: 'blue', swapColor: 'ink' });
  });

  it('drops the pin with the custom colour behind it', () => {
    useToolStore.getState().addCustomColor('#7c3aed');
    useToolStore.getState().setColor('ink');
    useToolStore.getState().pairColor('#7c3aed');
    useToolStore.getState().removeCustomColor('#7c3aed');

    expect(useToolStore.getState()).toMatchObject({ color: 'ink', swapColor: null });
  });
});
