import type { ReactElement } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  ACTION_LABELS,
  BIND_SLOTS,
  DEFAULT_KEYMAP,
  SLOT_LABELS,
} from '@/constants/keymap.constants';
import { sameBinding } from '@/core/keymap/key-binding';
import { KeyCapture } from '@/renderer/components/Settings/Keymap/KeyCapture';
import type { ActionId, BindSlot, BindVerdict, KeyBinding } from '@/types';

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
  binding: KeyBinding;
  armed: BindSlot | null;
  note: BindVerdict | null;
  onArm: (slot: BindSlot) => void;
  onClear: (slot: BindSlot) => void;
  onReset: () => void;
}

export function KeymapRow({
  action,
  binding,
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
        <span className="min-w-0 flex-1 truncate text-[12px] text-ink">
          {ACTION_LABELS[action]}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {BIND_SLOTS.map((slot) => (
            <KeyCapture
              key={slot}
              name={`${ACTION_LABELS[action]} ${SLOT_LABELS[slot].toLowerCase()}`}
              stroke={binding[slot]}
              armed={armed === slot}
              onArm={() => {
                onArm(slot);
              }}
              onClear={() => {
                onClear(slot);
              }}
            />
          ))}
          <button
            type="button"
            aria-label={`Reset ${ACTION_LABELS[action]}`}
            disabled={sameBinding(binding, DEFAULT_KEYMAP[action])}
            onClick={onReset}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-raised hover:text-ink disabled:pointer-events-none disabled:opacity-30"
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
