import type { ReactElement } from 'react';
import { TEXT_SIZE_LABELS } from '@/constants/text.constants';
import { TOOL_SIZES } from '@/constants/tool.constants';
import { ColorPanel } from '@/renderer/components/Toolbar/ColorPanel';
import { FontPicker } from '@/renderer/components/Toolbar/FontPicker';
import { StepSlider } from '@/renderer/components/Toolbar/StepSlider';
import { useToolStore } from '@/renderer/stores/tool.store';
import type { SizeToken } from '@/types';

export function TextOptions(): ReactElement {
  const textSize = useToolStore((state) => state.textSize);
  const setTextSize = useToolStore((state) => state.setTextSize);

  return (
    <div className="flex w-46 flex-col gap-3">
      <ColorPanel />
      <FontPicker />
      <StepSlider
        label="Size"
        steps={TOOL_SIZES}
        value={textSize}
        valueText={(size: SizeToken) => TEXT_SIZE_LABELS[size]}
        onChange={setTextSize}
      />
    </div>
  );
}
