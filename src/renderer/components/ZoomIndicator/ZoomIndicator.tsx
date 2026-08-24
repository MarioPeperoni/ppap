import type { ReactElement } from 'react';
import { useBoardStore } from '@/renderer/stores/board.store';

interface ZoomIndicatorProps {
  onReset: () => void;
}

export function ZoomIndicator({ onReset }: ZoomIndicatorProps): ReactElement {
  const zoom = useBoardStore((state) => state.camera.zoom);

  return (
    <button
      type="button"
      onClick={onReset}
      className="absolute right-4 bottom-4 rounded-lg px-2 py-1 text-[11px] text-muted tabular-nums hover:text-ink"
    >
      {Math.round(zoom * 100)}%
    </button>
  );
}
