import { CanvasLayer } from '@/renderer/board/layers/canvas-layer';
import { cssPalette } from '@/renderer/theme/css-palette';
import type { Tool, ViewState } from '@/types';

export class OverlayLayer extends CanvasLayer {
  constructor(
    canvas: HTMLCanvasElement,
    view: ViewState,
    private readonly activeTool: () => Tool,
  ) {
    super(canvas, view);
  }

  override paint(): void {
    this.clear();
    this.useScreenSpace();
    this.activeTool().drawOverlay(this.ctx, this.view, cssPalette.read());
  }
}
