import { MAX_STROKE_FRAGMENTS } from '@/constants/fragment.constants';
import { elementBounds } from '@/core/element/element-bounds';
import { boundsCenter, boundsIntersect } from '@/core/geometry/bounds';
import { runsInShape } from '@/core/select/stroke-runs';
import { fragmentOf, isSubstantialRun } from '@/core/stroke/stroke-fragment';
import type {
  Element,
  ElementPlacement,
  SelectionResult,
  SelectionShape,
  StrokeElement,
  StrokeRun,
} from '@/types';

interface StrokeFragment {
  element: StrokeElement;
  inside: boolean;
}

function fragmentsOf(stroke: StrokeElement, runs: readonly StrokeRun[]): StrokeFragment[] {
  return runs
    .filter((run) => isSubstantialRun(run.points))
    .map((run) => ({ element: fragmentOf(stroke, run.points), inside: run.inside }));
}

export function selectInShape(elements: Iterable<Element>, shape: SelectionShape): SelectionResult {
  const ids: string[] = [];
  const removed: string[] = [];
  const added: ElementPlacement[] = [];

  for (const element of elements) {
    const bounds = elementBounds(element);
    if (!boundsIntersect(bounds, shape.bounds)) continue;

    if (element.type !== 'stroke') {
      if (shape.contains(boundsCenter(bounds))) ids.push(element.id);
      continue;
    }

    const runs = runsInShape(element.points, shape);
    if (!runs.some((run) => run.inside)) continue;

    if (runs.length === 1) {
      ids.push(element.id);
      continue;
    }

    const fragments = fragmentsOf(element, runs);
    const covered = fragments.filter((fragment) => fragment.inside);

    if (covered.length === 0) continue;

    if (fragments.length > MAX_STROKE_FRAGMENTS) {
      ids.push(element.id);
      continue;
    }

    removed.push(element.id);
    for (const fragment of fragments) added.push({ element: fragment.element, before: element.id });
    for (const fragment of covered) ids.push(fragment.element.id);
  }

  return { ids, patch: { removed, added, updated: [] } };
}
