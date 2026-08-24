import { DEFAULT_STROKE_SCALE } from '@/constants/stroke.constants';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@/constants/tool.constants';
import { createStroke } from '@/core/element/element.factory';
import { appendPatch } from '@/core/scene/scene-patch';
import { outlineForPoints } from '@/core/stroke/stroke-outline';
import { streamlinePoint } from '@/core/stroke/stroke-streamline';
import { strokeWidth } from '@/core/stroke/stroke-width';
import { outlinePath } from '@/renderer/board/render/stroke-renderer';
import { withBoardTransform } from '@/renderer/board/view-transform';
import { commitPatch } from '@/renderer/commands/scene.command';
import { useToolStore } from '@/renderer/stores/tool.store';
import type {
  ColorToken,
  NibToken,
  Palette,
  PointerSample,
  SizeToken,
  StrokePoint,
  Tool,
  ToolContext,
  ToolId,
  ViewState,
} from '@/types';

export class StrokeTool implements Tool {
  readonly cursor = 'crosshair';

  private points: StrokePoint[] | null = null;
  private color: ColorToken = DEFAULT_COLOR;
  private size: SizeToken = DEFAULT_SIZE;

  constructor(
    readonly id: ToolId,
    readonly label: string,
    readonly keys: readonly string[],
    private readonly nib: NibToken,
  ) {}

  onPointerDown(sample: PointerSample, context: ToolContext): void {
    const { color, penSize } = useToolStore.getState();
    this.color = color;
    this.size = penSize;
    this.points = [streamlinePoint(undefined, [sample.board.x, sample.board.y, sample.pressure])];

    context.requestOverlay();
  }

  onPointerMove(sample: PointerSample, context: ToolContext): void {
    if (this.points === null) return;

    this.appendPoint(sample);
    context.requestOverlay();
  }

  onPointerUp(sample: PointerSample, context: ToolContext): void {
    if (this.points === null) return;

    this.appendPoint(sample);
    const drawn = this.points;
    this.points = null;
    context.requestOverlay();

    commitPatch('draw', appendPatch([createStroke(drawn, this.color, this.size, this.nib)]));
  }

  onCancel(context: ToolContext): void {
    if (this.points === null) return;

    this.points = null;
    context.requestOverlay();
  }

  drawOverlay(ctx: CanvasRenderingContext2D, view: ViewState, colors: Palette): void {
    const drawing = this.points;
    if (drawing === null) return;

    withBoardTransform(ctx, view, () => {
      ctx.fillStyle = colors[this.color];
      ctx.fill(
        outlinePath(
          outlineForPoints(drawing, strokeWidth(this.size, DEFAULT_STROKE_SCALE), this.nib),
        ),
      );
    });
  }

  private appendPoint(sample: PointerSample): void {
    if (this.points === null) return;

    const last = this.points[this.points.length - 1];
    if (last !== undefined && last[0] === sample.board.x && last[1] === sample.board.y) return;

    this.points.push(streamlinePoint(last, [sample.board.x, sample.board.y, sample.pressure]));
  }
}
