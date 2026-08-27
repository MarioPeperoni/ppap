import { create } from 'zustand';
import { BIND_SLOTS, DEFAULT_KEYMAP } from '@/constants/keymap.constants';
import { judgeStroke } from '@/core/keymap/bind-policy';
import { assignStroke } from '@/core/keymap/keymap-lookup';
import type { ActionId, BindTarget, BindVerdict, Keymap, KeyStroke, Settings } from '@/types';

interface KeymapStore {
  keymap: Keymap;
  adopt: (settings: Settings) => void;
  bind: (target: BindTarget, stroke: KeyStroke) => BindVerdict;
  clear: (target: BindTarget) => void;
  reset: (action: ActionId) => void;
  resetAll: () => void;
}

export const useKeymapStore = create<KeymapStore>()((set, get) => ({
  keymap: DEFAULT_KEYMAP,

  adopt: ({ keymap }) => {
    set({ keymap });
  },

  bind: (target, stroke) => {
    const { keymap } = get();
    const verdict = judgeStroke(keymap, target, stroke);

    if (verdict.kind !== 'fixed') set({ keymap: assignStroke(keymap, target, stroke) });

    return verdict;
  },

  clear: ({ action, slot }) => {
    const { keymap } = get();

    set({ keymap: { ...keymap, [action]: { ...keymap[action], [slot]: '' } } });
  },

  reset: (action) => {
    const { keymap } = get();
    let next = keymap;

    for (const slot of BIND_SLOTS) {
      next = assignStroke(next, { action, slot }, DEFAULT_KEYMAP[action][slot]);
    }

    set({ keymap: next });
  },

  resetAll: () => {
    set({ keymap: DEFAULT_KEYMAP });
  },
}));
