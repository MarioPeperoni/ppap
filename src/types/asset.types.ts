import type { Bytes } from './bytes.types';

export type ImageMime = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp' | 'image/bmp';

export interface NewAsset {
  assetId: string;
  bytes: Bytes;
}

export type AssetEntries = ReadonlyMap<string, Bytes>;
