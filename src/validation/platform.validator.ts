import type { Platform } from '@/types';

const PLATFORMS: readonly Platform[] = ['darwin', 'win32', 'linux'];

export function resolvePlatform(value: string): Platform {
  return PLATFORMS.find((candidate) => candidate === value) ?? 'linux';
}
