import type { ReactElement } from 'react';
import { useDragRatio } from '@/renderer/hooks/use-drag-ratio';
import type { Hsv } from '@/types';

const SHADING =
  'linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, transparent)';

interface SaturationFieldProps {
  hsv: Hsv;
  onChange: (saturation: number, value: number) => void;
}

export function SaturationField({ hsv, onChange }: SaturationFieldProps): ReactElement {
  const drag = useDragRatio((x, y) => {
    onChange(x, 1 - y);
  });

  return (
    <div
      aria-label="saturation and brightness"
      className="relative min-h-28 w-full flex-1 cursor-crosshair touch-none rounded-lg"
      style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)`, backgroundImage: SHADING }}
      {...drag}
    >
      <span
        className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
        style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
      />
    </div>
  );
}
