import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { useRenameShortcut } from '@/renderer/hooks/use-rename-shortcut';
import { useBoardStore } from '@/renderer/stores/board.store';

export function BoardTitle(): ReactElement {
  const name = useBoardStore((state) => state.name);
  const setName = useBoardStore((state) => state.setName);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = useCallback(() => {
    setEditing(true);
  }, []);
  useRenameShortcut(startEditing);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className="app-no-drag rounded px-2 py-0.5 text-[12px] text-ink/80 hover:bg-raised"
      >
        {name}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      defaultValue={name}
      onBlur={(event) => {
        setName(event.target.value.trim() || name);
        setEditing(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') setEditing(false);
      }}
      className="app-no-drag rounded bg-raised px-2 py-0.5 text-[12px] text-ink outline-none"
    />
  );
}
