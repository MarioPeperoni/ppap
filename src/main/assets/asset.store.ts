import { assetIdsOf } from '@/core/element/element-assets';
import { hashAsset } from '@/main/assets/asset-hash';
import type { AssetEntries, Bytes, Element, NewAsset } from '@/types';

class AssetStore {
  private boardId: string | null = null;
  private entries = new Map<string, Bytes>();

  holds(boardId: string): boolean {
    return this.boardId === boardId;
  }

  open(boardId: string, assets: AssetEntries): void {
    this.boardId = boardId;
    this.entries = new Map(assets);
  }

  close(boardId: string): void {
    if (!this.holds(boardId)) return;

    this.boardId = null;
    this.entries = new Map();
  }

  get(boardId: string, assetId: string): Bytes | undefined {
    return this.holds(boardId) ? this.entries.get(assetId) : undefined;
  }

  adopt(boardId: string, assets: readonly NewAsset[]): void {
    const entries = this.require(boardId);

    for (const asset of assets) {
      if (hashAsset(asset.bytes) !== asset.assetId) {
        throw new Error('Asset id does not match its bytes');
      }

      entries.set(asset.assetId, asset.bytes);
    }
  }

  /** The assets the elements still point at; the rest never reach the archive. */
  referenced(boardId: string, elements: readonly Element[]): AssetEntries {
    const entries = this.require(boardId);
    const kept = new Map<string, Bytes>();

    for (const id of assetIdsOf(elements)) {
      const bytes = entries.get(id);
      if (bytes !== undefined) kept.set(id, bytes);
    }

    return kept;
  }

  private require(boardId: string): Map<string, Bytes> {
    if (this.boardId !== boardId) throw new Error('The board assets are not open');

    return this.entries;
  }
}

export const assetStore = new AssetStore();
