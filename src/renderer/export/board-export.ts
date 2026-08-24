import { EXPORT_MAX_PIXELS, EXPORT_PADDING, EXPORT_SCALE } from '@/constants/export.constants';
import { boundsOfElements } from '@/core/element/element-bounds';
import { expandBounds } from '@/core/geometry/bounds';
import { imageCache } from '@/renderer/assets/image-cache';
import { selectedElements } from '@/renderer/board/selection/selection-query';
import { canvasToPng, renderElements } from '@/renderer/export/scene-image';
import { useBoardStore } from '@/renderer/stores/board.store';
import type { Element } from '@/types';

async function renderRegion(
  elements: readonly Element[],
  padding: number,
): Promise<Uint8Array | null> {
  const content = boundsOfElements(elements);
  if (content === null) return null;

  await imageCache.ready(elements);

  const bounds = expandBounds(content, padding);
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const scale = Math.min(EXPORT_SCALE, EXPORT_MAX_PIXELS / Math.max(width, height));

  return canvasToPng(
    renderElements(elements, bounds, { width: width * scale, height: height * scale }, scale),
  );
}

export async function exportBoardImage(): Promise<void> {
  const { elements, name } = useBoardStore.getState();
  const png = await renderRegion([...elements.values()], EXPORT_PADDING);
  if (png === null) return;

  await window.ppap.library.exportImage(name, png);
}

export async function copySelectionImage(): Promise<void> {
  const png = await renderRegion(selectedElements(), 0);
  if (png === null) return;

  await window.ppap.clipboard.writeImage(png);
}
