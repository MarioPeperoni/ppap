import type { ReactElement } from 'react';
import { TOOL_COLORS } from '@/constants/tool.constants';
import { ColorSwatch } from '@/renderer/components/Toolbar/ColorSwatch';
import { PaletteButton } from '@/renderer/components/Toolbar/PaletteButton';
import { useActivePalette } from '@/renderer/hooks/use-active-palette';
import { useToolStore } from '@/renderer/stores/tool.store';

export function ColorPanel(): ReactElement {
  const color = useToolStore((state) => state.color);
  const swapColor = useToolStore((state) => state.swapColor);
  const setColor = useToolStore((state) => state.setColor);
  const pairColor = useToolStore((state) => state.pairColor);
  const palette = useActivePalette();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {TOOL_COLORS.map((token) => (
          <ColorSwatch
            key={token}
            color={token}
            selected={token === color}
            paired={token === swapColor}
            onSelect={setColor}
            onPair={pairColor}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {palette?.colors.map((carried) => (
          <ColorSwatch
            key={carried}
            color={carried}
            selected={carried === color}
            paired={carried === swapColor}
            onSelect={setColor}
            onPair={pairColor}
          />
        ))}
        <PaletteButton name={palette?.name ?? null} />
      </div>
    </div>
  );
}
