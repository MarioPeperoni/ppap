import { create } from 'zustand';
import type { ToolId } from '@/types';

interface UiStore {
  openPopover: ToolId | null;
  togglePopover: (tool: ToolId) => void;
  setPopover: (tool: ToolId | null) => void;
}

export const useUiStore = create<UiStore>()((set, get) => ({
  openPopover: null,

  togglePopover: (tool) => {
    set({ openPopover: get().openPopover === tool ? null : tool });
  },

  setPopover: (openPopover) => {
    set({ openPopover });
  },
}));
