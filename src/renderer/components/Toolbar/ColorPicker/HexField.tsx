import type { ReactElement } from 'react';

interface HexFieldProps {
  value: string;
  onChange: (text: string) => void;
}

export function HexField({ value, onChange }: HexFieldProps): ReactElement {
  return (
    <input
      type="text"
      aria-label="hex colour"
      spellCheck={false}
      value={value}
      onChange={(event) => {
        onChange(event.target.value.trim().toLowerCase());
      }}
      className="min-w-0 flex-1 rounded-md bg-raised px-2 py-1 font-mono text-[11px] text-ink outline-none focus:ring-1 focus:ring-line"
    />
  );
}
