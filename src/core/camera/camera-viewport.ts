import { toBoard } from '@/core/camera/camera-transform';
import type { Bounds, CameraState, Size } from '@/types';

export function visibleBounds(camera: CameraState, viewport: Size): Bounds {
  const bottomRight = toBoard(camera, { x: viewport.width, y: viewport.height });

  return { minX: camera.x, minY: camera.y, maxX: bottomRight.x, maxY: bottomRight.y };
}
