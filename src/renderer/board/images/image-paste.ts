import { PNG_MIME } from '@/constants/export.constants';
import { digestAsset } from '@/renderer/assets/asset-digest';
import { insertImages } from '@/renderer/board/images/image-insert';
import { readSystemImage } from '@/renderer/board/images/system-image';
import { pasteClipboard } from '@/renderer/board/selection/selection-actions';
import { copiedWithSystemImage } from '@/renderer/board/selection/selection-clipboard';
import type { Point } from '@/types';

/** The system image wins unless the held elements were copied while that same image was there. */
export async function pasteAt(at: Point): Promise<void> {
  const png = await readSystemImage();

  if (png !== null && !copiedWithSystemImage(await digestAsset(png))) {
    await insertImages([new Blob([png], { type: PNG_MIME })], at);
    return;
  }

  pasteClipboard(at);
}
