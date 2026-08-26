import type { ReactElement } from 'react';
import { useDragRatio } from '@/renderer/hooks/use-drag-ratio';

const HUE_GRADIENT =
  'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)';

interface HueSliderProps {
  hue: number;
  onChange: (hue: number) => void;
}

export function HueSlider({ hue, onChange }: HueSliderProps): ReactElement {
  const drag = useDragRatio((x) => {
    onChange(x * 360);
  });

  return (
    <div
      aria-label="hue"
      className="relative h-3 w-full cursor-crosshair touch-none rounded-full"
      style={{ backgroundImage: HUE_GRADIENT }}
      {...drag}
    >
      <span
        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
        style={{ left: `${(hue / 360) * 100}%`, backgroundColor: `hsl(${hue} 100% 50%)` }}
      />
    </div>
  );
}
