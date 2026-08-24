import { STEP_ZOOM_FACTOR } from '@/constants/camera.constants';
import { panByScreen, toBoard } from '@/core/camera/camera-transform';
import { zoomBy, zoomTo, zoomToFit } from '@/core/camera/camera-zoom';
import { boundsOfElements } from '@/core/element/element-bounds';
import { useBoardStore } from '@/renderer/stores/board.store';
import type { Point, ViewState } from '@/types';

export class CameraController {
  constructor(private readonly view: ViewState) {}

  panByScreen(deltaX: number, deltaY: number): void {
    const board = useBoardStore.getState();
    board.setCamera(panByScreen(board.camera, deltaX, deltaY));
  }

  zoomAt(factor: number, anchor: Point): void {
    const board = useBoardStore.getState();
    board.setCamera(zoomBy(board.camera, factor, anchor));
  }

  zoomStep(direction: number): void {
    this.zoomAt(direction > 0 ? STEP_ZOOM_FACTOR : 1 / STEP_ZOOM_FACTOR, this.center());
  }

  resetZoom(): void {
    const board = useBoardStore.getState();
    board.setCamera(zoomTo(board.camera, 1, this.center()));
  }

  fitContent(): void {
    const board = useBoardStore.getState();
    const bounds = boundsOfElements(board.elements.values());

    if (bounds === null) {
      this.resetZoom();
      return;
    }

    board.setCamera(zoomToFit(bounds, this.view));
  }

  boardCenter(): Point {
    return toBoard(this.view.camera, this.center());
  }

  private center(): Point {
    return { x: this.view.width / 2, y: this.view.height / 2 };
  }
}
