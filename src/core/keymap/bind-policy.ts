import { FIXED_LABELS, SHORTCUT_LABELS } from '@/constants/keymap.constants';
import { findAction } from '@/core/keymap/keymap-lookup';
import type { ActionId, BindVerdict, Keymap, KeyStroke } from '@/types';

export function judgeStroke(keymap: Keymap, action: ActionId, stroke: KeyStroke): BindVerdict {
  const fixed = FIXED_LABELS[stroke];
  if (fixed !== undefined) return { kind: 'fixed', owner: fixed };

  const holder = findAction(keymap, stroke);
  if (holder !== undefined && holder !== action) return { kind: 'steals', owner: holder };

  const shortcut = SHORTCUT_LABELS[stroke];
  if (shortcut !== undefined) return { kind: 'overrides', owner: shortcut };

  return { kind: 'ok' };
}
