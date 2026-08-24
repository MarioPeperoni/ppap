import type { CameraState } from '@/types';

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 8;
export const WHEEL_ZOOM_FACTOR = 1.1;
export const STEP_ZOOM_FACTOR = 1.25;
export const FIT_PADDING = 64;
export const FIT_MAX_ZOOM = 1;

export const DEFAULT_CAMERA: CameraState = { x: 0, y: 0, zoom: 1 };
