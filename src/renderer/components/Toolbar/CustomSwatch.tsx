import type { ReactElement } from 'react';
import { X } from 'lucide-react';
import { ColorSwatch } from '@/renderer/components/Toolbar/ColorSwatch';
import type { HexColor, StrokeColor } from '@/types';

interface CustomSwatchProps {
  color: HexColor;
  selected: boolean;
  onSelect: (color: StrokeColor) => void;
  onRemove: (color: HexColor) => void;
}

export function CustomSwatch({
  color,
  selected,
  onSelect,
  onRemove,
}: CustomSwatchProps): ReactElement {
  return (
    <span className="group relative flex">
      <ColorSwatch color={color} selected={selected} onSelect={onSelect} />
      <button
        type="button"
        aria-label={`remove ${color}`}
        onClick={() => {
          onRemove(color);
        }}
        className="absolute -top-1 -right-1 hidden h-3.5 w-3.5 items-center justify-center rounded-full bg-raised text-muted ring-1 ring-line group-hover:flex hover:text-ink"
      >
        <X size={9} strokeWidth={2.5} />
      </button>
    </span>
  );
}
