import { describe, expect, it } from 'vitest';
import { hashAsset } from '@/main/assets/asset-hash';
import { assetStore } from '@/main/assets/asset.store';
import type { Element } from '@/types';

const BOARD_ID = '0f9d3e2a-1c4b-4a7d-9e8f-2b6c5d4a3e10';
const OTHER_BOARD_ID = '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d';

const BYTES = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const ASSET_ID = hashAsset(BYTES);

function imageElement(assetId: string): Element {
  return {
    id: 'image-1',
    createdAt: 0,
    type: 'image',
    assetId,
    mime: 'image/png',
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    naturalWidth: 10,
    naturalHeight: 10,
  };
}

describe('asset store', () => {
  it('serves an adopted asset to the board that owns it', () => {
    assetStore.open(BOARD_ID, new Map());
    assetStore.adopt(BOARD_ID, [{ assetId: ASSET_ID, bytes: BYTES }]);

    expect(assetStore.get(BOARD_ID, ASSET_ID)).toEqual(BYTES);
    expect(assetStore.get(OTHER_BOARD_ID, ASSET_ID)).toBeUndefined();
  });

  it('refuses bytes that do not hash to the asset id', () => {
    assetStore.open(BOARD_ID, new Map());

    expect(() => {
      assetStore.adopt(BOARD_ID, [{ assetId: 'f'.repeat(64), bytes: BYTES }]);
    }).toThrow('does not match');
  });

  it('holds one entry for the same bytes adopted repeatedly', () => {
    assetStore.open(BOARD_ID, new Map());
    const asset = { assetId: ASSET_ID, bytes: BYTES };
    assetStore.adopt(BOARD_ID, [asset, asset, asset]);

    expect(assetStore.referenced(BOARD_ID, [imageElement(ASSET_ID)]).size).toBe(1);
  });

  it('keeps only the assets the elements point at', () => {
    assetStore.open(BOARD_ID, new Map([['b'.repeat(64), BYTES]]));
    assetStore.adopt(BOARD_ID, [{ assetId: ASSET_ID, bytes: BYTES }]);

    expect([...assetStore.referenced(BOARD_ID, [imageElement(ASSET_ID)]).keys()]).toEqual([
      ASSET_ID,
    ]);
    expect(assetStore.referenced(BOARD_ID, []).size).toBe(0);
  });

  it('forgets the assets of a closed board', () => {
    assetStore.open(BOARD_ID, new Map([[ASSET_ID, BYTES]]));
    assetStore.close(BOARD_ID);

    expect(assetStore.get(BOARD_ID, ASSET_ID)).toBeUndefined();
    expect(() => assetStore.referenced(BOARD_ID, [])).toThrow('not open');
  });
});
