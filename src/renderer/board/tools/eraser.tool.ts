import { eraseSegment } from '@/core/erase/erase-stroke';
import { sceneCommand } from '@/renderer/commands/scene.command';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useHistoryStore } from '@/renderer/stores/history.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import type {
  Palette,
  Point,
  PointerSample,
  ScenePatch,
  Tool,
  ToolContext,
  ViewState,
} from '@/types';

const TAU = Math.PI * 2;
const CURSOR_ALPHA = 0.6;

export class EraserTool implements Tool {
  readonly id = 'eraser';
  readonly label = 'Eraser';
  readonly keys = ['e', '2'];
  readonly cursor = 'none';

  private hover: Point | null = null;
  private previous: Point | null = null;
  private forward: ScenePatch[] = [];
  private backward: ScenePatch[] = [];

  onPointerDown(sample: PointerSample, context: ToolContext): void {
    this.forward = [];
    this.backward = [];
    this.previous = sample.board;
    this.hover = sample.board;

    this.eraseBetween(sample.board, sample.board);
    context.requestOverlay();
  }

  onPointerMove(sample: PointerSample, context: ToolContext): void {
    this.hover = sample.board;

    if (this.previous !== null) {
      this.eraseBetween(this.previous, sample.board);
      this.previous = sample.board;
    }

    context.requestOverlay();
  }

  onPointerUp(sample: PointerSample, context: ToolContext): void {
    if (this.previous !== null) this.eraseBetween(this.previous, sample.board);

    this.finishGesture();
    context.requestOverlay();
  }

  onCancel(context: ToolContext): void {
    this.hover = null;
    this.finishGesture();
    context.requestOverlay();
  }

  drawOverlay(ctx: CanvasRenderingContext2D, view: ViewState, colors: Palette): void {
    if (this.hover === null) return;

    const { camera } = view;
    ctx.beginPath();
    ctx.arc(
      (this.hover.x - camera.x) * camera.zoom,
      (this.hover.y - camera.y) * camera.zoom,
      useToolStore.getState().eraserRadius,
      0,
      TAU,
    );
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1;
    ctx.globalAlpha = CURSOR_ALPHA;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  private eraseBetween(from: Point, to: Point): void {
    const board = useBoardStore.getState();
    const radius = useToolStore.getState().eraserRadius / board.camera.zoom;
    const hits = eraseSegment(board.elements.values(), from, to, radius);
    if (hits.length === 0) return;

    const patch: ScenePatch = {
      removed: hits.map((hit) => hit.source.id),
      added: hits.flatMap((hit) =>
        hit.fragments.map((fragment) => ({ element: fragment, before: hit.source.id })),
      ),
      updated: [],
    };

    this.forward.push(patch);
    this.backward.push(board.applyScenePatch(patch));
  }

  private finishGesture(): void {
    this.previous = null;
    if (this.forward.length === 0) return;

    useHistoryStore.getState().record(sceneCommand('erase', this.forward, this.backward));
    this.forward = [];
    this.backward = [];
  }
}
