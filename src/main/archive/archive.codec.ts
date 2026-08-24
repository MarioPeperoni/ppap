import { strFromU8, strToU8, unzipSync, zipSync, type Unzipped, type Zippable } from 'fflate';
import { MAX_ARCHIVE_BYTES } from '@/constants/library.constants';
import type { BoardArchive } from '@/types';
import { parseBoardContent, parseBoardMeta } from '@/validation/board-file.validator';

const META_ENTRY = 'meta.json';
const BOARD_ENTRY = 'board.json';
const THUMB_ENTRY = 'thumb.png';

const DEFLATED = { level: 9 } as const;
const STORED = { level: 0 } as const;

function readEntries(archive: Uint8Array, wanted: readonly string[]): Unzipped {
  if (archive.byteLength > MAX_ARCHIVE_BYTES) throw new Error('Archive is too large to read');

  return unzipSync(archive, { filter: (file) => wanted.includes(file.name) });
}

function readJson(entries: Unzipped, name: string): unknown {
  const entry = entries[name];
  if (entry === undefined) throw new Error(`Archive is missing ${name}`);

  const parsed: unknown = JSON.parse(strFromU8(entry));

  return parsed;
}

export function encodeArchive(archive: BoardArchive): Uint8Array {
  const entries: Zippable = {
    [META_ENTRY]: [strToU8(JSON.stringify(archive.meta)), DEFLATED],
    [BOARD_ENTRY]: [strToU8(JSON.stringify(archive.content)), DEFLATED],
  };

  if (archive.thumbnail !== null) entries[THUMB_ENTRY] = [archive.thumbnail, STORED];

  return zipSync(entries);
}

export function decodeArchive(archive: Uint8Array): BoardArchive {
  const entries = readEntries(archive, [META_ENTRY, BOARD_ENTRY, THUMB_ENTRY]);

  return {
    meta: parseBoardMeta(readJson(entries, META_ENTRY)),
    content: parseBoardContent(readJson(entries, BOARD_ENTRY)),
    thumbnail: entries[THUMB_ENTRY] ?? null,
  };
}

export function decodeMeta(archive: Uint8Array): BoardArchive['meta'] {
  return parseBoardMeta(readJson(readEntries(archive, [META_ENTRY]), META_ENTRY));
}

export function decodeThumbnail(archive: Uint8Array): Uint8Array | null {
  return readEntries(archive, [THUMB_ENTRY])[THUMB_ENTRY] ?? null;
}
