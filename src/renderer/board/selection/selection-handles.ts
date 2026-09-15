import { HANDLE_HIT_PX, ROTATE_REACH_PX, SELECTION_PADDING_PX } from '@/constants/select.constants';
import { toScreen } from '@/core/camera/camera-transform';
import {
  frameContainsPoint,
  frameCorner,
  frameGrip,
  handleAngle,
  padFrame,
  SELECTION_HANDLES,
} from '@/core/select/selection-frame';
import { ROTATE_CURSOR } from '@/renderer/board/selection/rotate-cursor';
import type { CameraState, Point, PointerSample, SelectionFrame, SelectionGrip } from '@/types';

const RESIZE_CURSORS: readonly string[] = ['ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize'];
const EIGHTH_TURN = Math.PI / 4;

export function paddedFrame(frame: SelectionFrame, zoom: number): SelectionFrame {
  return padFrame(frame, SELECTION_PADDING_PX / zoom);
}

export function rotateGrip(frame: SelectionFrame, zoom: number): Point {
  return frameGrip(frame, ROTATE_REACH_PX / zoom);
}

function withinHit(camera: CameraState, at: Point, screen: Point): boolean {
  const target = toScreen(camera, at);

  return (
    Math.abs(target.x - screen.x) <= HANDLE_HIT_PX && Math.abs(target.y - screen.y) <= HANDLE_HIT_PX
  );
}

export function gripAt(
  frame: SelectionFrame,
  camera: CameraState,
  sample: PointerSample,
): SelectionGrip | null {
  const padded = paddedFrame(frame, camera.zoom);

  if (withinHit(camera, rotateGrip(padded, camera.zoom), sample.screen)) return { kind: 'rotate' };

  for (const handle of SELECTION_HANDLES) {
    if (withinHit(camera, frameCorner(padded, handle), sample.screen)) {
      return { kind: 'scale', handle };
    }
  }

  return frameContainsPoint(padded, sample.board) ? { kind: 'move' } : null;
}

/** The corner's own direction, turned with the frame, picks the arrow that matches it. */
function resizeCursor(angle: number): string {
  const index = ((Math.round(angle / EIGHTH_TURN) % 4) + 4) % 4;

  return RESIZE_CURSORS[index] ?? 'nwse-resize';
}

export function gripCursor(grip: SelectionGrip, rotation: number): string {
  switch (grip.kind) {
    case 'move':
      return 'move';
    case 'rotate':
      return ROTATE_CURSOR;
    case 'scale':
      return resizeCursor(handleAngle(grip.handle) + rotation);
  }
}
