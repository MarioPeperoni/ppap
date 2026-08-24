import { open, rename } from 'node:fs/promises';
import { TEMP_EXTENSION } from '@/constants/library.constants';

export async function writeAtomic(target: string, data: Uint8Array | string): Promise<void> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const temp = `${target}${TEMP_EXTENSION}`;
  const handle = await open(temp, 'w');

  try {
    await handle.write(bytes);
    await handle.sync();
  } finally {
    await handle.close();
  }

  await rename(temp, target);
}
