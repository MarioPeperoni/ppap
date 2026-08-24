import { ASSET_ID_PATTERN, MAX_ASSETS_PER_SAVE } from '@/constants/image.constants';
import { MAX_IMAGE_BYTES } from '@/constants/library.constants';
import { sniffImageMime } from '@/core/image/image-mime';
import type { NewAsset } from '@/types';
import {
  expectArray,
  expectBytes,
  expectRecord,
  expectString,
} from '@/validation/primitive.validator';

export function isAssetId(value: string): boolean {
  return ASSET_ID_PATTERN.test(value);
}

export function parseAssetId(value: unknown): string {
  const id = expectString(value, 'Asset id');
  if (!isAssetId(id)) throw new Error('Asset id is malformed');

  return id;
}

function parseNewAsset(value: unknown): NewAsset {
  const source = expectRecord(value, 'Asset');
  const bytes = expectBytes(source.bytes, 'Asset', MAX_IMAGE_BYTES);
  if (sniffImageMime(bytes) === null) throw new Error('Asset is not a supported image');

  return { assetId: parseAssetId(source.assetId), bytes };
}

export function parseNewAssets(value: unknown): NewAsset[] {
  const list = expectArray(value, 'Assets');
  if (list.length > MAX_ASSETS_PER_SAVE) {
    throw new Error(`Assets exceed ${MAX_ASSETS_PER_SAVE} entries`);
  }

  return list.map(parseNewAsset);
}
