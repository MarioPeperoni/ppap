import { describe, expect, it } from 'vitest';
import { HISTORY_LIMIT } from '@/constants/history.constants';
import { EMPTY_HISTORY, record, redo, undo } from '@/core/history/history-stack';
import type { Command } from '@/types';

function counter(state: { value: number }, delta: number): Command {
  return {
    label: `add ${delta}`,
    apply: () => {
      state.value += delta;
    },
    revert: () => {
      state.value -= delta;
    },
  };
}

describe('history stack', () => {
  it('restores identical state through apply and revert', () => {
    const state = { value: 0 };
    const command = counter(state, 5);

    command.apply();
    expect(state.value).toBe(5);

    const stepped = undo(record(EMPTY_HISTORY, command));
    stepped.command?.revert();

    expect(state.value).toBe(0);
    expect(stepped.history.past).toHaveLength(0);
    expect(stepped.history.future).toHaveLength(1);
  });

  it('replays a reverted command on redo', () => {
    const state = { value: 0 };
    const command = counter(state, 3);
    command.apply();

    const undone = undo(record(EMPTY_HISTORY, command));
    undone.command?.revert();
    const redone = redo(undone.history);
    redone.command?.apply();

    expect(state.value).toBe(3);
    expect(redone.history.past).toHaveLength(1);
    expect(redone.history.future).toHaveLength(0);
  });

  it('clears the redo stack once a new command is recorded', () => {
    const state = { value: 0 };
    const undone = undo(record(EMPTY_HISTORY, counter(state, 1)));
    const next = record(undone.history, counter(state, 2));

    expect(next.future).toHaveLength(0);
    expect(next.past).toHaveLength(1);
  });

  it('reports nothing to undo or redo on an empty history', () => {
    expect(undo(EMPTY_HISTORY).command).toBeNull();
    expect(redo(EMPTY_HISTORY).command).toBeNull();
  });

  it('caps the undo stack', () => {
    const state = { value: 0 };
    let history = EMPTY_HISTORY;
    for (let index = 0; index < HISTORY_LIMIT + 50; index += 1) {
      history = record(history, counter(state, 1));
    }

    expect(history.past).toHaveLength(HISTORY_LIMIT);
  });
});
