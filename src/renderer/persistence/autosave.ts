import {
  CAMERA_SAVE_DELAY,
  ELEMENT_SAVE_DELAY,
  THUMBNAIL_INTERVAL,
} from '@/constants/autosave.constants';
import { MAX_ASSETS_PER_SAVE } from '@/constants/image.constants';
import { restoreAssets, takeAssets } from '@/renderer/assets/pending-assets';
import { renderThumbnail } from '@/renderer/export/board-thumbnail';
import { readBoardContent } from '@/renderer/persistence/board-content';
import { useBoardStore } from '@/renderer/stores/board.store';
import { watchStore } from '@/renderer/stores/watch-store';

class Autosave {
  private boardId: string | null = null;
  private readonly unwatch: (() => void)[] = [];
  private timer: number | null = null;
  private contentDirty = false;
  private thumbnailDirty = false;
  private thumbnailAt = 0;

  start(id: string): void {
    this.boardId = id;
    this.contentDirty = false;
    this.thumbnailDirty = false;
    this.thumbnailAt = Date.now();

    this.unwatch.push(
      watchStore(useBoardStore, (state) => state.elements, this.onContentChange),
      watchStore(useBoardStore, (state) => state.gridVisible, this.onContentChange),
      watchStore(useBoardStore, (state) => state.camera, this.onCameraChange),
    );
    window.addEventListener('beforeunload', this.onUnload);
  }

  stop(): void {
    this.clearTimer();
    for (const unwatch of this.unwatch) unwatch();
    this.unwatch.length = 0;
    window.removeEventListener('beforeunload', this.onUnload);
    this.boardId = null;
  }

  async flush(): Promise<void> {
    if (!this.contentDirty && !this.thumbnailDirty) return;

    await this.save(this.thumbnailDirty);
  }

  async close(): Promise<void> {
    await this.flush();
    this.stop();
  }

  private readonly onContentChange = (): void => {
    this.contentDirty = true;
    this.thumbnailDirty = true;
    this.restart(ELEMENT_SAVE_DELAY);
  };

  private readonly onCameraChange = (): void => {
    this.contentDirty = true;
    if (this.timer === null) this.restart(CAMERA_SAVE_DELAY);
  };

  private readonly onUnload = (): void => {
    if (this.contentDirty) void this.save(false);
  };

  private restart(delay: number): void {
    this.clearTimer();
    this.timer = window.setTimeout(() => {
      void this.save(this.thumbnailDirty && Date.now() - this.thumbnailAt >= THUMBNAIL_INTERVAL);
    }, delay);
  }

  private clearTimer(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }

  private async save(withThumbnail: boolean): Promise<void> {
    const id = this.boardId;
    if (id === null) return;

    this.clearTimer();
    this.contentDirty = false;
    const content = readBoardContent();
    const assets = takeAssets(content.elements, MAX_ASSETS_PER_SAVE);
    const thumbnail = withThumbnail ? await renderThumbnail() : null;

    if (thumbnail !== null) {
      this.thumbnailDirty = false;
      this.thumbnailAt = Date.now();
    }

    try {
      await window.ppap.library.save(id, content, assets, thumbnail);
      if (assets.length === MAX_ASSETS_PER_SAVE) this.onContentChange();
    } catch (error) {
      restoreAssets(assets);
      this.contentDirty = true;
      console.error('Failed to save the board', error);
    }
  }
}

export const autosave = new Autosave();
