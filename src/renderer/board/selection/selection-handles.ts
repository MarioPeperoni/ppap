import { HANDLE_HIT_PX, SELECTION_PADDING_PX } from '@/constants/select.constants';
import { toScreen } from '@/core/camera/camera-transform';
import { expandBounds } from '@/core/geometry/bounds';
import type { Bounds, CameraState, Point, SelectionHandle } from '@/types';

export const SELECTION_HANDLES: readonly SelectionHandle[] = ['nw', 'ne', 'se', 'sw'];

const OPPOSITE: Record<SelectionHandle, SelectionHandle> = {
  nw: 'se',
  ne: 'sw',
  se: 'nw',
  sw: 'ne',
};

export function selectionFrame(bounds: Bounds, zoom: number): Bounds {
  return expandBounds(bounds, SELECTION_PADDING_PX / zoom);
}

export function handleCorner(bounds: Bounds, handle: SelectionHandle): Point {
  return {
    x: handle === 'nw' || handle === 'sw' ? bounds.minX : bounds.maxX,
    y: handle === 'nw' || handle === 'ne' ? bounds.minY : bounds.maxY,
  };
}

export function oppositeCorner(bounds: Bounds, handle: SelectionHandle): Point {
  return handleCorner(bounds, OPPOSITE[handle]);
}

export function handleCursor(handle: SelectionHandle): string {
  return handle === 'nw' || handle === 'se' ? 'nwse-resize' : 'nesw-resize';
}

export function handleAt(
  bounds: Bounds,
  camera: CameraState,
  screen: Point,
): SelectionHandle | null {
  const frame = selectionFrame(bounds, camera.zoom);

  for (const handle of SELECTION_HANDLES) {
    const corner = toScreen(camera, handleCorner(frame, handle));
    if (Math.abs(corner.x - screen.x) > HANDLE_HIT_PX) continue;
    if (Math.abs(corner.y - screen.y) > HANDLE_HIT_PX) continue;

    return handle;
  }

  return null;
}
