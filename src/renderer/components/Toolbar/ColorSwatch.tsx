import type { ReactElement } from 'react';
import { isHexColor } from '@/core/color/srgb';
import type { ColorToken, StrokeColor } from '@/types';

const TOKEN_CLASS: Record<ColorToken, string> = {
  ink: 'bg-ink',
  blue: 'bg-blue',
  red: 'bg-red',
  green: 'bg-green',
};

interface ColorSwatchProps {
  color: StrokeColor;
  selected: boolean;
  onSelect: (color: StrokeColor) => void;
}

export function ColorSwatch({ color, selected, onSelect }: ColorSwatchProps): ReactElement {
  const custom = isHexColor(color);

  return (
    <button
      type="button"
      aria-label={color}
      onClick={() => {
        onSelect(color);
      }}
      style={custom ? { backgroundColor: color } : undefined}
      className={`h-6 w-6 rounded-full ${custom ? '' : TOKEN_CLASS[color]} ${
        selected ? 'ring-2 ring-ink/60' : 'ring-1 ring-line'
      }`}
    />
  );
}
