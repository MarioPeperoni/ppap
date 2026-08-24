import { STEP_ZOOM_FACTOR } from '@/constants/camera.constants';
import { panByScreen } from '@/core/camera/camera-transform';
import { zoomBy, zoomTo, zoomToFit } from '@/core/camera/camera-zoom';
import { elementBounds } from '@/core/element/element-bounds';
import { unionBounds } from '@/core/geometry/bounds';
import { useBoardStore } from '@/renderer/stores/board.store';
import type { Bounds, Point, ViewState } from '@/types';

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
    const bounds = this.contentBounds();

    if (bounds === null) {
      this.resetZoom();
      return;
    }

    board.setCamera(zoomToFit(bounds, this.view));
  }

  private contentBounds(): Bounds | null {
    let bounds: Bounds | null = null;

    for (const element of useBoardStore.getState().elements.values()) {
      const box = elementBounds(element);
      bounds = bounds === null ? box : unionBounds(bounds, box);
    }

    return bounds;
  }

  private center(): Point {
    return { x: this.view.width / 2, y: this.view.height / 2 };
  }
}
