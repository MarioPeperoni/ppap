import { describe, expect, it } from 'vitest';
import { sniffImageMime } from '@/core/image/image-mime';

function bytesOf(values: readonly number[], length = 16): Uint8Array {
  const bytes = new Uint8Array(length);
  bytes.set(values);

  return bytes;
}

describe('image mime sniffing', () => {
  it('recognises a png header', () => {
    expect(sniffImageMime(bytesOf([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(
      'image/png',
    );
  });

  it('recognises a jpeg header', () => {
    expect(sniffImageMime(bytesOf([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg');
  });

  it('recognises a webp header only when both magics match', () => {
    const riff = [0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00];

    expect(sniffImageMime(bytesOf([...riff, 0x57, 0x45, 0x42, 0x50]))).toBe('image/webp');
    expect(sniffImageMime(bytesOf([...riff, 0x41, 0x56, 0x49, 0x20]))).toBeNull();
  });

  it('rejects bytes that are not an image', () => {
    expect(sniffImageMime(bytesOf([0x7b, 0x22, 0x61, 0x22]))).toBeNull();
    expect(sniffImageMime(new Uint8Array())).toBeNull();
  });
});
