import type { ReactElement } from 'react';
import { ERASER_RADII } from '@/constants/tool.constants';
import { useToolStore } from '@/renderer/stores/tool.store';

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
          onClick={() => {
            setEraserRadius(radius);
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-shadow ${
            radius === eraserRadius
              ? 'ring-1 ring-line outline-2 outline-offset-2 outline-ink/70'
              : 'ring-1 ring-line hover:ring-muted'
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
