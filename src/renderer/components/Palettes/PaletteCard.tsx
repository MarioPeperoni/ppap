import type { ReactElement } from 'react';
import type { SavedPalette } from '@/types';

interface PaletteCardProps {
  palette: SavedPalette;
  selected: boolean;
  carried: boolean;
  onSelect: (id: string) => void;
}

export function PaletteCard({
  palette,
  selected,
  carried,
  onSelect,
}: PaletteCardProps): ReactElement {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => {
        onSelect(palette.id);
      }}
      className={`flex w-full flex-col items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
        selected ? 'bg-raised text-ink' : 'text-muted hover:bg-raised/60 hover:text-ink'
      }`}
    >
      <span className="flex w-full items-center gap-1.5">
        <span className="truncate text-[12px]">{palette.name}</span>
        {carried ? (
          <span className="ml-auto flex shrink-0 items-center gap-1 text-[10px] text-green">
            <span className="h-2 w-2 rounded-full bg-current" />
            Active
          </span>
        ) : null}
      </span>
      <span className="flex items-center gap-1">
        {palette.colors.length === 0 ? (
          <span className="text-[11px] text-muted">Empty</span>
        ) : (
          palette.colors.map((color) => (
            <span
              key={color}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))
        )}
      </span>
    </button>
  );
}
