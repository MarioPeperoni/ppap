import type { ReactElement } from 'react';
import { X } from 'lucide-react';
import { formatStroke } from '@/core/keymap/key-stroke';
import type { KeyStroke } from '@/types';

interface KeyCaptureProps {
  name: string;
  stroke: KeyStroke;
  armed: boolean;
  onArm: () => void;
  onClear: () => void;
}

export function KeyCapture({ name, stroke, armed, onArm, onClear }: KeyCaptureProps): ReactElement {
  const label = stroke === '' ? 'Not set' : formatStroke(stroke, window.ppap.platform);

  return (
    <div
      className={`grid shrink-0 grid-cols-[1.25rem_4.75rem_1.25rem] items-center rounded-md bg-raised transition-colors ${
        armed ? 'ring-1 ring-ink/30' : ''
      }`}
    >
      <button
        type="button"
        aria-label={`${name} key`}
        title={label}
        onClick={onArm}
        className={`col-span-2 truncate py-1 pl-5 text-center font-mono text-[12px] transition-colors ${
          armed ? 'text-ink' : 'text-muted hover:text-ink'
        }`}
      >
        {armed ? 'Press…' : label}
      </button>
      <button
        type="button"
        aria-label={`Clear the ${name} key`}
        disabled={stroke === ''}
        onClick={onClear}
        className="flex h-6 items-center justify-center rounded-r-md text-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-25"
      >
        <X size={11} strokeWidth={2.25} />
      </button>
    </div>
  );
}
