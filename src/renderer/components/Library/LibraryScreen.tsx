import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { sortBoards } from '@/core/board/board-sort';
import { BoardTile } from '@/renderer/components/Library/BoardTile';
import { DeleteBoardDialog } from '@/renderer/components/Library/DeleteBoardDialog';
import { NewBoardTile } from '@/renderer/components/Library/NewBoardTile';
import { useLibraryStore } from '@/renderer/stores/library.store';
import type { BoardMeta } from '@/types';

export function LibraryScreen(): ReactElement {
  const boards = useLibraryStore((state) => state.boards);
  const sortOrder = useLibraryStore((state) => state.sortOrder);
  const loading = useLibraryStore((state) => state.loading);
  const [pendingDelete, setPendingDelete] = useState<BoardMeta | null>(null);

  useEffect(() => {
    void useLibraryStore.getState().refresh();
  }, []);

  const sorted = useMemo(() => sortBoards(boards, sortOrder), [boards, sortOrder]);

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-canvas px-8 py-7">
      {!loading && sorted.length === 0 ? (
        <p className="mb-5 text-[12px] text-muted">Nothing here yet. Start a board.</p>
      ) : null}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
        <NewBoardTile />
        {sorted.map((board) => (
          <BoardTile key={board.id} board={board} onDelete={setPendingDelete} />
        ))}
      </div>

      <DeleteBoardDialog
        board={pendingDelete}
        onClose={() => {
          setPendingDelete(null);
        }}
      />
    </main>
  );
}
