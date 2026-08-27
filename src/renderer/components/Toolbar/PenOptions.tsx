import type { ReactElement } from 'react';
import { SIZE_LABELS, TOOL_SIZES } from '@/constants/tool.constants';
import { ColorPanel } from '@/renderer/components/Toolbar/ColorPanel';
import { StepSlider } from '@/renderer/components/Toolbar/StepSlider';
import { useToolStore } from '@/renderer/stores/tool.store';
import type { SizeToken } from '@/types';

export function PenOptions(): ReactElement {
  const penSize = useToolStore((state) => state.penSize);
  const setPenSize = useToolStore((state) => state.setPenSize);

  return (
    <div className="flex w-46 flex-col gap-3">
      <ColorPanel />
      <StepSlider
        label="Width"
        steps={TOOL_SIZES}
        value={penSize}
        valueText={(size: SizeToken) => SIZE_LABELS[size]}
        onChange={setPenSize}
      />
    </div>
  );
}
