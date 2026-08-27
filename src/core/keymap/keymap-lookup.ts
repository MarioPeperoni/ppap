import { ACTION_IDS, BIND_SLOTS } from '@/constants/keymap.constants';
import type { ActionId, BindTarget, Keymap, KeyStroke } from '@/types';

export function findTarget(keymap: Keymap, stroke: KeyStroke): BindTarget | undefined {
  if (stroke === '') return undefined;

  for (const action of ACTION_IDS) {
    const slot = BIND_SLOTS.find((candidate) => keymap[action][candidate] === stroke);
    if (slot !== undefined) return { action, slot };
  }

  return undefined;
}

export function findAction(keymap: Keymap, stroke: KeyStroke): ActionId | undefined {
  return findTarget(keymap, stroke)?.action;
}

export function assignStroke(keymap: Keymap, target: BindTarget, stroke: KeyStroke): Keymap {
  const holder = findTarget(keymap, stroke);
  const next: Keymap = { ...keymap };

  next[target.action] = { ...next[target.action], [target.slot]: stroke };

  if (holder !== undefined && (holder.action !== target.action || holder.slot !== target.slot)) {
    next[holder.action] = { ...next[holder.action], [holder.slot]: '' };
  }

  return next;
}
