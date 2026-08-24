import { THUMBNAIL_HEIGHT, THUMBNAIL_PADDING, THUMBNAIL_WIDTH } from '@/constants/export.constants';
import { boundsOfElements } from '@/core/element/element-bounds';
import { canvasToPng, renderElements } from '@/renderer/export/scene-image';
import { useBoardStore } from '@/renderer/stores/board.store';
import type { Bounds } from '@/types';

const SIZE = { width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT };
const EMPTY_BOUNDS: Bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

function fitScale(bounds: Bounds): number {
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  if (width <= 0 || height <= 0) return 1;

  return Math.min(
    (THUMBNAIL_WIDTH - THUMBNAIL_PADDING * 2) / width,
    (THUMBNAIL_HEIGHT - THUMBNAIL_PADDING * 2) / height,
    1,
  );
}

export function renderThumbnail(): Promise<Uint8Array> {
  const elements = [...useBoardStore.getState().elements.values()];
  const bounds = boundsOfElements(elements) ?? EMPTY_BOUNDS;

  return canvasToPng(renderElements(elements, bounds, SIZE, fitScale(bounds)));
}
