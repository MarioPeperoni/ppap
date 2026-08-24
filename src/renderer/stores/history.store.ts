import { create } from 'zustand';
import { EMPTY_HISTORY, record, redo, undo } from '@/core/history/history-stack';
import type { Command, History } from '@/types';

interface HistoryStore {
  history: History;
  record: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

export const useHistoryStore = create<HistoryStore>()((set, get) => ({
  history: EMPTY_HISTORY,

  record: (command) => {
    set({ history: record(get().history, command) });
  },

  undo: () => {
    const step = undo(get().history);
    if (step.command === null) return;

    step.command.revert();
    set({ history: step.history });
  },

  redo: () => {
    const step = redo(get().history);
    if (step.command === null) return;

    step.command.apply();
    set({ history: step.history });
  },

  reset: () => {
    set({ history: EMPTY_HISTORY });
  },
}));
