import { create } from 'zustand';
import type { TextDraft } from '@/types';

interface TextStore {
  draft: TextDraft | null;
  begin: (draft: TextDraft) => void;
  type: (text: string) => void;
  close: () => void;
}

export const useTextStore = create<TextStore>()((set, get) => ({
  draft: null,

  begin: (draft) => {
    set({ draft });
  },

  type: (text) => {
    const { draft } = get();
    if (draft === null) return;

    set({ draft: { ...draft, text } });
  },

  close: () => {
    set({ draft: null });
  },
}));
