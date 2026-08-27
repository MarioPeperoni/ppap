import { useEffect, useRef, useState, type ReactElement } from 'react';
import { INK_TOOLS } from '@/constants/tool.constants';
import { useToolStore } from '@/renderer/stores/tool.store';
import { useUiStore } from '@/renderer/stores/ui.store';
import { colorFill } from '@/renderer/theme/color-fill';
import type { ColorCue, Point } from '@/types';

const CURSOR_GAP = 4;

export function ColorFlash(): ReactElement | null {
  const pointer = useRef<Point | null>(null);
  const nextId = useRef(0);
  const [cue, setCue] = useState<ColorCue | null>(null);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      pointer.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  useEffect(
    () =>
      useToolStore.subscribe((state, previous) => {
        const at = pointer.current;
        if (state.color === previous.color || at === null) return;
        if (!INK_TOOLS.includes(state.tool) || useUiStore.getState().openPopover !== null) return;

        nextId.current += 1;
        setCue({ id: nextId.current, at, color: state.color });
      }),
    [],
  );

  if (cue === null) return null;

  return (
    <span
      key={cue.id}
      style={{ left: cue.at.x + CURSOR_GAP, top: cue.at.y - CURSOR_GAP }}
      className="pointer-events-none fixed z-50 -translate-y-full"
    >
      <span
        onAnimationEnd={() => {
          setCue(null);
        }}
        style={{ backgroundColor: colorFill(cue.color) }}
        className="block h-3.5 w-3.5 animate-color-flash rounded-full shadow-sm ring-3 ring-canvas"
      />
    </span>
  );
}
