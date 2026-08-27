import type { ReactElement } from 'react';
import { ERASER_RADII } from '@/constants/tool.constants';
import { useToolStore } from '@/renderer/stores/tool.store';
import { SELECTION_RING } from '@/renderer/theme/selection-ring';

export function EraserOptions(): ReactElement {
  const eraserRadius = useToolStore((state) => state.eraserRadius);
  const setEraserRadius = useToolStore((state) => state.setEraserRadius);

  return (
    <div className="flex items-center gap-2">
      {ERASER_RADII.map((radius) => (
        <button
          key={radius}
          type="button"
          aria-label={`radius ${radius}`}
          aria-pressed={radius === eraserRadius}
          onClick={() => {
            setEraserRadius(radius);
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-shadow ${
            SELECTION_RING[radius === eraserRadius ? 'selected' : 'idle']
          }`}
        >
          <span
            className="rounded-full bg-ink/70"
            style={{ width: radius / 2, height: radius / 2 }}
          />
        </button>
      ))}
    </div>
  );
}
