import { toBoard } from '@/core/camera/camera-transform';
import { insertImages } from '@/renderer/board/images/image-insert';
import type { Point, ViewState } from '@/types';

export class DropRouter {
  constructor(
    private readonly host: HTMLElement,
    private readonly view: ViewState,
  ) {
    this.host.addEventListener('dragover', this.onDragOver);
    this.host.addEventListener('drop', this.onDrop);
  }

  destroy(): void {
    this.host.removeEventListener('dragover', this.onDragOver);
    this.host.removeEventListener('drop', this.onDrop);
  }

  private readonly onDragOver = (event: DragEvent): void => {
    event.preventDefault();
    if (event.dataTransfer !== null) event.dataTransfer.dropEffect = 'copy';
  };

  private readonly onDrop = (event: DragEvent): void => {
    event.preventDefault();

    const files = [...(event.dataTransfer?.files ?? [])];
    if (files.length === 0) return;

    void insertImages(files, this.boardPoint(event));
  };

  private boardPoint(event: DragEvent): Point {
    const rect = this.host.getBoundingClientRect();

    return toBoard(this.view.camera, { x: event.clientX - rect.left, y: event.clientY - rect.top });
  }
}
