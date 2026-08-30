import type { ReactElement } from 'react';
import { useToolStore } from '@/renderer/stores/tool.store';
import { colorFill } from '@/renderer/theme/color-fill';

export function ToolColorBar(): ReactElement {
  const color = useToolStore((state) => state.color);
  const swapColor = useToolStore((state) => state.swapColor);

  return (
    <span className="pointer-events-none absolute bottom-1 flex h-1 w-5 animate-bar-in gap-px">
      <span
        className="grow-65 rounded-full transition-colors"
        style={{ backgroundColor: colorFill(color) }}
      />
      <span
        className={`rounded-full transition-[flex-grow,background-color] duration-200 ease-swift ${
          swapColor === null ? 'grow-0' : 'grow-35'
        }`}
        style={{ backgroundColor: swapColor === null ? undefined : colorFill(swapColor) }}
      />
    </span>
  );
}
