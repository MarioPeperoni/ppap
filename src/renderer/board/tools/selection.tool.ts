import { CLICK_SLOP_PX, PICK_SLOP_PX } from '@/constants/select.constants';
import { isEmptyPatch } from '@/core/scene/scene-patch';
import { pickElement } from '@/core/select/select-pick';
import { SelectionDrag } from '@/renderer/board/selection/selection-drag';
import { gripAt, gripCursor } from '@/renderer/board/selection/selection-handles';
import { drawSelectionBox } from '@/renderer/board/selection/selection-overlay';
import { selectedElements, selectedFrame } from '@/renderer/board/selection/selection-query';
import { commitSelectionPatch } from '@/renderer/commands/selection.command';
import { useBoardStore } from '@/renderer/stores/board.store';
import type {
  Palette,
  Point,
  PointerSample,
  SelectionGesture,
  SelectionRegion,
  SelectionResult,
  Tool,
  ToolContext,
  ToolId,
  ViewState,
} from '@/types';

export class SelectionTool implements Tool {
  readonly keepsFocus = false;

  private readonly drag = new SelectionDrag();
  private gesture: SelectionGesture = 'idle';
  private pressed: Point = { x: 0, y: 0 };

  constructor(
    readonly id: ToolId,
    readonly label: string,
    readonly cursor: string,
    private readonly region: SelectionRegion,
  ) {}

  onPointerDown(sample: PointerSample, context: ToolContext): void {
    if (this.beginTransform(sample, context)) return;

    this.gesture = 'region';
    this.pressed = sample.screen;
    useBoardStore.getState().setSelection([]);
    this.region.begin(sample);
    context.requestOverlay();
  }

  onPointerMove(sample: PointerSample, context: ToolContext): void {
    switch (this.gesture) {
      case 'transform':
        this.drag.update(sample.board, sample.shiftKey);
        break;
      case 'region':
        this.region.extend(sample);
        break;
      case 'idle':
        context.setCursor(this.hoverCursor(sample, context.view));
        return;
    }

    context.requestOverlay();
  }

  onPointerUp(sample: PointerSample, context: ToolContext): void {
    switch (this.gesture) {
      case 'transform':
        this.drag.finish();
        break;
      case 'region': {
        this.region.extend(sample);
        this.finishRegion(sample, context);
        this.region.clear();
        break;
      }
      case 'idle':
        return;
    }

    this.gesture = 'idle';
    context.setCursor(this.hoverCursor(sample, context.view));
    context.requestOverlay();
  }

  onCancel(context: ToolContext): void {
    if (this.gesture === 'transform') this.drag.cancel();

    this.region.clear();
    this.gesture = 'idle';
    context.setCursor(null);
    context.requestOverlay();
  }

  drawOverlay(ctx: CanvasRenderingContext2D, view: ViewState, colors: Palette): void {
    this.region.draw(ctx, view, colors);

    const frame = selectedFrame();
    if (frame !== null) drawSelectionBox(ctx, view, colors, frame);
  }

  private finishRegion(sample: PointerSample, context: ToolContext): void {
    const dragged = Math.hypot(sample.screen.x - this.pressed.x, sample.screen.y - this.pressed.y);

    if (dragged <= CLICK_SLOP_PX) {
      this.pick(sample, context);
      return;
    }

    const { elements } = useBoardStore.getState();
    this.apply(this.region.select(elements.values()));
  }

  private pick(sample: PointerSample, context: ToolContext): void {
    const { elements, setSelection } = useBoardStore.getState();
    const picked = pickElement(
      elements.values(),
      sample.board,
      PICK_SLOP_PX / context.view.camera.zoom,
    );

    setSelection(picked === null ? [] : [picked]);
  }

  private apply(result: SelectionResult): void {
    if (isEmptyPatch(result.patch)) {
      useBoardStore.getState().setSelection(result.ids);
      return;
    }

    commitSelectionPatch('select', result.patch, result.ids);
  }

  private beginTransform(sample: PointerSample, context: ToolContext): boolean {
    const frame = selectedFrame();
    if (frame === null) return false;

    const grip = gripAt(frame, context.view.camera, sample);
    if (grip === null) return false;

    this.gesture = 'transform';
    this.drag.begin(selectedElements(), frame, sample.board, grip);
    context.setCursor(gripCursor(grip, frame.rotation));

    return true;
  }

  private hoverCursor(sample: PointerSample, view: ViewState): string | null {
    const frame = selectedFrame();
    if (frame === null) return null;

    const grip = gripAt(frame, view.camera, sample);

    return grip === null ? null : gripCursor(grip, frame.rotation);
  }
}
