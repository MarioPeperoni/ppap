import { CLICK_SLOP_PX, PICK_SLOP_PX } from '@/constants/select.constants';
import { boundsContainPoint } from '@/core/geometry/bounds';
import { isEmptyPatch } from '@/core/scene/scene-patch';
import { pickElement } from '@/core/select/select-pick';
import { SelectionDrag } from '@/renderer/board/selection/selection-drag';
import {
  handleAt,
  handleCursor,
  selectionFrame,
} from '@/renderer/board/selection/selection-handles';
import { drawSelectionBox } from '@/renderer/board/selection/selection-overlay';
import { selectedBounds, selectedElements } from '@/renderer/board/selection/selection-query';
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
  readonly cursor = 'crosshair';
  readonly keepsFocus = false;

  private readonly drag = new SelectionDrag();
  private gesture: SelectionGesture = 'idle';
  private pressed: Point = { x: 0, y: 0 };

  constructor(
    readonly id: ToolId,
    readonly label: string,
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
        this.drag.update(sample.board);
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

    const bounds = selectedBounds();
    if (bounds !== null) drawSelectionBox(ctx, view, colors, bounds);
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
    const bounds = selectedBounds();
    if (bounds === null) return false;

    const handle = handleAt(bounds, context.view.camera, sample.screen);
    const inside = boundsContainPoint(
      selectionFrame(bounds, context.view.camera.zoom),
      sample.board,
    );
    if (handle === null && !inside) return false;

    this.gesture = 'transform';
    this.drag.begin(selectedElements(), bounds, sample.board, handle);
    context.setCursor(handle === null ? 'move' : handleCursor(handle));

    return true;
  }

  private hoverCursor(sample: PointerSample, view: ViewState): string | null {
    const bounds = selectedBounds();
    if (bounds === null) return null;

    const handle = handleAt(bounds, view.camera, sample.screen);
    if (handle !== null) return handleCursor(handle);

    return boundsContainPoint(selectionFrame(bounds, view.camera.zoom), sample.board)
      ? 'move'
      : null;
  }
}
