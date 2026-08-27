import type { ReactElement } from 'react';
import { useToolStore } from '@/renderer/stores/tool.store';
import { colorFill } from '@/renderer/theme/color-fill';

export function ToolColorBar(): ReactElement {
  const color = useToolStore((state) => state.color);
  const swapColor = useToolStore((state) => state.swapColor);

  return (
    <span className="pointer-events-none absolute bottom-1 flex h-1 w-5 gap-px">
      <span
        className="grow-65 rounded-full transition-colors"
        style={{ backgroundColor: colorFill(color) }}
      />
      {swapColor === null ? null : (
        <span
          className="grow-35 rounded-full transition-colors"
          style={{ backgroundColor: colorFill(swapColor) }}
        />
      )}
    </span>
  );
}
