import type { LayerKey } from '@/types';

export class RenderScheduler {
  private readonly painters = new Map<LayerKey, () => void>();
  private readonly dirty = new Set<LayerKey>();
  private frame: number | null = null;

  register(key: LayerKey, paint: () => void): void {
    this.painters.set(key, paint);
  }

  markDirty(key: LayerKey): void {
    this.dirty.add(key);
    this.frame ??= requestAnimationFrame(this.paintFrame);
  }

  markAllDirty(): void {
    for (const key of this.painters.keys()) this.markDirty(key);
  }

  stop(): void {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    this.dirty.clear();
  }

  private readonly paintFrame = (): void => {
    this.frame = null;
    const keys = [...this.dirty];
    this.dirty.clear();

    for (const key of keys) this.painters.get(key)?.();
  };
}
