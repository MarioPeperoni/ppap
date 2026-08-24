import { useEffect, useRef, type ReactElement } from 'react';

interface NameInputProps {
  value: string;
  className: string;
  onCommit: (name: string) => void;
  onCancel: () => void;
}

export function NameInput({ value, className, onCommit, onCancel }: NameInputProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  return (
    <input
      ref={inputRef}
      defaultValue={value}
      className={className}
      onBlur={(event) => {
        const name = event.target.value.trim();

        if (name.length === 0 || name === value) onCancel();
        else onCommit(name);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') onCancel();
        event.stopPropagation();
      }}
    />
  );
}
