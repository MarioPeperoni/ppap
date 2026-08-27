import type { ReactElement } from 'react';
import { X } from 'lucide-react';
import type { HexColor } from '@/types';

interface PaletteSwatchProps {
  color: HexColor;
  onRemove: (color: HexColor) => void;
}

export function PaletteSwatch({ color, onRemove }: PaletteSwatchProps): ReactElement {
  return (
    <span className="group relative flex">
      <span
        title={color}
        style={{ backgroundColor: color }}
        className="h-7 w-7 rounded-full ring-1 ring-line"
      />
      <button
        type="button"
        aria-label={`remove ${color}`}
        onClick={() => {
          onRemove(color);
        }}
        className="pointer-events-none absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-raised text-muted opacity-0 ring-1 ring-line transition group-hover:pointer-events-auto group-hover:opacity-100 hover:text-ink"
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </span>
  );
}
