import type { BoardMeta, Folder } from '@/types';

export function groupBoardsByFolder(
  boards: readonly BoardMeta[],
  folders: readonly Folder[],
): Map<string | null, BoardMeta[]> {
  const known = new Set(folders.map((folder) => folder.id));
  const grouped = new Map<string | null, BoardMeta[]>();

  for (const board of boards) {
    const key = board.folderId !== null && known.has(board.folderId) ? board.folderId : null;

    grouped.set(key, [...(grouped.get(key) ?? []), board]);
  }

  return grouped;
}
