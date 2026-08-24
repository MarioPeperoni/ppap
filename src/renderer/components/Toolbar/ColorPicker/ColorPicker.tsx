import { useState, type ReactElement } from 'react';
import { Check } from 'lucide-react';
import { PICKER_START } from '@/constants/color.constants';
import { hsvToRgb, rgbToHsv } from '@/core/color/hsv';
import { hexToRgb, isHexColor, rgbToHex } from '@/core/color/srgb';
import { HexField } from '@/renderer/components/Toolbar/ColorPicker/HexField';
import { HueSlider } from '@/renderer/components/Toolbar/ColorPicker/HueSlider';
import { SaturationField } from '@/renderer/components/Toolbar/ColorPicker/SaturationField';
import type { HexColor, Hsv } from '@/types';

interface ColorPickerProps {
  onChange: (color: HexColor) => void;
  onPick: (color: HexColor) => void;
}

export function ColorPicker({ onChange, onPick }: ColorPickerProps): ReactElement {
  const [hsv, setHsv] = useState<Hsv>(rgbToHsv(hexToRgb(PICKER_START)));
  const [text, setText] = useState<string>(PICKER_START);

  const hex = rgbToHex(hsvToRgb(hsv));

  const pickHsv = (next: Hsv): void => {
    const picked = rgbToHex(hsvToRgb(next));

    setHsv(next);
    setText(picked);
    onChange(picked);
  };

  return (
    <div className="flex flex-col gap-2">
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
            if (!isHexColor(next)) return;

            setHsv(rgbToHsv(hexToRgb(next)));
            onChange(next);
          }}
        />
        <button
          type="button"
          aria-label="keep the colour"
          onClick={() => {
            onPick(hex);
          }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-raised text-ink hover:bg-line"
        >
          <Check size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
