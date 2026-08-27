import type { ReactElement } from 'react';
import { Plus } from 'lucide-react';
import { createBoard } from '@/renderer/session/board-session';

export function NewBoardTile(): ReactElement {
  return (
    <button
      type="button"
      aria-label="New board"
      onClick={() => {
        void createBoard();
      }}
      className="flex aspect-8/5 w-full items-center justify-center rounded-xl border border-dashed border-line text-muted transition-colors hover:border-muted hover:text-ink"
    >
      <Plus size={22} strokeWidth={1.5} />
    </button>
  );
}
