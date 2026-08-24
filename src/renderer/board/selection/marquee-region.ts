import { boundsCorners, segmentBounds } from '@/core/geometry/bounds';
import { EMPTY_PATCH } from '@/core/scene/scene-patch';
import { selectInShape } from '@/core/select/select-region';
import { polygonShape } from '@/core/select/selection-shape';
import { drawRegion } from '@/renderer/board/selection/selection-overlay';
import type {
  Bounds,
  Element,
  Palette,
  Point,
  PointerSample,
  SelectionRegion,
  SelectionResult,
  ViewState,
} from '@/types';

export class MarqueeRegion implements SelectionRegion {
  private start: Point | null = null;
  private current: Point | null = null;

  begin(sample: PointerSample): void {
    this.start = sample.board;
    this.current = sample.board;
  }

  extend(sample: PointerSample): void {
    if (this.start === null) return;

    this.current = sample.board;
  }

  clear(): void {
    this.start = null;
    this.current = null;
  }

  select(elements: Iterable<Element>): SelectionResult {
    const rect = this.rect();
    if (rect === null) return { ids: [], patch: EMPTY_PATCH };

    return selectInShape(elements, polygonShape(boundsCorners(rect)));
  }

  draw(ctx: CanvasRenderingContext2D, view: ViewState, colors: Palette): void {
    const rect = this.rect();
    if (rect === null) return;

    drawRegion(ctx, view, colors, boundsCorners(rect));
  }

  private rect(): Bounds | null {
    if (this.start === null || this.current === null) return null;

    return segmentBounds(this.start, this.current);
  }
}
