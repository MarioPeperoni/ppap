import type { ReactElement } from 'react';

interface ChoicesProps<T extends string> {
  label: string;
  values: readonly T[];
  labels: Record<T, string>;
  active: T;
  onSelect: (value: T) => void;
}

export function Choices<T extends string>({
  label,
  values,
  labels,
  active,
  onSelect,
}: ChoicesProps<T>): ReactElement {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-muted">{label}</span>
      <div className="flex gap-1 rounded-lg bg-raised p-0.5">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              onSelect(value);
            }}
            className={`rounded-md px-2.5 py-1 text-[12px] transition-colors ${
              value === active ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {labels[value]}
          </button>
        ))}
      </div>
    </div>
  );
}
