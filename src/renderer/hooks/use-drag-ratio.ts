import { useCallback, type PointerEvent } from 'react';
import type { DragRatioHandlers } from '@/types';

function ratio(value: number, span: number): number {
  return Math.min(1, Math.max(0, value / span));
}

export function useDragRatio(onDrag: (x: number, y: number) => void): DragRatioHandlers {
  const report = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();

      onDrag(
        ratio(event.clientX - bounds.left, bounds.width),
        ratio(event.clientY - bounds.top, bounds.height),
      );
    },
    [onDrag],
  );

  return {
    onPointerDown: (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      report(event);
    },
    onPointerMove: (event) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

      report(event);
    },
  };
}
