import { ASSET_SCHEME } from '@/constants/image.constants';
import { assetIdsOf } from '@/core/element/element-assets';
import type { Element } from '@/types';

class ImageCache {
  private boardId: string | null = null;
  private readonly bitmaps = new Map<string, ImageBitmap>();
  private readonly loads = new Map<string, Promise<void>>();
  private readonly listeners = new Set<() => void>();

  open(boardId: string): void {
    this.close();
    this.boardId = boardId;
  }

  close(): void {
    for (const bitmap of this.bitmaps.values()) bitmap.close();
    this.bitmaps.clear();
    this.loads.clear();
    this.boardId = null;
  }

  get(assetId: string): ImageBitmap | undefined {
    return this.bitmaps.get(assetId);
  }

  put(assetId: string, bitmap: ImageBitmap): void {
    this.bitmaps.set(assetId, bitmap);
    for (const listener of this.listeners) listener();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  prime(elements: Iterable<Element>): void {
    void this.ready(elements);
  }

  async ready(elements: Iterable<Element>): Promise<void> {
    await Promise.all([...assetIdsOf(elements)].map((assetId) => this.load(assetId)));
  }

  private load(assetId: string): Promise<void> {
    if (this.bitmaps.has(assetId)) return Promise.resolve();

    const running = this.loads.get(assetId);
    if (running !== undefined) return running;

    const load = this.fetch(assetId).finally(() => {
      this.loads.delete(assetId);
    });
    this.loads.set(assetId, load);

    return load;
  }

  private async fetch(assetId: string): Promise<void> {
    const boardId = this.boardId;
    if (boardId === null) return;

    try {
      const response = await fetch(`${ASSET_SCHEME}://${boardId}/${assetId}`);
      if (!response.ok) throw new Error(`The board has no asset ${assetId}`);

      const bitmap = await createImageBitmap(await response.blob());
      if (this.boardId !== boardId) {
        bitmap.close();
        return;
      }

      this.put(assetId, bitmap);
    } catch (error) {
      console.error(`Failed to load asset ${assetId}`, error);
    }
  }
}

export const imageCache = new ImageCache();
