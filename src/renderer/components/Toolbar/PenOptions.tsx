import type { ReactElement } from 'react';
import { TOOL_SIZES } from '@/constants/tool.constants';
import { ColorRow } from '@/renderer/components/Toolbar/ColorRow';
import { useToolStore } from '@/renderer/stores/tool.store';
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
    <div className="flex w-30 flex-col gap-3">
      <ColorRow />
      <div className="flex items-center gap-2">
        {TOOL_SIZES.map((token) => (
          <button
            key={token}
            type="button"
            aria-label={`width ${token}`}
            onClick={() => {
              setPenSize(token);
            }}
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              token === penSize ? 'ring-2 ring-ink/60' : 'ring-1 ring-line'
            }`}
          >
            <span className={`rounded-full bg-ink ${DOT_CLASS[token]}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
