import type { WheelAction } from '@/types';

/** The modifier does the job the bare wheel does not, so both are always within reach. */
export function wheelAction(preferred: WheelAction, modified: boolean): WheelAction {
  if (!modified) return preferred;

  return preferred === 'zoom' ? 'pan' : 'zoom';
}
