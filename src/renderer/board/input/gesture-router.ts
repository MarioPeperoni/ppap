import { toBoard } from '@/core/camera/camera-transform';
import { getTool } from '@/renderer/board/tools/tool-registry';
import { useToolStore } from '@/renderer/stores/tool.store';
import type { Point, PointerSample, Tool, ToolContext, ViewState } from '@/types';

const MIDDLE_BUTTON = 1;
const FALLBACK_PRESSURE = 0.5;

export class GestureRouter {
  private rect = new DOMRect();
  private gestureTool: Tool | null = null;
  private activePointer: number | null = null;
  private panOverride = false;
  private toolCursor: string | null = null;
  private lastBoard: Point | null = null;

  constructor(
    private readonly host: HTMLElement,
    private readonly view: ViewState,
    private readonly context: ToolContext,
  ) {
    this.host.addEventListener('pointerdown', this.onPointerDown);
    this.host.addEventListener('pointermove', this.onPointerMove);
    this.host.addEventListener('pointerup', this.onPointerUp);
    this.host.addEventListener('pointercancel', this.onPointerCancel);
    this.host.addEventListener('pointerleave', this.onPointerLeave);
    this.applyCursor();
  }

  destroy(): void {
    this.host.removeEventListener('pointerdown', this.onPointerDown);
    this.host.removeEventListener('pointermove', this.onPointerMove);
    this.host.removeEventListener('pointerup', this.onPointerUp);
    this.host.removeEventListener('pointercancel', this.onPointerCancel);
    this.host.removeEventListener('pointerleave', this.onPointerLeave);
  }

  activeTool(): Tool {
    return this.gestureTool ?? getTool(useToolStore.getState().tool);
  }

  cancelGesture(): void {
    this.activeTool().onCancel(this.context);
  }

  setPanOverride(active: boolean): void {
    this.panOverride = active;
    this.applyCursor();
  }

  setToolCursor(cursor: string | null): void {
    this.toolCursor = cursor;
    this.applyCursor();
  }

  pointerBoard(): Point | null {
    return this.lastBoard;
  }

  measure(): void {
    this.rect = this.host.getBoundingClientRect();
  }

  applyCursor(): void {
    if (this.gestureTool?.id === 'hand') {
      this.host.style.cursor = 'grabbing';
      return;
    }

    if (this.panOverride) {
      this.host.style.cursor = 'grab';
      return;
    }

    this.host.style.cursor = this.toolCursor ?? getTool(useToolStore.getState().tool).cursor;
  }

  private sampleOf(event: PointerEvent): PointerSample {
    const screen = { x: event.clientX - this.rect.left, y: event.clientY - this.rect.top };
    this.lastBoard = toBoard(this.view.camera, screen);

    return {
      board: this.lastBoard,
      screen,
      pressure: event.pressure === 0 ? FALLBACK_PRESSURE : event.pressure,
      pointerType: event.pointerType,
      buttons: event.buttons,
      shiftKey: event.shiftKey,
    };
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (this.activePointer !== null) return;

    this.measure();
    this.activePointer = event.pointerId;
    this.gestureTool =
      this.panOverride || event.button === MIDDLE_BUTTON
        ? getTool('hand')
        : getTool(useToolStore.getState().tool);

    this.host.setPointerCapture(event.pointerId);
    this.applyCursor();
    this.gestureTool.onPointerDown(this.sampleOf(event), this.context);
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    const tool = this.activeTool();

    if (this.activePointer !== event.pointerId) {
      tool.onPointerMove(this.sampleOf(event), this.context);
      return;
    }

    const coalesced = event.getCoalescedEvents();
    for (const sample of coalesced.length > 0 ? coalesced : [event]) {
      tool.onPointerMove(this.sampleOf(sample), this.context);
    }
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (this.activePointer !== event.pointerId) return;

    const tool = this.activeTool();
    this.host.releasePointerCapture(event.pointerId);
    this.activePointer = null;
    tool.onPointerUp(this.sampleOf(event), this.context);
    this.endGesture();
  };

  private readonly onPointerCancel = (event: PointerEvent): void => {
    if (this.activePointer !== event.pointerId) return;

    const tool = this.activeTool();
    this.activePointer = null;
    tool.onCancel(this.context);
    this.endGesture();
  };

  private readonly onPointerLeave = (): void => {
    if (this.activePointer !== null) return;

    this.lastBoard = null;
    this.activeTool().onCancel(this.context);
  };

  private endGesture(): void {
    this.gestureTool = null;
    this.applyCursor();
  }
}
