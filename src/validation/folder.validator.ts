import type { Folder } from '@/types';
import { parseFolderId, parseFolderName } from '@/validation/folder-id.validator';
import { expectArray, expectRecord } from '@/validation/primitive.validator';
import { parseTimestamp } from '@/validation/timestamp.validator';

export function parseFolder(value: unknown): Folder {
  const source = expectRecord(value, 'Folder');

  return {
    id: parseFolderId(source.id),
    name: parseFolderName(source.name),
    createdAt: parseTimestamp(source.createdAt, 'Folder createdAt'),
  };
}

export function parseFolders(value: unknown): Folder[] {
  return expectArray(value, 'Folder list').map(parseFolder);
}
