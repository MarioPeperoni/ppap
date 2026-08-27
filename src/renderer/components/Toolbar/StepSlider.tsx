import type { ReactElement } from 'react';

interface StepSliderProps<T> {
  label: string;
  steps: readonly T[];
  value: T;
  valueText: (step: T) => string;
  onChange: (step: T) => void;
}

export function StepSlider<T>({
  label,
  steps,
  value,
  valueText,
  onChange,
}: StepSliderProps<T>): ReactElement {
  const last = steps.length - 1;
  const index = Math.max(steps.indexOf(value), 0);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] text-muted">{label}</span>
        <span className="text-[11px] text-ink">{valueText(value)}</span>
      </div>
      <div className="relative flex h-3.5 items-center">
        <div className="pointer-events-none absolute inset-x-1.75 flex h-3 items-center">
          <span className="step-track h-3 w-full bg-muted/30" />
          {steps.map((step, tick) => (
            <span
              key={valueText(step)}
              style={{ left: `${(tick / last) * 100}%` }}
              className={`absolute -translate-x-1/2 ${
                tick === 0 || tick === last ? 'h-3.5 w-px bg-muted/60' : 'h-3.5 w-0.5 bg-surface'
              }`}
            />
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={last}
          step={1}
          value={index}
          aria-label={label}
          aria-valuetext={valueText(value)}
          onChange={(event) => {
            const step = steps[event.target.valueAsNumber];
            if (step !== undefined) onChange(step);
          }}
          className="step-slider relative h-3.5 w-full"
        />
      </div>
    </div>
  );
}
