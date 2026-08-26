import { useCallback, useState, type ReactElement } from 'react';
import { ChevronLeft } from 'lucide-react';
import { NameInput } from '@/renderer/components/NameInput/NameInput';
import { useRenameShortcut } from '@/renderer/hooks/use-rename-shortcut';
import { leaveBoard, renameBoard } from '@/renderer/session/board-session';
import { useBoardStore } from '@/renderer/stores/board.store';

export function BoardTitle(): ReactElement {
  const id = useBoardStore((state) => state.id);
  const name = useBoardStore((state) => state.name);
  const [editing, setEditing] = useState(false);

  const startEditing = useCallback(() => {
    setEditing(true);
  }, []);
  useRenameShortcut(startEditing);

  return (
    <>
      <button
        type="button"
        aria-label="Back to the library"
        onClick={() => {
          void leaveBoard();
        }}
        className="app-no-drag flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-raised hover:text-ink"
      >
        <ChevronLeft size={16} strokeWidth={1.75} />
      </button>

      {editing ? (
        <NameInput
          value={name}
          className="app-no-drag rounded bg-raised px-2 py-0.5 text-[12px] text-ink outline-none"
          onCommit={(next) => {
            setEditing(false);
            void renameBoard(id, next);
          }}
          onCancel={() => {
            setEditing(false);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={startEditing}
          className="app-no-drag rounded px-2 py-0.5 text-[12px] text-ink/80 transition-colors hover:bg-raised hover:text-ink"
        >
          {name}
        </button>
      )}
    </>
  );
}
