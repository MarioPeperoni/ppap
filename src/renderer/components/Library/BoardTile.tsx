import { useState, type ReactElement } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { modifiedLabel } from '@/core/board/board-date';
import { NameInput } from '@/renderer/components/NameInput/NameInput';
import { useBoardThumbnail } from '@/renderer/hooks/use-board-thumbnail';
import { openBoard, renameBoard } from '@/renderer/session/board-session';
import type { BoardMeta } from '@/types';

const ACTION_CLASS =
  'flex h-7 w-7 items-center justify-center rounded-lg bg-surface/90 text-muted shadow-sm';

interface BoardTileProps {
  board: BoardMeta;
  onDelete: (board: BoardMeta) => void;
}

export function BoardTile({ board, onDelete }: BoardTileProps): ReactElement {
  const [editing, setEditing] = useState(false);
  const thumbnail = useBoardThumbnail(board.id, board.modifiedAt);

  return (
    <div className="group flex flex-col gap-2">
      <div className="relative">
        <button
          type="button"
          aria-label={board.name}
          onClick={() => {
            void openBoard(board.id);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Delete' || event.key === 'Backspace') onDelete(board);
            if (event.key === 'F2') setEditing(true);
          }}
          className="block aspect-[8/5] w-full overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-muted"
        >
          {thumbnail === null ? null : (
            <img src={thumbnail} alt="" className="h-full w-full object-cover" />
          )}
        </button>
        <div className="absolute top-2 right-2 hidden gap-1 group-hover:flex">
          <button
            type="button"
            aria-label={`Rename ${board.name}`}
            onClick={() => {
              setEditing(true);
            }}
            className={`${ACTION_CLASS} hover:text-ink`}
          >
            <Pencil size={14} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${board.name}`}
            onClick={() => {
              onDelete(board);
            }}
            className={`${ACTION_CLASS} hover:text-red`}
          >
            <Trash2 size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {editing ? (
        <NameInput
          value={board.name}
          className="rounded bg-raised px-1.5 py-0.5 text-[12px] text-ink outline-none"
          onCommit={(name) => {
            setEditing(false);
            void renameBoard(board.id, name);
          }}
          onCancel={() => {
            setEditing(false);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            void openBoard(board.id);
          }}
          className="truncate px-1.5 text-left text-[12px] text-ink"
        >
          {board.name}
        </button>
      )}
      <span className="px-1.5 text-[11px] text-muted">
        {modifiedLabel(board.modifiedAt, new Date())}
      </span>
    </div>
  );
}
