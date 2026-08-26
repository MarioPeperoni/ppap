import type { ReactElement } from 'react';
import { Minus, Square, X } from 'lucide-react';

const BUTTON_CLASS =
  'flex h-9 w-11 items-center justify-center text-muted transition-colors hover:bg-raised';

export function WindowControls(): ReactElement {
  return (
    <div className="app-no-drag flex items-center">
      <button
        type="button"
        aria-label="Minimise"
        onClick={() => {
          window.ppap.window.minimize();
        }}
        className={`${BUTTON_CLASS} hover:text-ink`}
      >
        <Minus size={14} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Maximise"
        onClick={() => {
          window.ppap.window.toggleMaximize();
        }}
        className={`${BUTTON_CLASS} hover:text-ink`}
      >
        <Square size={12} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Close"
        onClick={() => {
          window.ppap.window.close();
        }}
        className={`${BUTTON_CLASS} hover:bg-red hover:text-white`}
      >
        <X size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
