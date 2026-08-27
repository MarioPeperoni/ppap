import { BIND_SLOTS } from '@/constants/keymap.constants';
import type { KeyBinding, KeyStroke } from '@/types';

export function boundStrokes(binding: KeyBinding): readonly KeyStroke[] {
  return BIND_SLOTS.map((slot) => binding[slot]).filter((stroke) => stroke !== '');
}

export function sameBinding(one: KeyBinding, other: KeyBinding): boolean {
  return BIND_SLOTS.every((slot) => one[slot] === other[slot]);
}
