import { describe, expect, it } from 'vitest';
import { sortFolders } from '@/core/folder/folder-sort';
import type { Folder } from '@/types';

const FOLDERS: Folder[] = [
  { id: 'b', name: 'Sketches', createdAt: '2026-01-02T00:00:00.000Z' },
  { id: 'a', name: 'Archive', createdAt: '2026-01-01T00:00:00.000Z' },
];

describe('folder sort', () => {
  it('orders by name ascending', () => {
    expect(sortFolders(FOLDERS).map((folder) => folder.name)).toEqual(['Archive', 'Sketches']);
  });

  it('leaves the source untouched', () => {
    sortFolders(FOLDERS);
    expect(FOLDERS[0]?.name).toBe('Sketches');
  });
});
