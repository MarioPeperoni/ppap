import { LASSO_MIN_STEP_PX } from '@/constants/select.constants';
import { EMPTY_PATCH } from '@/core/scene/scene-patch';
import { selectInShape } from '@/core/select/select-region';
import { polygonShape } from '@/core/select/selection-shape';
import { drawRegion } from '@/renderer/board/selection/selection-overlay';
import type {
  Element,
  Palette,
  Point,
  PointerSample,
  SelectionRegion,
  SelectionResult,
  ViewState,
} from '@/types';

export class LassoRegion implements SelectionRegion {
  private points: Point[] = [];
  private lastScreen: Point | null = null;

  begin(sample: PointerSample): void {
    this.points = [sample.board];
    this.lastScreen = sample.screen;
  }

  extend(sample: PointerSample): void {
    if (this.lastScreen === null) return;

    const step = Math.hypot(
      sample.screen.x - this.lastScreen.x,
      sample.screen.y - this.lastScreen.y,
    );
    if (step < LASSO_MIN_STEP_PX) return;

    this.points.push(sample.board);
    this.lastScreen = sample.screen;
  }

  clear(): void {
    this.points = [];
    this.lastScreen = null;
  }

  select(elements: Iterable<Element>): SelectionResult {
    if (this.points.length < 3) return { ids: [], patch: EMPTY_PATCH };

    return selectInShape(elements, polygonShape(this.points));
  }

  draw(ctx: CanvasRenderingContext2D, view: ViewState, colors: Palette): void {
    if (this.points.length < 2) return;

    drawRegion(ctx, view, colors, this.points);
  }
}
