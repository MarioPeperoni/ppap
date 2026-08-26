import { describe, expect, it } from 'vitest';
import {
  formatStroke,
  isModifierKey,
  isValidStroke,
  splitStroke,
  strokeFromEvent,
} from '@/core/keymap/key-stroke';
import type { KeyEventLike } from '@/types';

function press(key: string, modifiers: Partial<KeyEventLike> = {}): KeyEventLike {
  return { key, ctrlKey: false, metaKey: false, altKey: false, shiftKey: false, ...modifiers };
}

describe('strokeFromEvent', () => {
  it('lowercases a bare key', () => {
    expect(strokeFromEvent(press('P'))).toBe('p');
  });

  it('names the space bar', () => {
    expect(strokeFromEvent(press(' '))).toBe('space');
  });

  it('orders modifiers as ctrl, alt, shift', () => {
    expect(strokeFromEvent(press('C', { shiftKey: true, altKey: true, ctrlKey: true }))).toBe(
      'ctrl+alt+shift+c',
    );
  });

  it('folds the command key into ctrl', () => {
    expect(strokeFromEvent(press('1', { metaKey: true }))).toBe('ctrl+1');
  });

  it('yields nothing for a lone modifier', () => {
    expect(strokeFromEvent(press('Shift', { shiftKey: true }))).toBe('');
  });

  it('keeps named keys in one piece', () => {
    expect(strokeFromEvent(press('ArrowLeft', { altKey: true }))).toBe('alt+arrowleft');
  });
});

describe('splitStroke', () => {
  it('separates modifiers from the key', () => {
    expect(splitStroke('ctrl+shift+c')).toEqual({ modifiers: ['ctrl', 'shift'], key: 'c' });
  });

  it('reads a plus sign as the key', () => {
    expect(splitStroke('shift++')).toEqual({ modifiers: ['shift'], key: '+' });
  });
});

describe('isValidStroke', () => {
  it('accepts what an event produces', () => {
    for (const stroke of ['p', 'shift+c', 'ctrl+1', '[', 'space', 'alt+arrowleft', 'shift++']) {
      expect(isValidStroke(stroke)).toBe(true);
    }
  });

  it('rejects an empty, uppercase or malformed stroke', () => {
    for (const stroke of ['', 'ctrl+', 'P', 'ctrl+shift', 'a+b']) {
      expect(isValidStroke(stroke)).toBe(false);
    }
  });
});

describe('formatStroke', () => {
  it('uses symbols on macOS', () => {
    expect(formatStroke('ctrl+shift+c', 'darwin')).toBe('⌘⇧C');
  });

  it('spells modifiers out elsewhere', () => {
    expect(formatStroke('ctrl+shift+c', 'win32')).toBe('Ctrl+Shift+C');
  });

  it('names the keys that have no glyph', () => {
    expect(formatStroke('backspace', 'win32')).toBe('Backspace');
    expect(formatStroke('alt+arrowleft', 'win32')).toBe('Alt+←');
  });

  it('shows nothing for an unbound action', () => {
    expect(formatStroke('', 'darwin')).toBe('');
  });
});

describe('isModifierKey', () => {
  it('knows the keys that carry no action of their own', () => {
    expect(isModifierKey('Shift')).toBe(true);
    expect(isModifierKey('p')).toBe(false);
  });
});
