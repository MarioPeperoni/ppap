import type { BoardMeta, SortOrder } from '@/types';

const COMPARATORS: Record<SortOrder, (left: BoardMeta, right: BoardMeta) => number> = {
  modified: (left, right) => Date.parse(right.modifiedAt) - Date.parse(left.modifiedAt),
  created: (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
  name: (left, right) => left.name.localeCompare(right.name),
};

export function sortBoards(boards: readonly BoardMeta[], order: SortOrder): BoardMeta[] {
  return [...boards].sort(COMPARATORS[order]);
}
