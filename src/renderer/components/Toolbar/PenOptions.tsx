import type { ReactElement } from 'react';
import { TOOL_SIZES } from '@/constants/tool.constants';
import { ColorPanel } from '@/renderer/components/Toolbar/ColorPanel';
import { useToolStore } from '@/renderer/stores/tool.store';
import { SELECTION_RING } from '@/renderer/theme/selection-ring';
import type { SizeToken } from '@/types';

const DOT_CLASS: Record<SizeToken, string> = {
  s: 'h-1.5 w-1.5',
  m: 'h-2.5 w-2.5',
  l: 'h-4 w-4',
};

export function PenOptions(): ReactElement {
  const penSize = useToolStore((state) => state.penSize);
  const setPenSize = useToolStore((state) => state.setPenSize);

  return (
    <div className="flex w-46 flex-col gap-3">
      <ColorPanel />
      <div className="flex items-center gap-2">
        {TOOL_SIZES.map((token) => (
          <button
            key={token}
            type="button"
            aria-label={`width ${token}`}
            aria-pressed={token === penSize}
            onClick={() => {
              setPenSize(token);
            }}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-shadow ${
              SELECTION_RING[token === penSize ? 'selected' : 'idle']
            }`}
          >
            <span className={`rounded-full bg-ink ${DOT_CLASS[token]}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
