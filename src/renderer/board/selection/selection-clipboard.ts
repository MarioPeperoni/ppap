import { cloneElement } from '@/core/element/element.factory';
import { digestAsset } from '@/renderer/assets/asset-digest';
import { readSystemImage } from '@/renderer/board/images/system-image';
import type { Element } from '@/types';

let held: readonly Element[] = [];
let systemImage: string | null = null;

async function rememberSystemImage(): Promise<void> {
  const png = await readSystemImage();
  systemImage = png === null ? null : await digestAsset(png);
}

export function writeClipboard(elements: readonly Element[]): void {
  held = elements.map(cloneElement);
  void rememberSystemImage();
}

export function readClipboard(): readonly Element[] {
  return held;
}

/** Whether the held elements were copied while this image sat on the system clipboard. */
export function copiedWithSystemImage(imageDigest: string): boolean {
  return held.length > 0 && systemImage === imageDigest;
}
