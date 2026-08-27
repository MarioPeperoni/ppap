import type { SelectionState } from '@/types';

/** The outline carries the state, so the button keeps showing what it stands for. */
export const SELECTION_RING: Record<SelectionState, string> = {
  idle: 'ring-1 ring-line hover:ring-muted',
  selected: 'ring-1 ring-line outline-1 outline-offset-2 outline-muted',
  paired: 'ring-1 ring-line outline-1 outline-offset-2 outline-dashed outline-muted',
};
