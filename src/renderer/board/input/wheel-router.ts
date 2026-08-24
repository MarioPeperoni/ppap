import { WHEEL_ZOOM_FACTOR } from '@/constants/camera.constants';
import type { CameraController } from '@/renderer/board/camera-controller';

const NOTCH_DELTA = 100;

export class WheelRouter {
  constructor(
    private readonly host: HTMLElement,
    private readonly camera: CameraController,
  ) {
    this.host.addEventListener('wheel', this.onWheel, { passive: false });
  }

  destroy(): void {
    this.host.removeEventListener('wheel', this.onWheel);
  }

  private readonly onWheel = (event: WheelEvent): void => {
    event.preventDefault();

    if (event.ctrlKey || event.metaKey) {
      const rect = this.host.getBoundingClientRect();
      const anchor = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      this.camera.zoomAt(WHEEL_ZOOM_FACTOR ** (-event.deltaY / NOTCH_DELTA), anchor);
      return;
    }

    const deltaX = event.shiftKey ? event.deltaY : event.deltaX;
    const deltaY = event.shiftKey ? 0 : event.deltaY;
    this.camera.panByScreen(-deltaX, -deltaY);
  };
}
