import { GRID_BASE_SPACING, GRID_FADE_IN_PX, GRID_SOLID_PX } from '@/constants/grid.constants';
import type { GridLevel } from '@/types';

export function gridLevels(zoom: number, base = GRID_BASE_SPACING): GridLevel[] {
  const steps = Math.max(0, Math.ceil(Math.log2(GRID_SOLID_PX / (base * zoom))));
  const solid = base * 2 ** steps;
  const levels: GridLevel[] = [{ spacing: solid, alpha: 1 }];

  if (steps === 0) return levels;

  const finer = solid / 2;
  const alpha = (finer * zoom - GRID_FADE_IN_PX) / (GRID_SOLID_PX - GRID_FADE_IN_PX);
  if (alpha > 0) levels.push({ spacing: finer, alpha: Math.min(1, alpha) });

  return levels;
}
