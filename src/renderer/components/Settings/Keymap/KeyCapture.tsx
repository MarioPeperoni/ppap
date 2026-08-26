import type { ReactElement } from 'react';
import { formatStroke } from '@/core/keymap/key-stroke';
import type { KeyStroke } from '@/types';

interface KeyCaptureProps {
  stroke: KeyStroke;
  armed: boolean;
  onArm: () => void;
}

export function KeyCapture({ stroke, armed, onArm }: KeyCaptureProps): ReactElement {
  const label = stroke === '' ? 'Not set' : formatStroke(stroke, window.ppap.platform);

  return (
    <button
      type="button"
      onClick={onArm}
      className={`min-w-20 rounded-md px-2.5 py-1 font-mono text-[12px] transition-colors ${
        armed
          ? 'bg-raised text-ink ring-1 ring-ink/30'
          : 'bg-raised text-muted hover:bg-line hover:text-ink'
      }`}
    >
      {armed ? 'Press a key' : label}
    </button>
  );
}
