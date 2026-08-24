import { GRID_DOT_RADIUS_PX } from '@/constants/grid.constants';
import { visibleBounds } from '@/core/camera/camera-viewport';
import { gridLevels } from '@/core/grid/grid-levels';
import { CanvasLayer } from '@/renderer/board/layers/canvas-layer';
import { useBoardStore } from '@/renderer/stores/board.store';
import { cssPalette } from '@/renderer/theme/css-palette';
import type { Bounds, GridLevel } from '@/types';

const TAU = Math.PI * 2;

export class GridLayer extends CanvasLayer {
  override paint(): void {
    this.clear();
    if (!useBoardStore.getState().gridVisible) return;

    this.useScreenSpace();
    this.ctx.fillStyle = cssPalette.read().dots;

    const bounds = visibleBounds(this.view.camera, this.view);
    for (const level of gridLevels(this.view.camera.zoom)) {
      this.ctx.globalAlpha = level.alpha;
      this.ctx.fill(this.dotsFor(level, bounds));
    }

    this.ctx.globalAlpha = 1;
  }

  private dotsFor(level: GridLevel, bounds: Bounds): Path2D {
    const { camera } = this.view;
    const path = new Path2D();
    const firstX = Math.floor(bounds.minX / level.spacing) * level.spacing;
    const firstY = Math.floor(bounds.minY / level.spacing) * level.spacing;

    for (let x = firstX; x <= bounds.maxX; x += level.spacing) {
      const screenX = (x - camera.x) * camera.zoom;

      for (let y = firstY; y <= bounds.maxY; y += level.spacing) {
        const screenY = (y - camera.y) * camera.zoom;
        path.moveTo(screenX + GRID_DOT_RADIUS_PX, screenY);
        path.arc(screenX, screenY, GRID_DOT_RADIUS_PX, 0, TAU);
      }
    }

    return path;
  }
}
