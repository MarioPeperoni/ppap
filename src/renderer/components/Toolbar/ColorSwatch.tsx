import type { ReactElement } from 'react';
import { colorFill } from '@/renderer/theme/color-fill';
import { SELECTION_RING } from '@/renderer/theme/selection-ring';
import type { SelectionState, StrokeColor } from '@/types';

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
  const state: SelectionState = selected ? 'selected' : paired ? 'paired' : 'idle';

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
      className={`h-6 w-6 rounded-full transition-shadow ${SELECTION_RING[state]}`}
    />
  );
}
