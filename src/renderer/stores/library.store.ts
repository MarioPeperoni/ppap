import { create } from 'zustand';
import { DEFAULT_SETTINGS } from '@/constants/settings.constants';
import type { BoardMeta, SortOrder } from '@/types';

interface LibraryStore {
  boards: readonly BoardMeta[];
  sortOrder: SortOrder;
  loading: boolean;
  refresh: () => Promise<void>;
  setSortOrder: (sortOrder: SortOrder) => void;
  adopt: (meta: BoardMeta) => void;
  drop: (id: string) => void;
}

export const useLibraryStore = create<LibraryStore>()((set, get) => ({
  boards: [],
  sortOrder: DEFAULT_SETTINGS.sortOrder,
  loading: true,

  refresh: async () => {
    try {
      set({ boards: await window.ppap.library.list() });
    } finally {
      set({ loading: false });
    }
  },

  setSortOrder: (sortOrder) => {
    set({ sortOrder });
  },

  adopt: (meta) => {
    const boards = get().boards;
    const known = boards.some((board) => board.id === meta.id);

    set({
      boards: known
        ? boards.map((board) => (board.id === meta.id ? meta : board))
        : [...boards, meta],
    });
  },

  drop: (id) => {
    set({ boards: get().boards.filter((board) => board.id !== id) });
  },
}));
