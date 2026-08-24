import { MIN_SELECTION_SCALE } from '@/constants/select.constants';
import { updatePatch } from '@/core/scene/scene-patch';
import { scaleElement, translateElement } from '@/core/select/select-transform';
import { handleCorner, oppositeCorner } from '@/renderer/board/selection/selection-handles';
import { sceneCommand } from '@/renderer/commands/scene.command';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useHistoryStore } from '@/renderer/stores/history.store';
import type { Bounds, Element, Point, SelectionHandle } from '@/types';

/** Uniform scale: the pointer is projected onto the diagonal running out of the anchor. */
function scaleFactor(anchor: Point, corner: Point, point: Point): number {
  const diagonalX = corner.x - anchor.x;
  const diagonalY = corner.y - anchor.y;
  const lengthSquared = diagonalX * diagonalX + diagonalY * diagonalY;
  if (lengthSquared === 0) return 1;

  const projection =
    ((point.x - anchor.x) * diagonalX + (point.y - anchor.y) * diagonalY) / lengthSquared;

  return Math.max(projection, MIN_SELECTION_SCALE);
}

export class SelectionDrag {
  private origin: readonly Element[] = [];
  private latest: readonly Element[] = [];
  private bounds: Bounds | null = null;
  private start: Point = { x: 0, y: 0 };
  private handle: SelectionHandle | null = null;
  private changed = false;

  begin(
    elements: readonly Element[],
    bounds: Bounds,
    start: Point,
    handle: SelectionHandle | null,
  ): void {
    this.origin = elements;
    this.latest = elements;
    this.bounds = bounds;
    this.start = start;
    this.handle = handle;
    this.changed = false;
  }

  update(point: Point): void {
    if (this.origin.length === 0) return;
    if (!this.changed && point.x === this.start.x && point.y === this.start.y) return;

    this.latest = this.transform(point);
    this.changed = true;
    useBoardStore.getState().applyScenePatch(updatePatch(this.latest));
  }

  finish(): void {
    if (this.changed) {
      useHistoryStore
        .getState()
        .record(
          sceneCommand(
            this.handle === null ? 'move' : 'scale',
            [updatePatch(this.latest)],
            [updatePatch(this.origin)],
          ),
        );
    }

    this.reset();
  }

  cancel(): void {
    if (this.changed) useBoardStore.getState().applyScenePatch(updatePatch(this.origin));

    this.reset();
  }

  private transform(point: Point): Element[] {
    const { bounds, handle } = this;

    if (bounds === null || handle === null) {
      const deltaX = point.x - this.start.x;
      const deltaY = point.y - this.start.y;

      return this.origin.map((element) => translateElement(element, deltaX, deltaY));
    }

    const anchor = oppositeCorner(bounds, handle);
    const factor = scaleFactor(anchor, handleCorner(bounds, handle), point);

    return this.origin.map((element) => scaleElement(element, anchor, factor));
  }

  private reset(): void {
    this.origin = [];
    this.latest = [];
    this.bounds = null;
    this.handle = null;
    this.changed = false;
  }
}
