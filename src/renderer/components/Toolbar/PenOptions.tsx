import type { ReactElement } from 'react';
import { TOOL_COLORS, TOOL_SIZES } from '@/constants/tool.constants';
import { useToolStore } from '@/renderer/stores/tool.store';
import type { ColorToken, SizeToken } from '@/types';

const SWATCH_CLASS: Record<ColorToken, string> = {
  ink: 'bg-ink',
  blue: 'bg-blue',
  red: 'bg-red',
  green: 'bg-green',
};

const DOT_CLASS: Record<SizeToken, string> = {
  s: 'h-1.5 w-1.5',
  m: 'h-2.5 w-2.5',
  l: 'h-4 w-4',
};

function ring(selected: boolean): string {
  return selected ? 'ring-2 ring-ink/60' : 'ring-1 ring-line';
}

export function PenOptions(): ReactElement {
  const color = useToolStore((state) => state.color);
  const penSize = useToolStore((state) => state.penSize);
  const setColor = useToolStore((state) => state.setColor);
  const setPenSize = useToolStore((state) => state.setPenSize);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {TOOL_COLORS.map((token) => (
          <button
            key={token}
            type="button"
            aria-label={token}
            onClick={() => {
              setColor(token);
            }}
            className={`h-6 w-6 rounded-full ${SWATCH_CLASS[token]} ${ring(token === color)}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        {TOOL_SIZES.map((token) => (
          <button
            key={token}
            type="button"
            aria-label={`width ${token}`}
            onClick={() => {
              setPenSize(token);
            }}
            className={`flex h-6 w-6 items-center justify-center rounded-full ${ring(token === penSize)}`}
          >
            <span className={`rounded-full bg-ink ${DOT_CLASS[token]}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
