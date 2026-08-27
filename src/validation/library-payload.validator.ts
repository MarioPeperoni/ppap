import { MAX_IMAGE_BYTES, MAX_THUMBNAIL_BYTES } from '@/constants/library.constants';
import type {
  BoardRequest,
  ImageRequest,
  RenameRequest,
  SaveRequest,
  SetFolderRequest,
} from '@/types';
import { parseNewAssets } from '@/validation/asset.validator';
import { parseBoardContent } from '@/validation/board-file.validator';
import { parseBoardId, parseBoardName } from '@/validation/board-id.validator';
import { parseOptionalFolderId } from '@/validation/folder-id.validator';
import { expectBytes, expectRecord } from '@/validation/primitive.validator';

export function parseBoardRequest(value: unknown): BoardRequest {
  return { id: parseBoardId(expectRecord(value, 'Board request').id) };
}

export function parseRenameRequest(value: unknown): RenameRequest {
  const source = expectRecord(value, 'Rename request');

  return { id: parseBoardId(source.id), name: parseBoardName(source.name) };
}

export function parseSetFolderRequest(value: unknown): SetFolderRequest {
  const source = expectRecord(value, 'Set folder request');

  return { id: parseBoardId(source.id), folderId: parseOptionalFolderId(source.folderId) };
}

export function parseSaveRequest(value: unknown): SaveRequest {
  const source = expectRecord(value, 'Save request');

  return {
    id: parseBoardId(source.id),
    content: parseBoardContent(source.content),
    assets: parseNewAssets(source.assets),
    thumbnail:
      source.thumbnail === null
        ? null
        : expectBytes(source.thumbnail, 'Thumbnail', MAX_THUMBNAIL_BYTES),
  };
}

export function parseImageRequest(value: unknown): ImageRequest {
  const source = expectRecord(value, 'Image request');

  return {
    name: parseBoardName(source.name),
    png: expectBytes(source.png, 'Image', MAX_IMAGE_BYTES),
  };
}
