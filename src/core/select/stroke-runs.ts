import { lerpStrokePoint, toPoint } from '@/core/stroke/stroke-point';
import type { SelectionShape, StrokePoint, StrokeRun } from '@/types';

/** Cuts a stroke where it crosses the shape, so each run lies wholly inside or wholly outside. */
export function runsInShape(points: readonly StrokePoint[], shape: SelectionShape): StrokeRun[] {
  const runs: StrokeRun[] = [];
  let current: StrokePoint[] = [];
  let inside = false;
  let open = false;

  function close(): void {
    if (open && current.length > 0) runs.push({ points: current, inside });
  }

  function piece(start: StrokePoint, end: StrokePoint, within: boolean): void {
    if (open && within === inside) {
      current.push(end);
      return;
    }

    close();
    current = [start, end];
    inside = within;
    open = true;
  }

  const only = points[0];
  if (only === undefined) return runs;

  if (points.length === 1) {
    return [{ points: [only], inside: shape.contains(toPoint(only)) }];
  }

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    if (start === undefined || end === undefined) continue;

    let previous = 0;

    for (const crossing of [...shape.crossings(toPoint(start), toPoint(end)), 1]) {
      const middle = lerpStrokePoint(start, end, (previous + crossing) / 2);
      piece(
        previous === 0 ? start : lerpStrokePoint(start, end, previous),
        crossing === 1 ? end : lerpStrokePoint(start, end, crossing),
        shape.contains(toPoint(middle)),
      );
      previous = crossing;
    }
  }

  close();

  return runs;
}
