import { describe, expect, it } from 'vitest';
import { GRID_BASE_SPACING, GRID_SOLID_PX } from '@/constants/grid.constants';
import { gridLevels } from '@/core/grid/grid-levels';

describe('grid levels', () => {
  it('draws a single base level when it is wide enough on screen', () => {
    expect(gridLevels(2)).toEqual([{ spacing: GRID_BASE_SPACING, alpha: 1 }]);
  });

  it('keeps the solid level at least as wide as the solid threshold', () => {
    for (let zoom = 0.1; zoom <= 8; zoom += 0.01) {
      const level = gridLevels(zoom)[0];

      expect(level).toBeDefined();
      if (level === undefined) continue;
      expect(level.alpha).toBe(1);
      expect(level.spacing * zoom).toBeGreaterThanOrEqual(GRID_SOLID_PX - 1e-9);
    }
  });

  it('fades the finer level in linearly between 16 and 28 px', () => {
    expect(gridLevels(16 / (GRID_BASE_SPACING * 2))).toHaveLength(1);

    const half = gridLevels(22 / (GRID_BASE_SPACING * 2));

    expect(half).toHaveLength(2);
    expect(half[1]?.spacing).toBe(GRID_BASE_SPACING * 2);
    expect(half[1]?.alpha).toBeCloseTo(0.5, 10);
  });

  it('never returns an alpha outside 0..1', () => {
    for (let zoom = 0.1; zoom <= 8; zoom += 0.005) {
      for (const level of gridLevels(zoom)) {
        expect(level.alpha).toBeGreaterThan(0);
        expect(level.alpha).toBeLessThanOrEqual(1);
      }
    }
  });
});
