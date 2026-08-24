import { describe, expect, it } from 'vitest';
import { sortBoards } from '@/core/board/board-sort';
import type { BoardMeta } from '@/types';

function meta(name: string, createdAt: string, modifiedAt: string): BoardMeta {
  return {
    format: 'ppap',
    version: 1,
    id: name,
    name,
    createdAt,
    modifiedAt,
    folderId: null,
  };
}

const BOARDS: BoardMeta[] = [
  meta('beta', '2026-01-02T00:00:00.000Z', '2026-03-01T00:00:00.000Z'),
  meta('alpha', '2026-01-03T00:00:00.000Z', '2026-02-01T00:00:00.000Z'),
  meta('gamma', '2026-01-01T00:00:00.000Z', '2026-04-01T00:00:00.000Z'),
];

function names(order: Parameters<typeof sortBoards>[1]): string[] {
  return sortBoards(BOARDS, order).map((board) => board.name);
}

describe('board sort', () => {
  it('orders by modified date descending', () => {
    expect(names('modified')).toEqual(['gamma', 'beta', 'alpha']);
  });

  it('orders by creation date descending', () => {
    expect(names('created')).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('orders by name ascending', () => {
    expect(names('name')).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('leaves the source untouched', () => {
    names('name');
    expect(BOARDS[0]?.name).toBe('beta');
  });
});
