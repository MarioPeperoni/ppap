import { isAppendOnly } from '@/core/scene/scene-patch';
import type { GestureRouter } from '@/renderer/board/input/gesture-router';
import type { GridLayer } from '@/renderer/board/layers/grid-layer';
import type { OverlayLayer } from '@/renderer/board/layers/overlay-layer';
import type { SceneLayer } from '@/renderer/board/layers/scene-layer';
import type { RenderScheduler } from '@/renderer/board/render-scheduler';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useThemeStore } from '@/renderer/stores/theme.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import { watchStore } from '@/renderer/stores/watch-store';
import { cssPalette } from '@/renderer/theme/css-palette';
import type { BoardLayers, ViewState } from '@/types';

export class LayerSync {
  private readonly unwatch: (() => void)[] = [];

  constructor(
    private readonly view: ViewState,
    private readonly scheduler: RenderScheduler,
    private readonly layers: BoardLayers<GridLayer, SceneLayer, OverlayLayer>,
    private readonly gestures: GestureRouter,
  ) {
    this.unwatch.push(
      watchStore(useBoardStore, (state) => state.camera, this.onCameraChange),
      watchStore(useBoardStore, (state) => state.elements, this.onElementsChange),
      watchStore(useBoardStore, (state) => state.gridVisible, this.onGridChange),
      watchStore(useBoardStore, (state) => state.selection, this.onSelectionChange),
      watchStore(useThemeStore, (state) => state.theme, this.onThemeChange),
      watchStore(useToolStore, (state) => state.tool, this.onToolChange),
    );
  }

  destroy(): void {
    for (const unwatch of this.unwatch) unwatch();
  }

  private readonly onCameraChange = (camera: ViewState['camera']): void => {
    this.view.camera = camera;
    this.layers.scene.invalidate();
    this.scheduler.markAllDirty();
  };

  private readonly onElementsChange = (): void => {
    const { lastPatch } = useBoardStore.getState();

    if (lastPatch !== null && isAppendOnly(lastPatch)) {
      this.layers.scene.append(lastPatch.added.map((placement) => placement.element));
    } else {
      this.layers.scene.invalidate();
    }

    this.scheduler.markDirty('scene');
    this.scheduler.markDirty('overlay');
  };

  private readonly onGridChange = (): void => {
    this.scheduler.markDirty('grid');
  };

  private readonly onThemeChange = (): void => {
    cssPalette.invalidate();
    this.layers.scene.invalidate();
    this.scheduler.markAllDirty();
  };

  private readonly onSelectionChange = (): void => {
    this.scheduler.markDirty('overlay');
  };

  private readonly onToolChange = (): void => {
    this.gestures.setToolCursor(null);
    this.scheduler.markDirty('overlay');
  };
}
