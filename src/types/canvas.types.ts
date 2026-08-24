import type { CameraState } from './camera.types';

export type LayerKey = 'grid' | 'scene' | 'overlay';

export interface ViewState {
  camera: CameraState;
  width: number;
  height: number;
  dpr: number;
}

export interface BoardLayers<TGrid, TScene, TOverlay> {
  grid: TGrid;
  scene: TScene;
  overlay: TOverlay;
}

export interface BoardCanvases {
  host: HTMLElement;
  grid: HTMLCanvasElement;
  scene: HTMLCanvasElement;
  overlay: HTMLCanvasElement;
}
