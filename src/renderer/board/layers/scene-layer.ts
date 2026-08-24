import { visibleBounds } from '@/core/camera/camera-viewport';
import { elementBounds } from '@/core/element/element-bounds';
import { boundsIntersect } from '@/core/geometry/bounds';
import { CanvasLayer } from '@/renderer/board/layers/canvas-layer';
import { drawElement } from '@/renderer/board/render/element-renderer';
import { useBoardStore } from '@/renderer/stores/board.store';
import { cssPalette } from '@/renderer/theme/css-palette';
import type { Element } from '@/types';

export class SceneLayer extends CanvasLayer {
  private repaintAll = true;
  private queued: Element[] = [];

  invalidate(): void {
    this.repaintAll = true;
    this.queued = [];
  }

  append(elements: readonly Element[]): void {
    if (this.repaintAll) return;

    this.queued.push(...elements);
  }

  override resize(): void {
    super.resize();
    this.invalidate();
  }

  override paint(): void {
    const colors = cssPalette.read();

    if (this.repaintAll) {
      this.clear();
      this.useBoardSpace();
      const visible = visibleBounds(this.view.camera, this.view);

      for (const element of useBoardStore.getState().elements.values()) {
        if (!boundsIntersect(elementBounds(element), visible)) continue;
        drawElement(this.ctx, element, colors);
      }
    } else {
      this.useBoardSpace();
      for (const element of this.queued) drawElement(this.ctx, element, colors);
    }

    this.repaintAll = false;
    this.queued = [];
  }
}
