import type { ReactElement } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { ACTION_LABELS, DEFAULT_KEYMAP } from '@/constants/keymap.constants';
import { KeyCapture } from '@/renderer/components/Settings/Keymap/KeyCapture';
import type { ActionId, BindVerdict, KeyStroke } from '@/types';

const ICON_CLASS =
  'flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-raised hover:text-ink disabled:pointer-events-none disabled:opacity-30';

function noteText(verdict: BindVerdict): string | null {
  switch (verdict.kind) {
    case 'fixed':
      return `Reserved for ${verdict.owner}`;
    case 'overrides':
      return `Overrides ${verdict.owner}`;
    case 'steals':
      return `Taken from ${ACTION_LABELS[verdict.owner]}`;
    case 'ok':
      return null;
  }
}

interface KeymapRowProps {
  action: ActionId;
  stroke: KeyStroke;
  armed: boolean;
  note: BindVerdict | null;
  onArm: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function KeymapRow({
  action,
  stroke,
  armed,
  note,
  onArm,
  onClear,
  onReset,
}: KeymapRowProps): ReactElement {
  const message = note === null ? null : noteText(note);

  return (
    <div className="flex flex-col gap-0.5 py-0.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] text-ink">{ACTION_LABELS[action]}</span>
        <div className="flex items-center gap-1">
          <KeyCapture stroke={stroke} armed={armed} onArm={onArm} />
          <button
            type="button"
            aria-label={`Clear ${ACTION_LABELS[action]}`}
            disabled={stroke === ''}
            onClick={onClear}
            className={ICON_CLASS}
          >
            <X size={13} strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label={`Reset ${ACTION_LABELS[action]}`}
            disabled={stroke === DEFAULT_KEYMAP[action]}
            onClick={onReset}
            className={ICON_CLASS}
          >
            <RotateCcw size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
      {message === null ? null : (
        <span className="text-right text-[11px] text-muted">{message}</span>
      )}
    </div>
  );
}
