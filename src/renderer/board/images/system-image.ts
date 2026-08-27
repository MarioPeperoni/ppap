import type { Bytes } from '@/types';

/** The image on the system clipboard as PNG bytes, or null when it holds none. */
export async function readSystemImage(): Promise<Bytes | null> {
  try {
    return await window.ppap.clipboard.readImage();
  } catch (error) {
    console.error('Failed to read the system clipboard', error);

    return null;
  }
}

/** Lays PNG bytes on the system clipboard, where every other application can reach them. */
export async function writeSystemImage(png: Bytes): Promise<void> {
  try {
    await window.ppap.clipboard.writeImage(png);
  } catch (error) {
    console.error('Failed to write the system clipboard', error);
  }
}
