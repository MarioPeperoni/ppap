import { create } from 'zustand';
import type { Folder } from '@/types';

interface FolderStore {
  folders: readonly Folder[];
  currentId: string | null;
  renamingId: string | null;
  refresh: () => Promise<void>;
  open: (id: string | null) => void;
  adopt: (folder: Folder) => void;
  rename: (id: string, name: string) => void;
  drop: (id: string) => void;
  setRenaming: (id: string | null) => void;
}

export const useFolderStore = create<FolderStore>()((set, get) => ({
  folders: [],
  currentId: null,
  renamingId: null,

  refresh: async () => {
    set({ folders: await window.ppap.folders.list() });
  },

  open: (currentId) => {
    set({ currentId });
  },

  adopt: (folder) => {
    set({ folders: [...get().folders, folder] });
  },

  rename: (id, name) => {
    set({
      folders: get().folders.map((folder) => (folder.id === id ? { ...folder, name } : folder)),
    });
  },

  drop: (id) => {
    const { folders, currentId } = get();

    set({
      folders: folders.filter((folder) => folder.id !== id),
      currentId: currentId === id ? null : currentId,
    });
  },

  setRenaming: (renamingId) => {
    set({ renamingId });
  },
}));
