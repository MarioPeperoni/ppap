import { assetIdsOf } from '@/core/element/element-assets';
import type { Bytes, Element, NewAsset } from '@/types';

const pending = new Map<string, Bytes>();

export function holdAsset(assetId: string, bytes: Bytes): void {
  pending.set(assetId, bytes);
}

/** The held bytes the elements point at, up to the limit one save may carry. */
export function takeAssets(elements: readonly Element[], limit: number): NewAsset[] {
  const taken: NewAsset[] = [];

  for (const assetId of assetIdsOf(elements)) {
    if (taken.length === limit) break;

    const bytes = pending.get(assetId);
    if (bytes === undefined) continue;

    pending.delete(assetId);
    taken.push({ assetId, bytes });
  }

  return taken;
}

export function restoreAssets(assets: readonly NewAsset[]): void {
  for (const asset of assets) {
    if (!pending.has(asset.assetId)) pending.set(asset.assetId, asset.bytes);
  }
}

export function clearAssets(): void {
  pending.clear();
}
