import { applyBoardTransform, applyScreenTransform } from '@/renderer/board/view-transform';
import type { ViewState } from '@/types';

export abstract class CanvasLayer {
  protected readonly ctx: CanvasRenderingContext2D;

  constructor(
    protected readonly canvas: HTMLCanvasElement,
    protected readonly view: ViewState,
  ) {
    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('Canvas 2D context unavailable');

    this.ctx = ctx;
  }

  resize(): void {
    const width = Math.max(1, Math.round(this.view.width * this.view.dpr));
    const height = Math.max(1, Math.round(this.view.height * this.view.dpr));
    if (this.canvas.width === width && this.canvas.height === height) return;

    this.canvas.width = width;
    this.canvas.height = height;
  }

  abstract paint(): void;

  protected clear(): void {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  protected useScreenSpace(): void {
    applyScreenTransform(this.ctx, this.view);
  }

  protected useBoardSpace(): void {
    applyBoardTransform(this.ctx, this.view);
  }
}
