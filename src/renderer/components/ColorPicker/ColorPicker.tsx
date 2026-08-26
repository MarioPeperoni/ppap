import { useState, type ReactElement } from 'react';
import { PICKER_START } from '@/constants/color.constants';
import { hsvToRgb, rgbToHsv } from '@/core/color/hsv';
import { readableOn } from '@/core/color/ink-contrast';
import { hexToRgb, isHexColor, rgbToHex } from '@/core/color/srgb';
import { HexField } from '@/renderer/components/ColorPicker/HexField';
import { HueSlider } from '@/renderer/components/ColorPicker/HueSlider';
import { SaturationField } from '@/renderer/components/ColorPicker/SaturationField';
import type { HexColor, Hsv } from '@/types';

interface ColorPickerProps {
  disabled: boolean;
  onPick: (color: HexColor) => void;
}

export function ColorPicker({ disabled, onPick }: ColorPickerProps): ReactElement {
  const [hsv, setHsv] = useState<Hsv>(rgbToHsv(hexToRgb(PICKER_START)));
  const [text, setText] = useState<string>(PICKER_START);

  const hex = rgbToHex(hsvToRgb(hsv));

  const pickHsv = (next: Hsv): void => {
    setHsv(next);
    setText(rgbToHex(hsvToRgb(next)));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <SaturationField
        hsv={hsv}
        onChange={(s, v) => {
          pickHsv({ ...hsv, s, v });
        }}
      />
      <HueSlider
        hue={hsv.h}
        onChange={(h) => {
          pickHsv({ ...hsv, h });
        }}
      />
      <div className="flex items-center gap-2">
        <HexField
          value={text}
          onChange={(next) => {
            setText(next);
            if (isHexColor(next)) setHsv(rgbToHsv(hexToRgb(next)));
          }}
        />
        <button
          type="button"
          aria-label="keep the colour"
          disabled={disabled}
          onClick={() => {
            onPick(hex);
          }}
          style={{ backgroundColor: hex, color: readableOn(hex) }}
          className="flex-1 rounded-md py-1.5 text-[12px] font-medium ring-1 ring-line transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-30"
        >
          Add colour
        </button>
      </div>
    </div>
  );
}
