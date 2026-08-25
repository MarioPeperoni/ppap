import type { ReactElement } from 'react';
import { Minus, Plus } from 'lucide-react';
import { MAX_ZOOM, MIN_ZOOM } from '@/constants/camera.constants';
import { ZoomStep } from '@/renderer/components/ZoomIndicator/ZoomStep';
import { useBoardStore } from '@/renderer/stores/board.store';

interface ZoomIndicatorProps {
  onReset: () => void;
  onStep: (direction: number) => void;
}

export function ZoomIndicator({ onReset, onStep }: ZoomIndicatorProps): ReactElement {
  const zoom = useBoardStore((state) => state.camera.zoom);

  return (
    <div className="absolute right-4 bottom-4 flex items-center gap-0.5 text-[11px] text-muted">
      <ZoomStep
        label="Zoom out"
        disabled={zoom <= MIN_ZOOM}
        onClick={() => {
          onStep(-1);
        }}
      >
        <Minus size={14} strokeWidth={1.75} />
      </ZoomStep>

      <button
        type="button"
        onClick={onReset}
        className="min-w-12 rounded-lg py-1 text-center tabular-nums transition-colors hover:text-ink"
      >
        {Math.round(zoom * 100)}%
      </button>

      <ZoomStep
        label="Zoom in"
        disabled={zoom >= MAX_ZOOM}
        onClick={() => {
          onStep(1);
        }}
      >
        <Plus size={14} strokeWidth={1.75} />
      </ZoomStep>
    </div>
  );
}
