import { create } from 'zustand';
import type { Route, ToolId } from '@/types';

interface UiStore {
  route: Route;
  openPopover: ToolId | null;
  showLibrary: () => void;
  showBoard: () => void;
  togglePopover: (tool: ToolId) => void;
  setPopover: (tool: ToolId | null) => void;
}

export const useUiStore = create<UiStore>()((set, get) => ({
  route: 'library',
  openPopover: null,

  showLibrary: () => {
    set({ route: 'library', openPopover: null });
  },

  showBoard: () => {
    set({ route: 'board' });
  },

  togglePopover: (tool) => {
    set({ openPopover: get().openPopover === tool ? null : tool });
  },

  setPopover: (openPopover) => {
    set({ openPopover });
  },
}));
