import type { ReactElement } from 'react';
import { FONT_FAMILIES, FONT_LABELS, FONT_TOKENS } from '@/constants/text.constants';
import { useToolStore } from '@/renderer/stores/tool.store';
import { SELECTION_RING } from '@/renderer/theme/selection-ring';

export function FontPicker(): ReactElement {
  const textFont = useToolStore((state) => state.textFont);
  const setTextFont = useToolStore((state) => state.setTextFont);

  return (
    <div className="flex items-center gap-2">
      {FONT_TOKENS.map((token) => (
        <button
          key={token}
          type="button"
          aria-label={`${FONT_LABELS[token]} font`}
          aria-pressed={token === textFont}
          onClick={() => {
            setTextFont(token);
          }}
          style={{ fontFamily: FONT_FAMILIES[token] }}
          className={`h-9 flex-1 rounded-lg text-base leading-none transition-shadow ${
            SELECTION_RING[token === textFont ? 'selected' : 'idle']
          }`}
        >
          Ag
        </button>
      ))}
    </div>
  );
}
