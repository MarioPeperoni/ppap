import { useState, type ReactElement } from 'react';
import { MAX_CUSTOM_COLORS, PICKER_START } from '@/constants/color.constants';
import { TOOL_COLORS } from '@/constants/tool.constants';
import { AddSwatch } from '@/renderer/components/Toolbar/AddSwatch';
import { ColorPicker } from '@/renderer/components/Toolbar/ColorPicker/ColorPicker';
import { ColorSwatch } from '@/renderer/components/Toolbar/ColorSwatch';
import { CustomSwatch } from '@/renderer/components/Toolbar/CustomSwatch';
import { useToolStore } from '@/renderer/stores/tool.store';
import type { HexColor } from '@/types';

export function ColorRow(): ReactElement {
  const color = useToolStore((state) => state.color);
  const customColors = useToolStore((state) => state.customColors);
  const swapColor = useToolStore((state) => state.swapColor);
  const setColor = useToolStore((state) => state.setColor);
  const pairColor = useToolStore((state) => state.pairColor);
  const addCustomColor = useToolStore((state) => state.addCustomColor);
  const removeCustomColor = useToolStore((state) => state.removeCustomColor);
  const [draft, setDraft] = useState<HexColor | null>(null);

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
      <div className="flex items-center gap-2">
        {customColors.map((custom) => (
          <CustomSwatch
            key={custom}
            color={custom}
            selected={custom === color}
            paired={custom === swapColor}
            onSelect={setColor}
            onPair={pairColor}
            onRemove={removeCustomColor}
          />
        ))}
        {customColors.length < MAX_CUSTOM_COLORS ? (
          <AddSwatch
            draft={draft}
            onClick={() => {
              setDraft(draft === null ? PICKER_START : null);
            }}
          />
        ) : null}
      </div>
      {draft === null ? null : (
        <ColorPicker
          onChange={setDraft}
          onPick={(picked) => {
            addCustomColor(picked);
            setDraft(null);
          }}
        />
      )}
    </div>
  );
}
