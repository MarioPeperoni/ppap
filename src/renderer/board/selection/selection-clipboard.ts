import { cloneElement } from '@/core/element/element.factory';
import { digestAsset } from '@/renderer/assets/asset-digest';
import { readSystemImage, writeSystemImage } from '@/renderer/board/images/system-image';
import { renderSelectionImage } from '@/renderer/export/board-export';
import type { Element } from '@/types';

let held: readonly Element[] = [];
let systemImage: string | null = null;

/** Digests what the clipboard hands back, not what went in, so a re-encode still matches. */
async function rememberSystemImage(): Promise<void> {
  const png = await readSystemImage();
  systemImage = png === null ? null : await digestAsset(png);
}

/** Holds the elements for this app and lays the same fragment on the system clipboard as PNG. */
export async function writeClipboard(elements: readonly Element[]): Promise<void> {
  held = elements.map(cloneElement);
  systemImage = null;

  const png = await renderSelectionImage(held);
  if (png !== null) await writeSystemImage(png);

  await rememberSystemImage();
}

export function readClipboard(): readonly Element[] {
  return held;
}

/** Whether the held elements were copied while this image sat on the system clipboard. */
export function copiedWithSystemImage(imageDigest: string): boolean {
  return held.length > 0 && systemImage === imageDigest;
}
