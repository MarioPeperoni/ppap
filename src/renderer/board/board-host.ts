import { CameraController } from '@/renderer/board/camera-controller';
import { GestureRouter } from '@/renderer/board/input/gesture-router';
import { KeyboardRouter } from '@/renderer/board/input/keyboard-router';
import { WheelRouter } from '@/renderer/board/input/wheel-router';
import { LayerSync } from '@/renderer/board/layer-sync';
import { GridLayer } from '@/renderer/board/layers/grid-layer';
import { OverlayLayer } from '@/renderer/board/layers/overlay-layer';
import { SceneLayer } from '@/renderer/board/layers/scene-layer';
import { RenderScheduler } from '@/renderer/board/render-scheduler';
import { SelectionSync } from '@/renderer/board/selection/selection-sync';
import { ViewportTracker } from '@/renderer/board/viewport-tracker';
import { useBoardStore } from '@/renderer/stores/board.store';
import type { BoardCanvases, ToolContext, ViewState } from '@/types';

export class BoardHost {
  readonly camera: CameraController;

  private readonly view: ViewState;
  private readonly scheduler = new RenderScheduler();
  private readonly grid: GridLayer;
  private readonly scene: SceneLayer;
  private readonly overlay: OverlayLayer;
  private readonly gestures: GestureRouter;
  private readonly keyboard: KeyboardRouter;
  private readonly wheel: WheelRouter;
  private readonly viewport: ViewportTracker;
  private readonly layerSync: LayerSync;
  private readonly selectionSync = new SelectionSync();

  constructor(canvases: BoardCanvases) {
    this.view = {
      camera: useBoardStore.getState().camera,
      width: 1,
      height: 1,
      dpr: window.devicePixelRatio,
    };

    this.grid = new GridLayer(canvases.grid, this.view);
    this.scene = new SceneLayer(canvases.scene, this.view);
    this.overlay = new OverlayLayer(canvases.overlay, this.view, () => this.gestures.activeTool());

    this.scheduler.register('grid', () => {
      this.grid.paint();
    });
    this.scheduler.register('scene', () => {
      this.scene.paint();
    });
    this.scheduler.register('overlay', () => {
      this.overlay.paint();
    });

    const context: ToolContext = {
      view: this.view,
      requestOverlay: () => {
        this.scheduler.markDirty('overlay');
      },
      setCursor: (cursor) => {
        this.gestures.setToolCursor(cursor);
      },
    };

    this.camera = new CameraController(this.view);
    this.gestures = new GestureRouter(canvases.host, this.view, context);
    this.wheel = new WheelRouter(canvases.host, this.camera);
    this.keyboard = new KeyboardRouter(this.camera, {
      setPanOverride: (active) => {
        this.gestures.setPanOverride(active);
      },
      cancelGesture: () => {
        this.gestures.cancelGesture();
      },
      pointerBoard: () => this.gestures.pointerBoard(),
    });

    this.layerSync = new LayerSync(
      this.view,
      this.scheduler,
      { grid: this.grid, scene: this.scene, overlay: this.overlay },
      this.gestures,
    );

    this.viewport = new ViewportTracker(canvases.host, this.view, () => {
      this.resizeLayers();
    });
    this.viewport.measure();
  }

  destroy(): void {
    this.viewport.destroy();
    this.selectionSync.destroy();
    this.layerSync.destroy();
    this.keyboard.destroy();
    this.wheel.destroy();
    this.gestures.destroy();
    this.scheduler.stop();
  }

  private resizeLayers(): void {
    this.grid.resize();
    this.scene.resize();
    this.overlay.resize();
    this.gestures.measure();
    this.scheduler.markAllDirty();
  }
}
