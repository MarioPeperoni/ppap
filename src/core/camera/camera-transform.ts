import type { CameraState, Point } from '@/types';

export function toScreen(camera: CameraState, board: Point): Point {
  return { x: (board.x - camera.x) * camera.zoom, y: (board.y - camera.y) * camera.zoom };
}

export function toBoard(camera: CameraState, screen: Point): Point {
  return { x: screen.x / camera.zoom + camera.x, y: screen.y / camera.zoom + camera.y };
}

export function panByScreen(camera: CameraState, deltaX: number, deltaY: number): CameraState {
  return { ...camera, x: camera.x - deltaX / camera.zoom, y: camera.y - deltaY / camera.zoom };
}
