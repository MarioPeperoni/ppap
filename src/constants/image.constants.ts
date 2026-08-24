import type { ImageMime } from '@/types';

export const ASSET_SCHEME = 'ppap-asset';
export const ASSET_ID_PATTERN = /^[0-9a-f]{64}$/;

export const IMAGE_MIMES: readonly ImageMime[] = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/bmp',
];

export const IMAGE_MAX_SIZE = 800;
export const IMAGE_STACK_OFFSET = 24;
export const MAX_ASSETS_PER_SAVE = 64;
