import { create } from 'zustand';
import { DEFAULT_KEYMAP } from '@/constants/keymap.constants';
import { judgeStroke } from '@/core/keymap/bind-policy';
import { assignStroke } from '@/core/keymap/keymap-lookup';
import type { ActionId, BindVerdict, Keymap, KeyStroke, Settings } from '@/types';

interface KeymapStore {
  keymap: Keymap;
  adopt: (settings: Settings) => void;
  bind: (action: ActionId, stroke: KeyStroke) => BindVerdict;
  clear: (action: ActionId) => void;
  reset: (action: ActionId) => void;
  resetAll: () => void;
}

export const useKeymapStore = create<KeymapStore>()((set, get) => ({
  keymap: DEFAULT_KEYMAP,

  adopt: ({ keymap }) => {
    set({ keymap });
  },

  bind: (action, stroke) => {
    const { keymap } = get();
    const verdict = judgeStroke(keymap, action, stroke);

    if (verdict.kind !== 'fixed') set({ keymap: assignStroke(keymap, action, stroke) });

    return verdict;
  },

  clear: (action) => {
    set({ keymap: { ...get().keymap, [action]: '' } });
  },

  reset: (action) => {
    set({ keymap: assignStroke(get().keymap, action, DEFAULT_KEYMAP[action]) });
  },

  resetAll: () => {
    set({ keymap: DEFAULT_KEYMAP });
  },
}));
