import { strToU8, unzipSync, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import {
  decodeArchive,
  decodeAssets,
  decodeMeta,
  decodeThumbnail,
  encodeArchive,
} from '@/main/archive/archive.codec';
import type { BoardArchive } from '@/types';

const ASSET_ID = 'a'.repeat(64);
const ASSET_BYTES = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]);

const ARCHIVE: BoardArchive = {
  meta: {
    format: 'ppap',
    version: 1,
    id: '0f9d3e2a-1c4b-4a7d-9e8f-2b6c5d4a3e10',
    name: 'sprint planning',
    createdAt: '2026-08-24T09:00:00.000Z',
    modifiedAt: '2026-08-24T10:30:00.000Z',
    folderId: null,
  },
  content: {
    gridVisible: false,
    camera: { x: -20, y: 80, zoom: 0.75 },
    elements: [
      {
        id: 'a1',
        createdAt: 1_756_000_000_000,
        type: 'stroke',
        points: [
          [0, 0, 0.5],
          [4, 8, 0.7],
        ],
        color: 'red',
        size: 'l',
        nib: 'pen',
        scale: 1.25,
      },
    ],
  },
  thumbnail: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
  assets: new Map([[ASSET_ID, ASSET_BYTES]]),
};

describe('archive codec', () => {
  it('round-trips a board with its thumbnail', () => {
    expect(decodeArchive(encodeArchive(ARCHIVE))).toEqual(ARCHIVE);
  });

  it('omits the thumbnail entry when there is none', () => {
    const bytes = encodeArchive({ ...ARCHIVE, thumbnail: null, assets: new Map() });

    expect(Object.keys(unzipSync(bytes))).toEqual(['meta.json', 'board.json']);
    expect(decodeThumbnail(bytes)).toBeNull();
  });

  it('reads the metadata without unpacking the elements', () => {
    expect(decodeMeta(encodeArchive(ARCHIVE))).toEqual(ARCHIVE.meta);
  });

  it('reads the thumbnail without unpacking the elements', () => {
    expect(decodeThumbnail(encodeArchive(ARCHIVE))).toEqual(ARCHIVE.thumbnail);
  });

  it('stores the assets under their own id', () => {
    const entries = unzipSync(encodeArchive(ARCHIVE));

    expect(entries[`assets/${ASSET_ID}`]).toEqual(ASSET_BYTES);
    expect(decodeAssets(encodeArchive(ARCHIVE))).toEqual(ARCHIVE.assets);
  });

  it('ignores an asset entry whose name is not a digest', () => {
    const bytes = zipSync({
      'meta.json': strToU8(JSON.stringify(ARCHIVE.meta)),
      'board.json': strToU8(JSON.stringify(ARCHIVE.content)),
      'assets/../escape.png': new Uint8Array([1, 2, 3]),
    });

    expect(decodeArchive(bytes).assets.size).toBe(0);
  });

  it('rejects an archive without a metadata entry', () => {
    const bytes = zipSync({ 'thumb.png': new Uint8Array([1, 2, 3]) });

    expect(() => decodeArchive(bytes)).toThrow('missing meta.json');
  });

  it('rejects an archive holding a foreign board', () => {
    const bytes = zipSync({
      'meta.json': strToU8(JSON.stringify({ ...ARCHIVE.meta, format: 'sketch' })),
      'board.json': strToU8(JSON.stringify(ARCHIVE.content)),
    });

    expect(() => decodeArchive(bytes)).toThrow('Not a ppap board');
  });
});
