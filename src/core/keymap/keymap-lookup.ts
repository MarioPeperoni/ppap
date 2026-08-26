import { ACTION_IDS } from '@/constants/keymap.constants';
import type { ActionId, Keymap, KeyStroke } from '@/types';

export function findAction(keymap: Keymap, stroke: KeyStroke): ActionId | undefined {
  if (stroke === '') return undefined;

  return ACTION_IDS.find((action) => keymap[action] === stroke);
}

export function assignStroke(keymap: Keymap, action: ActionId, stroke: KeyStroke): Keymap {
  const holder = findAction(keymap, stroke);
  const next: Keymap = { ...keymap };

  next[action] = stroke;
  if (holder !== undefined && holder !== action) next[holder] = '';

  return next;
}
