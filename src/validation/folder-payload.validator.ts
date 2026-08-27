import type { FolderNameRequest, FolderRenameRequest, FolderRequest } from '@/types';
import { parseFolderId, parseFolderName } from '@/validation/folder-id.validator';
import { expectRecord } from '@/validation/primitive.validator';

export function parseFolderRequest(value: unknown): FolderRequest {
  return { id: parseFolderId(expectRecord(value, 'Folder request').id) };
}

export function parseFolderNameRequest(value: unknown): FolderNameRequest {
  return { name: parseFolderName(expectRecord(value, 'Folder name request').name) };
}

export function parseFolderRenameRequest(value: unknown): FolderRenameRequest {
  const source = expectRecord(value, 'Folder rename request');

  return { id: parseFolderId(source.id), name: parseFolderName(source.name) };
}
