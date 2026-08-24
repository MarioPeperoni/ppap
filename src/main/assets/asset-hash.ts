import { createHash } from 'node:crypto';

export function hashAsset(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}
