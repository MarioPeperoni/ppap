import { useState, type ReactElement } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { PaletteEditor } from '@/renderer/components/Palettes/PaletteEditor';
import { PaletteList } from '@/renderer/components/Palettes/PaletteList';
import { usePaletteStore } from '@/renderer/stores/palette.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import { useUiStore } from '@/renderer/stores/ui.store';

export function PaletteLibraryDialog(): ReactElement {
  const open = useUiStore((state) => state.paletteLibraryOpen);
  const setOpen = useUiStore((state) => state.setPaletteLibrary);
  const palettes = usePaletteStore((state) => state.palettes);
  const createPalette = usePaletteStore((state) => state.createPalette);
  const carriedId = useToolStore((state) => state.activePaletteId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = palettes.find((palette) => palette.id === selectedId) ?? palettes[0] ?? null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 flex h-[30rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-line bg-surface p-5 shadow-xl">
          <Dialog.Title className="text-[13px] font-medium text-ink">Palettes</Dialog.Title>
          <Dialog.Description className="sr-only">
            Your own colour palettes, and the one the pen carries
          </Dialog.Description>

          <div className="mt-4 flex min-h-0 flex-1">
            <PaletteList
              palettes={palettes}
              selectedId={selected?.id ?? null}
              carriedId={carriedId}
              onSelect={setSelectedId}
              onCreate={() => {
                const palette = createPalette();
                if (palette !== null) setSelectedId(palette.id);
              }}
            />
            {selected === null ? (
              <p className="flex flex-1 items-center justify-center text-[12px] text-muted">
                Make a palette and fill it with up to six colours.
              </p>
            ) : (
              <PaletteEditor
                palette={selected}
                onUsed={() => {
                  setOpen(false);
                }}
                onDeleted={() => {
                  setSelectedId(null);
                }}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
