import { describe, expect, it } from 'vitest';
import { ACTION_GROUPS, ACTION_IDS, DEFAULT_KEYMAP } from '@/constants/keymap.constants';
import { judgeStroke } from '@/core/keymap/bind-policy';
import { assignStroke, findAction, findTarget } from '@/core/keymap/keymap-lookup';

describe('findAction', () => {
  it('resolves a primary stroke', () => {
    expect(findAction(DEFAULT_KEYMAP, 'shift+c')).toBe('color.previous');
  });

  it('resolves a secondary stroke', () => {
    expect(findAction(DEFAULT_KEYMAP, '5')).toBe('tool.lasso');
  });

  it('resolves nothing for a free stroke', () => {
    expect(findAction(DEFAULT_KEYMAP, 'q')).toBeUndefined();
  });

  it('ignores unbound slots rather than matching them', () => {
    expect(findTarget(DEFAULT_KEYMAP, '')).toBeUndefined();
  });

  it('names the slot a stroke sits in', () => {
    expect(findTarget(DEFAULT_KEYMAP, '3')).toEqual({ action: 'tool.eraser', slot: 'secondary' });
  });
});

describe('assignStroke', () => {
  it('takes the stroke from its previous owner', () => {
    const next = assignStroke(DEFAULT_KEYMAP, { action: 'tool.pencil', slot: 'primary' }, 'e');

    expect(next['tool.pencil'].primary).toBe('e');
    expect(next['tool.eraser'].primary).toBe('');
  });

  it('leaves the other slot of the same action alone', () => {
    const next = assignStroke(DEFAULT_KEYMAP, { action: 'tool.pen', slot: 'secondary' }, 'q');

    expect(next['tool.pen']).toEqual({ primary: 'p', secondary: 'q' });
  });

  it('moves a stroke between the slots of one action', () => {
    const next = assignStroke(DEFAULT_KEYMAP, { action: 'tool.pen', slot: 'secondary' }, 'p');

    expect(next['tool.pen']).toEqual({ primary: '', secondary: 'p' });
  });

  it('leaves the slot alone when it already holds the stroke', () => {
    const next = assignStroke(DEFAULT_KEYMAP, { action: 'tool.pen', slot: 'primary' }, 'p');

    expect(next).toEqual(DEFAULT_KEYMAP);
  });

  it('does not mutate the map it was given', () => {
    assignStroke(DEFAULT_KEYMAP, { action: 'tool.pencil', slot: 'primary' }, 'e');

    expect(DEFAULT_KEYMAP['tool.eraser'].primary).toBe('e');
  });
});

describe('judgeStroke', () => {
  const penPrimary = { action: 'tool.pen', slot: 'primary' } as const;

  it('refuses a structural key', () => {
    expect(judgeStroke(DEFAULT_KEYMAP, penPrimary, 'escape')).toEqual({
      kind: 'fixed',
      owner: 'Cancel gesture',
    });
  });

  it('reports the action a stroke would be taken from', () => {
    expect(judgeStroke(DEFAULT_KEYMAP, penPrimary, 'x')).toEqual({
      kind: 'steals',
      owner: 'color.swap',
    });
  });

  it('reports the action a secondary stroke would be taken from', () => {
    expect(judgeStroke(DEFAULT_KEYMAP, penPrimary, '4')).toEqual({
      kind: 'steals',
      owner: 'tool.marquee',
    });
  });

  it('warns about a shortcut a stroke would shadow', () => {
    expect(judgeStroke(DEFAULT_KEYMAP, penPrimary, 'ctrl+1')).toEqual({
      kind: 'overrides',
      owner: 'Fit content',
    });
  });

  it('passes a free stroke', () => {
    expect(judgeStroke(DEFAULT_KEYMAP, penPrimary, 'q')).toEqual({ kind: 'ok' });
  });
});

describe('action catalogue', () => {
  it('binds a primary key for every action', () => {
    for (const action of ACTION_IDS) expect(DEFAULT_KEYMAP[action].primary).not.toBe('');
  });

  it('gives every tool a number as its secondary key', () => {
    const numbers = ['1', '2', '3', '4', '5', '6'];

    expect(numbers.map((key) => findAction(DEFAULT_KEYMAP, key))).toEqual([
      'tool.pen',
      'tool.pencil',
      'tool.eraser',
      'tool.marquee',
      'tool.lasso',
      'tool.hand',
    ]);
  });

  it('lists every action in exactly one group', () => {
    const grouped = ACTION_GROUPS.flatMap((group) => group.actions);

    expect([...grouped].sort()).toEqual([...ACTION_IDS].sort());
  });
});
