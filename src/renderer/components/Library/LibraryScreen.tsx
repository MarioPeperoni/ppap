import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { sortBoards } from '@/core/board/board-sort';
import { groupBoardsByFolder } from '@/core/folder/folder-grouping';
import { sortFolders } from '@/core/folder/folder-sort';
import { BoardTile } from '@/renderer/components/Library/BoardTile';
import { DeleteBoardDialog } from '@/renderer/components/Library/DeleteBoardDialog';
import { DeleteFolderDialog } from '@/renderer/components/Library/DeleteFolderDialog';
import { FolderTile } from '@/renderer/components/Library/FolderTile';
import { LibraryHeader } from '@/renderer/components/Library/LibraryHeader';
import { NewBoardTile } from '@/renderer/components/Library/NewBoardTile';
import { TileEnter } from '@/renderer/components/Library/TileEnter';
import { useFolderStore } from '@/renderer/stores/folder.store';
import { useLibraryStore } from '@/renderer/stores/library.store';
import type { BoardMeta, Folder } from '@/types';

export function LibraryScreen(): ReactElement {
  const boards = useLibraryStore((state) => state.boards);
  const sortOrder = useLibraryStore((state) => state.sortOrder);
  const loading = useLibraryStore((state) => state.loading);
  const folders = useFolderStore((state) => state.folders);
  const currentId = useFolderStore((state) => state.currentId);
  const [pendingBoard, setPendingBoard] = useState<BoardMeta | null>(null);
  const [pendingFolder, setPendingFolder] = useState<Folder | null>(null);

  useEffect(() => {
    void useLibraryStore.getState().refresh();
    void useFolderStore.getState().refresh();
  }, []);

  const open = folders.find((folder) => folder.id === currentId) ?? null;
  const grouped = useMemo(() => groupBoardsByFolder(boards, folders), [boards, folders]);
  const tiles = useMemo(() => (open === null ? sortFolders(folders) : []), [folders, open]);
  const sorted = useMemo(
    () => sortBoards(grouped.get(open?.id ?? null) ?? [], sortOrder),
    [grouped, open, sortOrder],
  );

  return (
    <main className="min-h-0 flex-1 animate-screen-in overflow-y-auto bg-canvas px-8 py-7">
      <LibraryHeader folder={open} />

      {!loading && sorted.length === 0 && tiles.length === 0 ? (
        <p className="mb-5 text-[12px] text-muted">Nothing here yet. Start a board.</p>
      ) : null}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
        <TileEnter index={0}>
          <NewBoardTile />
        </TileEnter>
        {tiles.map((folder, order) => (
          <TileEnter key={folder.id} index={order + 1}>
            <FolderTile
              folder={folder}
              boards={grouped.get(folder.id) ?? []}
              onDelete={setPendingFolder}
            />
          </TileEnter>
        ))}
        {sorted.map((board, order) => (
          <TileEnter key={board.id} index={tiles.length + order + 1}>
            <BoardTile board={board} onDelete={setPendingBoard} />
          </TileEnter>
        ))}
      </div>

      <DeleteBoardDialog
        board={pendingBoard}
        onClose={() => {
          setPendingBoard(null);
        }}
      />
      <DeleteFolderDialog
        folder={pendingFolder}
        onClose={() => {
          setPendingFolder(null);
        }}
      />
    </main>
  );
}
