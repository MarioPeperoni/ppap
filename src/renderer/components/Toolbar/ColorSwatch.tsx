import type { ReactElement } from 'react';
import { colorFill } from '@/renderer/theme/color-fill';
import type { StrokeColor } from '@/types';

const IDLE_RING = 'ring-1 ring-line hover:ring-muted';
const ACTIVE_RING = 'ring-2 ring-ink/60';
const PAIRED_RING = 'ring-1 ring-line outline-2 outline-offset-2 outline-dashed outline-ink/45';

interface ColorSwatchProps {
  color: StrokeColor;
  selected: boolean;
  paired: boolean;
  onSelect: (color: StrokeColor) => void;
  onPair: (color: StrokeColor) => void;
}

export function ColorSwatch({
  color,
  selected,
  paired,
  onSelect,
  onPair,
}: ColorSwatchProps): ReactElement {
  const ring = selected ? ACTIVE_RING : paired ? PAIRED_RING : IDLE_RING;

  return (
    <button
      type="button"
      aria-label={color}
      aria-pressed={selected}
      onClick={(event) => {
        if (event.shiftKey) onPair(color);
        else onSelect(color);
      }}
      style={{ backgroundColor: colorFill(color) }}
      className={`h-6 w-6 rounded-full transition-shadow ${ring}`}
    />
  );
}
