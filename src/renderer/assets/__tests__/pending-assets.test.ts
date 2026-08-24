import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearAssets,
  holdAsset,
  restoreAssets,
  takeAssets,
} from '@/renderer/assets/pending-assets';
import type { Element } from '@/types';

const LIMIT = 8;

function imageElement(id: string, assetId: string): Element {
  return {
    id,
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

function bytesOf(value: number): Uint8Array<ArrayBuffer> {
  return new Uint8Array([value]);
}

describe('pending assets', () => {
  beforeEach(() => {
    clearAssets();
  });

  it('carries the bytes an element points at exactly once', () => {
    holdAsset('a', bytesOf(1));

    expect(takeAssets([imageElement('one', 'a')], LIMIT)).toEqual([
      { assetId: 'a', bytes: bytesOf(1) },
    ]);
    expect(takeAssets([imageElement('one', 'a')], LIMIT)).toEqual([]);
  });

  it('sends one entry for the same image held under one id', () => {
    holdAsset('a', bytesOf(1));
    const elements = [
      imageElement('one', 'a'),
      imageElement('two', 'a'),
      imageElement('three', 'a'),
    ];

    expect(takeAssets(elements, LIMIT)).toHaveLength(1);
  });

  it('leaves out bytes no element points at', () => {
    holdAsset('a', bytesOf(1));
    holdAsset('b', bytesOf(2));

    expect(takeAssets([imageElement('one', 'b')], LIMIT).map((asset) => asset.assetId)).toEqual([
      'b',
    ]);
  });

  it('carries at most the given limit and keeps the rest', () => {
    holdAsset('a', bytesOf(1));
    holdAsset('b', bytesOf(2));
    const elements = [imageElement('one', 'a'), imageElement('two', 'b')];

    expect(takeAssets(elements, 1)).toHaveLength(1);
    expect(takeAssets(elements, 1)).toHaveLength(1);
    expect(takeAssets(elements, 1)).toHaveLength(0);
  });

  it('holds a failed save back for the next one', () => {
    holdAsset('a', bytesOf(1));
    const elements = [imageElement('one', 'a')];
    const taken = takeAssets(elements, LIMIT);

    restoreAssets(taken);

    expect(takeAssets(elements, LIMIT)).toEqual(taken);
  });
});
