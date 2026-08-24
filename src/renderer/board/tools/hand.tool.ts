import { panByScreen } from '@/core/camera/camera-transform';
import { useBoardStore } from '@/renderer/stores/board.store';
import type { PanOrigin, PointerSample, Tool } from '@/types';

export class HandTool implements Tool {
  readonly id = 'hand';
  readonly label = 'Hand';
  readonly keys = ['h', '6'];
  readonly cursor = 'grab';

  private origin: PanOrigin | null = null;

  onPointerDown(sample: PointerSample): void {
    this.origin = { screen: sample.screen, camera: useBoardStore.getState().camera };
  }

  onPointerMove(sample: PointerSample): void {
    if (this.origin === null) return;

    const { screen, camera } = this.origin;
    useBoardStore
      .getState()
      .setCamera(panByScreen(camera, sample.screen.x - screen.x, sample.screen.y - screen.y));
  }

  onPointerUp(): void {
    this.origin = null;
  }

  onCancel(): void {
    this.origin = null;
  }

  drawOverlay(): void {
    return;
  }
}
