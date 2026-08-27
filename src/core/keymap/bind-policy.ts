import { FIXED_LABELS, SHORTCUT_LABELS } from '@/constants/keymap.constants';
import { findTarget } from '@/core/keymap/keymap-lookup';
import type { BindTarget, BindVerdict, Keymap, KeyStroke } from '@/types';

export function judgeStroke(keymap: Keymap, target: BindTarget, stroke: KeyStroke): BindVerdict {
  const fixed = FIXED_LABELS[stroke];
  if (fixed !== undefined) return { kind: 'fixed', owner: fixed };

  const holder = findTarget(keymap, stroke);
  if (holder !== undefined && holder.action !== target.action) {
    return { kind: 'steals', owner: holder.action };
  }

  const shortcut = SHORTCUT_LABELS[stroke];
  if (shortcut !== undefined) return { kind: 'overrides', owner: shortcut };

  return { kind: 'ok' };
}
