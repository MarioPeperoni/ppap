import { HISTORY_LIMIT } from '@/constants/history.constants';
import type { Command, History, HistoryStep } from '@/types';

export const EMPTY_HISTORY: History = { past: [], future: [] };

export function record(history: History, command: Command, limit = HISTORY_LIMIT): History {
  const past = [...history.past, command];

  return { past: past.length > limit ? past.slice(past.length - limit) : past, future: [] };
}

export function undo(history: History): HistoryStep {
  const command = history.past[history.past.length - 1];
  if (command === undefined) return { history, command: null };

  return {
    history: { past: history.past.slice(0, -1), future: [command, ...history.future] },
    command,
  };
}

export function redo(history: History): HistoryStep {
  const command = history.future[0];
  if (command === undefined) return { history, command: null };

  return {
    history: { past: [...history.past, command], future: history.future.slice(1) },
    command,
  };
}
