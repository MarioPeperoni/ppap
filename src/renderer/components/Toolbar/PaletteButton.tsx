import type { ReactElement } from 'react';
import { Palette } from 'lucide-react';
import { useUiStore } from '@/renderer/stores/ui.store';

interface PaletteButtonProps {
  name: string | null;
}

export function PaletteButton({ name }: PaletteButtonProps): ReactElement {
  const setPaletteLibrary = useUiStore((state) => state.setPaletteLibrary);
  const setPopover = useUiStore((state) => state.setPopover);

  return (
    <button
      type="button"
      aria-label="open the palettes"
      title={name ?? 'Palettes'}
      onClick={() => {
        setPopover(null);
        setPaletteLibrary(true);
      }}
      className="flex h-6 w-6 items-center justify-center rounded-full text-muted ring-1 ring-line transition-colors hover:text-ink hover:ring-muted"
    >
      <Palette size={13} strokeWidth={2} />
    </button>
  );
}
