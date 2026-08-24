import { strFromU8, strToU8, unzipSync, zipSync, type Unzipped, type Zippable } from 'fflate';
import { MAX_ARCHIVE_BYTES } from '@/constants/library.constants';
import type { AssetEntries, BoardArchive, Bytes } from '@/types';
import { isAssetId } from '@/validation/asset.validator';
import { parseBoardContent, parseBoardMeta } from '@/validation/board-file.validator';
import { isBytes } from '@/validation/primitive.validator';

const META_ENTRY = 'meta.json';
const BOARD_ENTRY = 'board.json';
const THUMB_ENTRY = 'thumb.png';
const ASSET_PREFIX = 'assets/';

const DEFLATED = { level: 9 } as const;
const STORED = { level: 0 } as const;

function assetIdOf(name: string): string | null {
  if (!name.startsWith(ASSET_PREFIX)) return null;

  const id = name.slice(ASSET_PREFIX.length);

  return isAssetId(id) ? id : null;
}

function readEntries(archive: Uint8Array, wanted: (name: string) => boolean): Unzipped {
  if (archive.byteLength > MAX_ARCHIVE_BYTES) throw new Error('Archive is too large to read');

  return unzipSync(archive, { filter: (file) => wanted(file.name) });
}

function readJson(entries: Unzipped, name: string): unknown {
  const entry = entries[name];
  if (entry === undefined) throw new Error(`Archive is missing ${name}`);

  const parsed: unknown = JSON.parse(strFromU8(entry));

  return parsed;
}

function readAssets(entries: Unzipped): AssetEntries {
  const assets = new Map<string, Bytes>();

  for (const [name, bytes] of Object.entries(entries)) {
    const id = assetIdOf(name);
    if (id !== null && isBytes(bytes)) assets.set(id, bytes);
  }

  return assets;
}

export function encodeArchive(archive: BoardArchive): Uint8Array {
  const entries: Zippable = {
    [META_ENTRY]: [strToU8(JSON.stringify(archive.meta)), DEFLATED],
    [BOARD_ENTRY]: [strToU8(JSON.stringify(archive.content)), DEFLATED],
  };

  if (archive.thumbnail !== null) entries[THUMB_ENTRY] = [archive.thumbnail, STORED];
  for (const [id, bytes] of archive.assets) entries[`${ASSET_PREFIX}${id}`] = [bytes, STORED];

  return zipSync(entries);
}

export function decodeArchive(archive: Uint8Array): BoardArchive {
  const entries = readEntries(
    archive,
    (name) =>
      name === META_ENTRY ||
      name === BOARD_ENTRY ||
      name === THUMB_ENTRY ||
      assetIdOf(name) !== null,
  );

  return {
    meta: parseBoardMeta(readJson(entries, META_ENTRY)),
    content: parseBoardContent(readJson(entries, BOARD_ENTRY)),
    thumbnail: entries[THUMB_ENTRY] ?? null,
    assets: readAssets(entries),
  };
}

export function decodeMeta(archive: Uint8Array): BoardArchive['meta'] {
  return parseBoardMeta(
    readJson(
      readEntries(archive, (name) => name === META_ENTRY),
      META_ENTRY,
    ),
  );
}

export function decodeThumbnail(archive: Uint8Array): Uint8Array | null {
  return readEntries(archive, (name) => name === THUMB_ENTRY)[THUMB_ENTRY] ?? null;
}

export function decodeAssets(archive: Uint8Array): AssetEntries {
  return readAssets(readEntries(archive, (name) => assetIdOf(name) !== null));
}
