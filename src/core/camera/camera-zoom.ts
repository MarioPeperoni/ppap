import { FIT_MAX_ZOOM, FIT_PADDING, MAX_ZOOM, MIN_ZOOM } from '@/constants/camera.constants';
import { toBoard } from '@/core/camera/camera-transform';
import type { Bounds, CameraState, Point, Size } from '@/types';

export function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function zoomTo(camera: CameraState, zoom: number, anchor: Point): CameraState {
  const next = clampZoom(zoom);
  const board = toBoard(camera, anchor);

  return { x: board.x - anchor.x / next, y: board.y - anchor.y / next, zoom: next };
}

export function zoomBy(camera: CameraState, factor: number, anchor: Point): CameraState {
  return zoomTo(camera, camera.zoom * factor, anchor);
}

export function zoomToFit(
  bounds: Bounds,
  viewport: Size,
  padding = FIT_PADDING,
  maxZoom = FIT_MAX_ZOOM,
): CameraState {
  const width = bounds.maxX - bounds.minX + padding * 2;
  const height = bounds.maxY - bounds.minY + padding * 2;
  const byWidth = width > 0 ? viewport.width / width : maxZoom;
  const byHeight = height > 0 ? viewport.height / height : maxZoom;
  const zoom = clampZoom(Math.min(byWidth, byHeight, maxZoom));

  return {
    x: (bounds.minX + bounds.maxX) / 2 - viewport.width / (2 * zoom),
    y: (bounds.minY + bounds.maxY) / 2 - viewport.height / (2 * zoom),
    zoom,
  };
}
