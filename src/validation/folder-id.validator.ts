import { FOLDER_ID_PATTERN, MAX_FOLDER_NAME_LENGTH } from '@/constants/folder.constants';
import { expectString } from '@/validation/primitive.validator';

export function parseFolderId(value: unknown): string {
  const id = expectString(value, 'Folder id');
  if (!FOLDER_ID_PATTERN.test(id)) throw new Error('Folder id is malformed');

  return id;
}

export function parseOptionalFolderId(value: unknown): string | null {
  return value === null ? null : parseFolderId(value);
}

export function parseFolderName(value: unknown): string {
  const name = expectString(value, 'Folder name').trim();
  if (name.length === 0) throw new Error('Folder name is empty');

  return name.slice(0, MAX_FOLDER_NAME_LENGTH);
}
