import type { ReactElement } from 'react';
import { Plus } from 'lucide-react';
import { MAX_SAVED_PALETTES } from '@/constants/color.constants';
import { PaletteCard } from '@/renderer/components/Palettes/PaletteCard';
import type { SavedPalette } from '@/types';

interface PaletteListProps {
  palettes: SavedPalette[];
  selectedId: string | null;
  carriedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export function PaletteList({
  palettes,
  selectedId,
  carriedId,
  onSelect,
  onCreate,
}: PaletteListProps): ReactElement {
  return (
    <div className="flex w-56 shrink-0 flex-col gap-2 border-r border-line pr-4">
      <div className="-mr-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {palettes.map((palette) => (
          <PaletteCard
            key={palette.id}
            palette={palette}
            selected={palette.id === selectedId}
            carried={palette.id === carriedId}
            onSelect={onSelect}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={palettes.length >= MAX_SAVED_PALETTES}
        onClick={onCreate}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-raised px-2.5 py-1.5 text-[12px] text-muted transition-colors hover:bg-line hover:text-ink disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus size={14} strokeWidth={2} />
        New palette
      </button>
    </div>
  );
}
