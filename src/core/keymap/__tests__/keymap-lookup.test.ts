import { describe, expect, it } from 'vitest';
import { ACTION_GROUPS, ACTION_IDS, DEFAULT_KEYMAP } from '@/constants/keymap.constants';
import { judgeStroke } from '@/core/keymap/bind-policy';
import { assignStroke, findAction } from '@/core/keymap/keymap-lookup';

describe('findAction', () => {
  it('resolves a bound stroke', () => {
    expect(findAction(DEFAULT_KEYMAP, 'shift+c')).toBe('color.previous');
  });

  it('resolves nothing for a free stroke', () => {
    expect(findAction(DEFAULT_KEYMAP, 'q')).toBeUndefined();
  });

  it('ignores unbound actions rather than matching them', () => {
    const keymap = { ...DEFAULT_KEYMAP, 'tool.hand': '' };

    expect(findAction(keymap, '')).toBeUndefined();
  });
});

describe('assignStroke', () => {
  it('takes the stroke from its previous owner', () => {
    const next = assignStroke(DEFAULT_KEYMAP, 'tool.pencil', 'e');

    expect(next['tool.pencil']).toBe('e');
    expect(next['tool.eraser']).toBe('');
  });

  it('leaves the action alone when it already holds the stroke', () => {
    const next = assignStroke(DEFAULT_KEYMAP, 'tool.pen', 'p');

    expect(next).toEqual(DEFAULT_KEYMAP);
  });

  it('does not mutate the map it was given', () => {
    assignStroke(DEFAULT_KEYMAP, 'tool.pencil', 'e');

    expect(DEFAULT_KEYMAP['tool.eraser']).toBe('e');
  });
});

describe('judgeStroke', () => {
  it('refuses a structural key', () => {
    expect(judgeStroke(DEFAULT_KEYMAP, 'tool.pen', 'escape')).toEqual({
      kind: 'fixed',
      owner: 'Cancel gesture',
    });
  });

  it('reports the action a stroke would be taken from', () => {
    expect(judgeStroke(DEFAULT_KEYMAP, 'tool.pen', 'x')).toEqual({
      kind: 'steals',
      owner: 'color.swap',
    });
  });

  it('warns about a shortcut a stroke would shadow', () => {
    expect(judgeStroke(DEFAULT_KEYMAP, 'tool.pen', 'ctrl+1')).toEqual({
      kind: 'overrides',
      owner: 'Fit content',
    });
  });

  it('passes a free stroke', () => {
    expect(judgeStroke(DEFAULT_KEYMAP, 'tool.pen', 'q')).toEqual({ kind: 'ok' });
  });
});

describe('action catalogue', () => {
  it('binds every action by default', () => {
    for (const action of ACTION_IDS) expect(DEFAULT_KEYMAP[action]).not.toBe('');
  });

  it('lists every action in exactly one group', () => {
    const grouped = ACTION_GROUPS.flatMap((group) => group.actions);

    expect([...grouped].sort()).toEqual([...ACTION_IDS].sort());
  });
});
