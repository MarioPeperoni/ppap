import { MIN_SELECTION_SCALE, ROTATE_SNAP_RADIANS } from '@/constants/select.constants';
import { angleTo, snapAngle } from '@/core/geometry/rotation';
import { updatePatch } from '@/core/scene/scene-patch';
import { rotateElement, scaleElement, translateElement } from '@/core/select/select-transform';
import { frameCorner, oppositeCorner } from '@/core/select/selection-frame';
import { sceneCommand } from '@/renderer/commands/scene.command';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useHistoryStore } from '@/renderer/stores/history.store';
import type { Element, Point, SelectionFrame, SelectionGrip } from '@/types';

interface DragGesture {
  origin: readonly Element[];
  frame: SelectionFrame;
  start: Point;
  grip: SelectionGrip;
}

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

function turned(gesture: DragGesture, point: Point, snap: boolean): number {
  const { center } = gesture.frame;
  const angle = angleTo(center, point) - angleTo(center, gesture.start);

  return snap ? snapAngle(angle, ROTATE_SNAP_RADIANS) : angle;
}

export class SelectionDrag {
  private gesture: DragGesture | null = null;
  private latest: readonly Element[] = [];
  private changed = false;

  begin(
    elements: readonly Element[],
    frame: SelectionFrame,
    start: Point,
    grip: SelectionGrip,
  ): void {
    this.gesture = { origin: elements, frame, start, grip };
    this.latest = elements;
    this.changed = false;
  }

  update(point: Point, snap: boolean): void {
    const gesture = this.gesture;
    if (gesture === null || gesture.origin.length === 0) return;
    if (!this.changed && point.x === gesture.start.x && point.y === gesture.start.y) return;

    this.latest = this.transform(gesture, point, snap);
    this.changed = true;
    useBoardStore.getState().applyScenePatch(updatePatch(this.latest));
  }

  finish(): void {
    const gesture = this.gesture;

    if (gesture !== null && this.changed) {
      useHistoryStore
        .getState()
        .record(
          sceneCommand(
            gesture.grip.kind,
            [updatePatch(this.latest)],
            [updatePatch(gesture.origin)],
          ),
        );
    }

    this.reset();
  }

  cancel(): void {
    const gesture = this.gesture;
    if (gesture !== null && this.changed) {
      useBoardStore.getState().applyScenePatch(updatePatch(gesture.origin));
    }

    this.reset();
  }

  private transform(gesture: DragGesture, point: Point, snap: boolean): Element[] {
    const { origin, frame, grip, start } = gesture;

    switch (grip.kind) {
      case 'move':
        return origin.map((element) =>
          translateElement(element, point.x - start.x, point.y - start.y),
        );
      case 'scale': {
        const anchor = oppositeCorner(frame, grip.handle);
        const factor = scaleFactor(anchor, frameCorner(frame, grip.handle), point);

        return origin.map((element) => scaleElement(element, anchor, factor));
      }
      case 'rotate': {
        const angle = turned(gesture, point, snap);

        return origin.map((element) => rotateElement(element, frame.center, angle));
      }
    }
  }

  private reset(): void {
    this.gesture = null;
    this.latest = [];
    this.changed = false;
  }
}
