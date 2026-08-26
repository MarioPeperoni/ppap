import { ACTION_IDS, DEFAULT_KEYMAP } from '@/constants/keymap.constants';
import { isValidStroke } from '@/core/keymap/key-stroke';
import type { Keymap } from '@/types';
import { expectRecord } from '@/validation/primitive.validator';

export function parseKeymap(value: unknown, label: string): Keymap {
  const source = expectRecord(value, label);
  const keymap: Keymap = { ...DEFAULT_KEYMAP };

  for (const action of ACTION_IDS) {
    const stroke: unknown = source[action];
    if (typeof stroke !== 'string') continue;
    if (stroke !== '' && !isValidStroke(stroke)) continue;

    keymap[action] = stroke;
  }

  return keymap;
}
