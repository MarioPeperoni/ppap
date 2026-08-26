import type { ReactElement } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { MAX_CUSTOM_COLORS } from '@/constants/color.constants';
import { ColorPicker } from '@/renderer/components/ColorPicker/ColorPicker';
import { PaletteSwatch } from '@/renderer/components/Palettes/PaletteSwatch';
import { usePaletteStore } from '@/renderer/stores/palette.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import type { SavedPalette } from '@/types';

interface PaletteEditorProps {
  palette: SavedPalette;
  onUsed: () => void;
  onDeleted: () => void;
}

export function PaletteEditor({ palette, onUsed, onDeleted }: PaletteEditorProps): ReactElement {
  const renamePalette = usePaletteStore((state) => state.renamePalette);
  const addColor = usePaletteStore((state) => state.addColor);
  const removeColor = usePaletteStore((state) => state.removeColor);
  const deletePalette = usePaletteStore((state) => state.deletePalette);
  const carryPalette = useToolStore((state) => state.carryPalette);
  const carried = useToolStore((state) => state.activePaletteId) === palette.id;

  const full = palette.colors.length >= MAX_CUSTOM_COLORS;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 pl-4">
      <input
        type="text"
        aria-label="palette name"
        value={palette.name}
        onChange={(event) => {
          renamePalette(palette.id, event.target.value);
        }}
        className="rounded-md bg-raised px-2.5 py-1.5 text-[13px] text-ink outline-none focus:ring-1 focus:ring-line"
      />

      <div className="flex h-7 items-center gap-2">
        {palette.colors.length === 0 ? (
          <span className="text-[11px] text-muted">Pick a colour below to fill it.</span>
        ) : (
          palette.colors.map((color) => (
            <PaletteSwatch
              key={color}
              color={color}
              onRemove={(dropped) => {
                removeColor(palette.id, dropped);
              }}
            />
          ))
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-line pt-3">
        <ColorPicker
          disabled={full}
          onPick={(picked) => {
            addColor(palette.id, picked);
          }}
        />
      </div>

      <div className="flex items-center gap-2 border-t border-line pt-3">
        <button
          type="button"
          disabled={carried || palette.colors.length === 0}
          onClick={() => {
            carryPalette(palette.id);
            onUsed();
          }}
          className="flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-[12px] font-medium text-canvas transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-30"
        >
          <Check size={13} strokeWidth={2.5} />
          {carried ? 'Active' : 'Activate palette'}
        </button>
        <span className="text-[11px] text-muted">
          {palette.colors.length} of {MAX_CUSTOM_COLORS}
        </span>
        <button
          type="button"
          aria-label="delete this palette"
          onClick={() => {
            if (carried) carryPalette(null);
            deletePalette(palette.id);
            onDeleted();
          }}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-raised hover:text-ink"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
