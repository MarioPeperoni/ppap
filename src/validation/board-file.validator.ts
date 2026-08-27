import { BOARD_FORMAT, BOARD_VERSION } from '@/constants/library.constants';
import type { BoardContent, BoardFile, BoardMeta, CameraState } from '@/types';
import { parseBoardId, parseBoardName } from '@/validation/board-id.validator';
import { parseElement } from '@/validation/element.validator';
import { parseOptionalFolderId } from '@/validation/folder-id.validator';
import {
  expectArray,
  expectBoolean,
  expectNumber,
  expectRecord,
} from '@/validation/primitive.validator';
import { parseTimestamp } from '@/validation/timestamp.validator';

function parseCamera(value: unknown): CameraState {
  const source = expectRecord(value, 'Camera');

  return {
    x: expectNumber(source.x, 'Camera x'),
    y: expectNumber(source.y, 'Camera y'),
    zoom: expectNumber(source.zoom, 'Camera zoom'),
  };
}

export function parseBoardMeta(value: unknown): BoardMeta {
  const source = expectRecord(value, 'Board meta');

  if (source.format !== BOARD_FORMAT) throw new Error('Not a ppap board');
  if (source.version !== BOARD_VERSION) {
    throw new Error(`Unsupported board version: ${String(source.version)}`);
  }

  return {
    format: BOARD_FORMAT,
    version: BOARD_VERSION,
    id: parseBoardId(source.id),
    name: parseBoardName(source.name),
    createdAt: parseTimestamp(source.createdAt, 'Board createdAt'),
    modifiedAt: parseTimestamp(source.modifiedAt, 'Board modifiedAt'),
    folderId: parseOptionalFolderId(source.folderId),
  };
}

export function parseBoardContent(value: unknown): BoardContent {
  const source = expectRecord(value, 'Board content');

  return {
    gridVisible: expectBoolean(source.gridVisible, 'Grid visibility'),
    camera: parseCamera(source.camera),
    elements: expectArray(source.elements, 'Board elements').map(parseElement),
  };
}

export function parseBoardFile(value: unknown): BoardFile {
  const source = expectRecord(value, 'Board file');

  return { meta: parseBoardMeta(source.meta), content: parseBoardContent(source.content) };
}
