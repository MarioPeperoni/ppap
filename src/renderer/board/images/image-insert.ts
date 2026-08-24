import { IMAGE_STACK_OFFSET } from '@/constants/image.constants';
import { MAX_IMAGE_BYTES } from '@/constants/library.constants';
import { createImage } from '@/core/element/element.factory';
import { fitImageSize } from '@/core/image/image-fit';
import { sniffImageMime } from '@/core/image/image-mime';
import { appendPatch } from '@/core/scene/scene-patch';
import { digestAsset } from '@/renderer/assets/asset-digest';
import { imageCache } from '@/renderer/assets/image-cache';
import { holdAsset } from '@/renderer/assets/pending-assets';
import { activateSelectionTool } from '@/renderer/board/selection/selection-actions';
import { commitSelectionPatch } from '@/renderer/commands/selection.command';
import type { ImageElement, Point } from '@/types';

async function readImage(source: Blob, at: Point): Promise<ImageElement | null> {
  if (source.size > MAX_IMAGE_BYTES) return null;

  const bytes = new Uint8Array(await source.arrayBuffer());
  const mime = sniffImageMime(bytes);
  if (mime === null) return null;

  const assetId = await digestAsset(bytes);
  const bitmap = imageCache.get(assetId) ?? (await createImageBitmap(source));
  const size = fitImageSize(bitmap.width, bitmap.height);

  imageCache.put(assetId, bitmap);
  holdAsset(assetId, bytes);

  return createImage({
    assetId,
    mime,
    x: at.x - size.width / 2,
    y: at.y - size.height / 2,
    width: size.width,
    height: size.height,
    naturalWidth: bitmap.width,
    naturalHeight: bitmap.height,
  });
}

export async function insertImages(sources: readonly Blob[], at: Point): Promise<void> {
  const inserted: ImageElement[] = [];

  for (const [index, source] of sources.entries()) {
    const offset = index * IMAGE_STACK_OFFSET;
    const element = await readImage(source, { x: at.x + offset, y: at.y + offset });
    if (element !== null) inserted.push(element);
  }

  if (inserted.length === 0) return;

  activateSelectionTool();
  commitSelectionPatch(
    'insert image',
    appendPatch(inserted),
    inserted.map((element) => element.id),
  );
}
