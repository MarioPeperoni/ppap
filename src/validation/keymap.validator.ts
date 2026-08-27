import { ACTION_IDS, BIND_SLOTS, DEFAULT_KEYMAP } from '@/constants/keymap.constants';
import { isValidStroke } from '@/core/keymap/key-stroke';
import type { KeyBinding, Keymap, KeyStroke } from '@/types';
import { expectRecord, isRecord } from '@/validation/primitive.validator';

function parseStroke(value: unknown, fallback: KeyStroke): KeyStroke {
  if (typeof value !== 'string') return fallback;
  if (value !== '' && !isValidStroke(value)) return fallback;

  return value;
}

function parseBinding(value: unknown, fallback: KeyBinding): KeyBinding {
  if (!isRecord(value)) return fallback;

  const binding: KeyBinding = { ...fallback };
  for (const slot of BIND_SLOTS) binding[slot] = parseStroke(value[slot], fallback[slot]);

  return binding;
}

export function parseKeymap(value: unknown, label: string): Keymap {
  const source = expectRecord(value, label);
  const keymap: Keymap = { ...DEFAULT_KEYMAP };

  for (const action of ACTION_IDS) {
    keymap[action] = parseBinding(source[action], DEFAULT_KEYMAP[action]);
  }

  return keymap;
}
