import { describe, expect, it } from 'vitest';
import { groupBoardsByFolder } from '@/core/folder/folder-grouping';
import type { BoardMeta, Folder } from '@/types';

function meta(name: string, folderId: string | null): BoardMeta {
  return {
    format: 'ppap',
    version: 1,
    id: name,
    name,
    createdAt: '2026-01-01T00:00:00.000Z',
    modifiedAt: '2026-01-01T00:00:00.000Z',
    folderId,
  };
}

const FOLDERS: Folder[] = [{ id: 'work', name: 'Work', createdAt: '2026-01-01T00:00:00.000Z' }];

const BOARDS: BoardMeta[] = [
  meta('loose', null),
  meta('filed', 'work'),
  meta('orphan', 'deleted-folder'),
];

function names(grouped: Map<string | null, BoardMeta[]>, key: string | null): string[] {
  return (grouped.get(key) ?? []).map((board) => board.name);
}

describe('folder grouping', () => {
  it('takes the boards of a folder', () => {
    expect(names(groupBoardsByFolder(BOARDS, FOLDERS), 'work')).toEqual(['filed']);
  });

  it('leaves unfiled boards at the root', () => {
    expect(names(groupBoardsByFolder(BOARDS, FOLDERS), null)).toContain('loose');
  });

  it('sends a board of a deleted folder back to the root', () => {
    expect(names(groupBoardsByFolder(BOARDS, FOLDERS), null)).toContain('orphan');
  });

  it('gives an empty folder no entry', () => {
    expect(groupBoardsByFolder([], FOLDERS).get('work')).toBeUndefined();
  });
});
